import random
import sqlite3
import requests
import json
from operator import itemgetter

class PathController:

    neighborhood_zip_map = {
        "Bella Vista / Queens Village / Pennsport": ["19147"],
        "Fishtown / Callowhill / Northern Liberties": ["19125", "19123"],
        "Fairmount / Spring Garden": ["19130"],
        "Rittenhouse Square / Logan Square": ["19102", "19103", "19146"],
        "Chinatown / Old City": ["19107", "19106"],
        "North Broad": ["19121", "19132"],
        "Spruce Hill / Cedar Park / Point Breeze": ["19104", "19146"]
    }

    # Measured In Feet
    INITIAL_SEARCH_RADIUS = 3000
    SEARCH_RADIUS_LIMIT = 5000

    FEET_PER_DEGREE_LAT = 364000
    FEET_PER_DEGREE_LON = 288200

    def __init__(self):
        self.conn = sqlite3.connect('db.sqlite3')

    def calculateReasonableRoute(self, location_types, attributes, neighborhood):
        # Initialize variables
        route_ids = []
        attempted_starting_locations = set()
        search_radius = PathController.INITIAL_SEARCH_RADIUS
        last_location = None
        zip_codes = self.neighborhood_zip_map[neighborhood]
        print(zip_codes)

        # Continue until the route includes locations for all location types
        while len(route_ids) != len(location_types):
                
                # Fetch a random location of the current location type
                location_id = self.fetch_random_location(location_types[len(route_ids)], attempted_starting_locations, search_radius, last_location, attributes, zip_codes)

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
                        return None

        # Return the calculated route as a list of locations w/ all information included
        reasonable_route = []
        for location_id in route_ids:
            location_data = self.fetch_location_data(location_id)
            reasonable_route.append(location_data)

        return reasonable_route
    
    # This function returns a random LocationID from the Locations table that has the associated LocationType
        # Returns > 0 IF nearby location is found
        # Returns 0 IF no nearby location is found
        # Returns -1 IF there are no more available starting locations
    def fetch_random_location(self, location_type, attempted_starting_locations, search_radius, last_location, attributes, zip_codes):

        # Initialize database connection cursor
        cursor = self.conn.cursor()

        # If route is currently empty, select a random starting location
        if last_location is None:

            # Fetch all locations of specified location type
            cursor.execute(f"SELECT id, attributes FROM myapi_location WHERE location_type_id = {location_type} AND zip_code IN ({','.join(['?']*len(zip_codes))})", zip_codes)
            locations = cursor.fetchall()

            # Filter out starting locations that have been attempted already
            unattempted_starting_locations = [loc for loc in locations if loc[0] not in attempted_starting_locations]
            
            # IF there are no more unattempted starting_locations, return -1
            if len(unattempted_starting_locations) == 0:
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
                    return random_location["location"][0]
                else:
                    random_location = random.choice(unattempted_starting_locations)
                    return random_location[0]
        
        # If route is not currently empty, select a random location that is within the specified radius from the previous location
        else:

            # Fetch the location and latitude of the previous location
            cursor.execute(f"SELECT latitude, longitude FROM myapi_location WHERE id = {last_location}")
            previous_location = cursor.fetchone()
            previous_lat = previous_location[0]
            previous_lon = previous_location[1]

            # Calculate latitude and longitude ranges within the search radius
            lat_range = search_radius / PathController.FEET_PER_DEGREE_LAT
            lon_range = search_radius / PathController.FEET_PER_DEGREE_LON

            # Fetch nearby locations within the latitude and longitude ranges
            cursor.execute(f"SELECT id, attributes FROM myapi_location WHERE location_type_id = {location_type} AND zip_code IN ({','.join(['?']*len(zip_codes))}) AND (latitude BETWEEN {previous_lat - lat_range} AND {previous_lat + lat_range}) AND (longitude BETWEEN {previous_lon - lon_range} AND {previous_lon + lon_range})", zip_codes)
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
                    return random_location["location"][0]
                else:
                    random_location = random.choice(nearby_locations)
                    return random_location[0]
            
    def fetch_location_data(self, location_id):
        cursor = self.conn.cursor()
        cursor.execute(f"SELECT * FROM myapi_location WHERE id = {location_id}")
        location_data = cursor.fetchone()
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
                "X-Goog-Api-Key": "key-here"
            }

            response = requests.post(url, json=params, headers=header)
            return response.json()
        else:
            return None

# Simple Algorithm Test
    
location_types=['1','2']
attributes=[]
neighborhood = "North Broad"

path_controller = PathController()
route = path_controller.calculateReasonableRoute(location_types, attributes, neighborhood)

if route:
    print(route)
else:
    print("route error")