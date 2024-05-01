import random
import sqlite3
import requests
import json
from operator import itemgetter
import multiprocessing

#global transit value, want to ensure we don't skip first value (allows us to redo original fetch)
class PathController:

    # Ensure this is in sync with neighborhoods in PlanManualInput.jsx
    neighborhood_zip_map = {
    # Bella Vista / Queens Village / Pennsport
    1: ["19147"],
    
    # Northern Liberties / Callowhill
    2: ["19123"],

    # Fishtown
    3: ["19125"],
    
    # Fairmount / Spring Garden
    4: ["19130"],
    
    # Rittenhouse Square / Logan Square
    5: ["19102", "19103", "19146"],
    
    # Chinatown / Old City
    6: ["19107", "19106"],
    
    # Spruce Hill / Cedar Park / Point Breeze
    7: ["19104", "19146"],

    # North Broad
    8: ["19121", "19132"],
    }

    # Measured In Feet
    INITIAL_SEARCH_RADIUS = 2000
    SEARCH_RADIUS_LIMIT = 5000

    FEET_PER_DEGREE_LAT = 364000
    FEET_PER_DEGREE_LON = 288200


    # This function returns a random LocationID from the Locations table that has the associated LocationType
        # Returns > 0 IF nearby location is found
        # Returns 0 IF no nearby location is found
        # Returns -1 IF there are no more available starting locations

    def fetch_random_location(self, location_type, attempted_starting_locations, search_radius, last_location, attributes, zip_codes, transit_type, cost, stars):
        conn = sqlite3.connect('db.sqlite3')

        # Initialize database connection cursor
        conn = sqlite3.connect('db.sqlite3')
        cursor = conn.cursor()


        where_clause = self.get_where_clause(location_type, last_location, search_radius, zip_codes, cost, stars)

        # If route is currently empty, select a random starting location
        if last_location is None:
            cursor.execute(f"SELECT id,attributes FROM myapi_location {where_clause}")

            locations = cursor.fetchall()


            # Filter out starting locations that have been attempted already
            unattempted_starting_locations = [loc for loc in locations if loc[0] not in attempted_starting_locations]
            
            # IF there are no more unattempted starting_locations, return -1
            if len(unattempted_starting_locations) == 0:
                conn.close()
                return -1
            
            # Return a random unattempted starting location's ID
            else:
                if len(attributes) > 0:
                    unattempted_starting_locations_with_attributes = []
                    for loc in unattempted_starting_locations:
                        attributeList = json.loads(loc[1])
                        numAttributes = 0
                        for attribute in attributes:
                            if attribute in attributeList:
                                numAttributes = numAttributes + 1
                        unattempted_starting_locations_with_attributes.append({
                            "location": loc,
                            "numAttributes": numAttributes
                        })
            
                    sort_unnattempted_list = sorted(unattempted_starting_locations_with_attributes, key=itemgetter('numAttributes'), reverse=True)

                    maxCount = sort_unnattempted_list [0]["numAttributes"]
                    counter = 0
                    while counter < len(sort_unnattempted_list) and sort_unnattempted_list [counter]["numAttributes"] == maxCount:
                        counter = counter + 1
                    counter = counter - 1
                    random_location_id = random.randint(0,counter)
                    random_location = sort_unnattempted_list[random_location_id]
                    conn.close()
                    return random_location["location"][0]
                else:
                    random_location = random.choice(unattempted_starting_locations)
                    conn.close()
                    return random_location[0]
        
        # If route is not currently empty, select a random location that is within the specified radius from the previous location
        else:
            cursor.execute(f"SELECT id,attributes FROM myapi_location {where_clause}")
            nearby_locations = cursor.fetchall()
            nearby_locations_with_attributes = []

            if len(attributes) > 0:
                for loc in nearby_locations:
                    attributeList = json.loads(loc[1])
                    numAttributes = 0
                    for attribute in attributes:
                        if attribute in attributeList:
                            numAttributes = numAttributes + 1
                    nearby_locations_with_attributes.append({
                        "location": loc,
                        "numAttributes": numAttributes
                    })
            
                sort_nearby_list = sorted(nearby_locations_with_attributes, key=itemgetter('numAttributes'), reverse=True)

            # If there are no nearby locations of the specified type, return 0
            if len(nearby_locations) == 0:
                conn.close()
                return 0
            
            # Return a random nearby location's ID
            else:
                if len(attributes) > 0:
                    maxCount = sort_nearby_list[0]["numAttributes"]
                    counter = 0
                    while counter < len(sort_nearby_list) and sort_nearby_list[counter]["numAttributes"] == maxCount:
                        counter = counter + 1
                    counter = counter - 1
                    random_location_id = random.randint(0,counter)
                    random_location = sort_nearby_list[random_location_id]
                    conn.close()
                    return random_location["location"][0]
                else:
                    random_location = random.choice(nearby_locations)
                    conn.close()
                    return random_location[0]

    def get_where_clause(self, location_type, last_location, search_radius, zip_codes, cost, stars):
        where_clause = f"WHERE location_type_id = {location_type}"

        if last_location is not None:
            # Initialize database connection cursor
            conn = sqlite3.connect('db.sqlite3')
            cursor = conn.cursor()

            # Fetch the location and latitude of the previous location
            cursor.execute(f"SELECT latitude, longitude FROM myapi_location WHERE id = {last_location}")
            previous_location = cursor.fetchone()
            previous_lat = previous_location[0]
            previous_lon = previous_location[1]
            conn.close()

            # Calculate latitude and longitude ranges within the search radius
            lat_range = search_radius / PathController.FEET_PER_DEGREE_LAT
            lon_range = search_radius / PathController.FEET_PER_DEGREE_LON
            nearby_location_clause = f" AND (latitude BETWEEN {previous_lat - lat_range} AND {previous_lat + lat_range}) AND (longitude BETWEEN {previous_lon - lon_range} AND {previous_lon + lon_range})"
            where_clause += nearby_location_clause

        if zip_codes is not None:
            zip_codes_str = ','.join([f"'{zip_code}'" for zip_code in zip_codes])
            zip_code_clause = f" AND zip_code IN ({zip_codes_str})"
            where_clause += zip_code_clause

        if cost is not None:
            cost_clause = f" AND cost = '{cost} '"
            where_clause += cost_clause

        if stars is not None:
            stars_clause = f" AND average_star_rating >= {stars}"
            where_clause += stars_clause

        return where_clause

    def fetch_location_data(self, location_id):
        conn = sqlite3.connect('db.sqlite3')
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM myapi_location WHERE id = {location_id}")
        location_data = cursor.fetchone()
        conn.close()
        return location_data

    def favoriteRoute(route):
        pass

    def calculatePolyline(self, route):
        url = ' https://routes.googleapis.com/directions/v2:computeRoutes'

        #location1 = {
         #   "address": "1801 N Broad St, Philadelphia, PA 19122"
        #}

        if len(route) > 1:
            locationsForRouting = []

            for place in route:
                locationsForRouting.append(
                    {
                        "location": {
                            "latLng": {
                                "latitude": place[3],
                                "longitude": place[4]
                            }
                        }
                    }
                )
            
            params = None

            if len(route) > 2:
                params = {

                    "origin": locationsForRouting[0],
                    "intermediates": locationsForRouting[1:len(locationsForRouting)-1],
                    "destination": locationsForRouting[len(locationsForRouting)-1],
                    "travelMode": "WALK",

                }
            else:
                params = {

                    "origin": locationsForRouting[0],
                    "destination": locationsForRouting[1],
                    "travelMode": "WALK",

                }                

            header = {
                "X-Goog-FieldMask": "routes.duration,routes.legs.startLocation,routes.legs.endLocation,routes.distanceMeters,routes.polyline.encodedPolyline",
                "X-Goog-Api-Key": "keyHere"

            }

            response = requests.post(url, json=params, headers=header)
            return response.json()
        else:
            return None
        

    def calculateReasonableRouteFunc(self, location_types, attributes, neighborhood, transit_type, cost, stars, route):

        # Initialize variables
        route_ids = []
        attempted_starting_locations = set()
        search_radius = PathController.INITIAL_SEARCH_RADIUS
        last_location = None
        zip_codes = self.neighborhood_zip_map[neighborhood] if neighborhood is not None else None

        # Continue until the route includes locations for all location types
        while len(route_ids) != len(location_types):
                
                # Fetch a random location of the current location type

                location_id = self.fetch_random_location(location_types[len(route_ids)], attempted_starting_locations, search_radius, last_location, attributes, zip_codes, transit_type, cost, stars)


                # If nearby location is found, add location to route
                if location_id > 0:
                    route_ids.append(location_id)
                    last_location = location_id

                # If no nearby location is found, backtrack to previous location
                elif location_id == 0:
                    location_id = route_ids.pop()

                    # If the starting location can not be used for a reasonable route with the current search radius, mark it as attempted
                    if len(route_ids) == 0:
                        attempted_starting_locations.add(location_id)

                # If there are no more valid starting locations, broaden the search radius and retry all attempted starting locations
                else:
                    search_radius += 1000
                    attempted_starting_locations.clear()

                    # If search radius exceeds limit, return None
                    if search_radius > PathController.SEARCH_RADIUS_LIMIT:
                        route["route"] = None

        # Return the calculated route as a list of locations w/ all information included
        reasonable_route = []
        for location_id in route_ids:
            location_data = self.fetch_location_data(location_id)
            reasonable_route.append(location_data)

        route["route"] = reasonable_route
    

    def calculateReasonableRoute(self, location_types, attributes, neighborhood, transitType, cost, stars):
        manager = multiprocessing.Manager()
        route = manager.dict()

        p = multiprocessing.Process(target=self.calculateReasonableRouteFunc, args=(location_types,attributes,neighborhood, transitType, cost, stars, route))

        p.start()
        p.join(10)

        #if thread is still alive
        if p.is_alive():
            print("kill the thread")
            p.terminate()
            p.join()
            return None
        else:
            reasonable_route = route["route"]
            return reasonable_route
# Simple Algorithm Test

if __name__ == '__main__':    
    location_types=['1','2','3','4']
    attributes=[]
    neighborhood = 2

    path_controller = PathController()
    route = path_controller.calculateReasonableRoute(location_types, attributes, neighborhood)

    if route:
        print(route)
    else:
        print("route error")