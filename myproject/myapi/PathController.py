import random
import sqlite3

class PathController:

    # Measured In Feet
    INITIAL_SEARCH_RADIUS = 3000
    SEARCH_RADIUS_LIMIT = 10000

    FEET_PER_DEGREE_LAT = 364000
    FEET_PER_DEGREE_LON = 288200

    def __init__(self):
        self.conn = sqlite3.connect('../db.sqlite3')

    def calculateReasonableRoute(self, location_types):

        # Initialize variables
        route = []
        attempted_starting_locations = set()
        search_radius = PathController.INITIAL_SEARCH_RADIUS
        last_location = None

        # Continue until the route includes locations for all location types
        while len(route) != len(location_types):
                
                # Fetch a random location of the current location type
                location_id = self.fetch_random_location(location_types[len(route)], attempted_starting_locations, search_radius, last_location)

                # If nearby location is found, add location to route
                if location_id > 0:
                    route.append(location_id)
                    last_location = location_id

                # If no nearby location is found, backtrack to previous location
                elif location_id == 0:
                    location_id = route.pop()

                    # If the starting location can not be used for a reasonable route with the current search radius, mark it as attempted
                    if len(route) == 0:
                        attempted_starting_locations.add(location_id)

                # If there are no more valid starting locations, broaden the search radius and retry all attempted starting locations
                else:
                    search_radius += 1000
                    attempted_starting_locations.clear()

                    # If search radius exceeds limit, return None
                    if search_radius > PathController.SEARCH_RADIUS_LIMIT:
                        return None

        # Return the calculated route
        return route
    

    # This function returns a random LocationID from the Locations table that has the associated LocationType
        # Returns > 0 IF nearby location is found
        # Returns 0 IF no nearby location is found
        # Returns -1 IF there are no more available starting locations
    def fetch_random_location(self, location_type, attempted_starting_locations, search_radius, last_location):

        # Initialize database connection cursor
        cursor = self.conn.cursor()

        # If route is currently empty, select a random starting location
        if last_location is None:

            # Fetch all locations of specified location type
            cursor.execute(f"SELECT id FROM myapi_location WHERE location_type_id = {location_type}")
            locations = cursor.fetchall()

            # Filter out starting locations that have been attempted already
            unattempted_starting_locations = [loc for loc in locations if loc[0] not in attempted_starting_locations]
            
            # IF there are no more unattempted starting_locations, return -1
            if len(unattempted_starting_locations) == 0:
                return -1
            
            # Return a random unattempted starting location's ID
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
            cursor.execute(f"SELECT id FROM myapi_location WHERE location_type_id = {location_type} AND (latitude BETWEEN {previous_lat - lat_range} AND {previous_lat + lat_range}) AND (longitude BETWEEN {previous_lon - lon_range} AND {previous_lon + lon_range})")
            nearby_locations = cursor.fetchall()

            # If there are no nearby locations of the specified type, return 0
            if len(nearby_locations) == 0:
                return 0
            
            # Return a random nearby location's ID
            else:
                random_location = random.choice(nearby_locations)
                return random_location[0]

    def favoriteRoute(route):
        pass