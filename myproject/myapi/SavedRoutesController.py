import sqlite3

class SavedRoutesController:

    def __init__(self):
        self.conn = sqlite3.connect('db.sqlite3')

    def getLocationInfo(self, routes_ids):

        try:
            # Initialize database connection cursor
            cursor = self.conn.cursor()
            routes_info = []
            for route_ids in routes_ids:
                route_info = []
                for location_id in route_ids:
                    cursor.execute("SELECT * FROM myapi_location WHERE id = ?", (location_id,))
                    location_info = cursor.fetchall()
                    route_info.append(location_info)
                routes_info.append(route_info)
            cursor.close()

            locations_data = []
            for index, locations_list in enumerate(routes_info,start=1):
                location_data = []
                for index, location_info in enumerate(locations_list,start=1):
                    location_data.append([location_info[0][1], location_info[0][5]])
                locations_data.append(location_data)

            return locations_data


        except Exception as e:
        
            print("Error retrieving location info:", e)
            return None

    def getSavedRoutes(self, id):
        
        try:

            # Initialize database connection cursor
            cursor = self.conn.cursor()

            # Execute SQL query to select all routes for the given user ID
            cursor.execute("SELECT id FROM myapi_savedroute WHERE account_id = ?", (id,))

            # Fetch all the rows
            routes = cursor.fetchall()

            route_ids = [route[0] for route in routes]

            locations = []

            for route_id in route_ids:
                cursor.execute("SELECT location_id FROM myapi_savedroutelocation WHERE route_id = ?", (route_id,))
                location_ids = cursor.fetchall()
                location_ids = [location_id[0] for location_id in location_ids]
                locations.append(location_ids)

            # Close cursor
            cursor.close()

            return locations
    
        except Exception as e:
        
            print("Error retrieving saved routes:", e)
            return None

    def addSavedRoute(self, user_id, locations):

        # Initialize database connection cursor
        cursor = self.conn.cursor()

        location_ids = [item[0] for item in locations]

        try:
            # Insert a new route record into the Saved_Routes table
            cursor.execute("INSERT INTO myapi_savedroute (account_id, zip_code) VALUES (?,?)", (user_id, 1))
            route_id = cursor.lastrowid  # Get the auto-generated route ID

            # Insert locations associated with the route ID into the Saved_Routes_Locations table
            for location_order, location_id in enumerate(location_ids, start=1):
                cursor.execute("INSERT INTO myapi_savedroutelocation (route_id, location_id, location_order) VALUES (?, ?, ?)", (route_id, location_id, location_order))

        except Exception as e:
            self.conn.rollback()
            print("Error inserting data:", e)
        finally:
            self.conn.commit()
            self.conn.close()

    def deleteSavedRoute(user):
        pass
    
    def getCurrentAccount():
        pass