import sqlite3

class SavedRoutesController:

    def __init__(self):
        self.conn = sqlite3.connect('db.sqlite3')

    def getSavedRoutes(user):
        pass

    def addSavedRoute(self, user_id, locations):

        # Initialize database connection cursor
        cursor = self.conn.cursor()

        location_ids = [item[0] for item in locations]
        print("that user id = ", user_id)
        print("that locations = ", location_ids)

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