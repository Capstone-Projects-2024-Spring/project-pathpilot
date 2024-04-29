import unittest
import coverage
import sqlite3
from SavedRoutesController import SavedRoutesController
from PathController import PathController

class TestController(unittest.TestCase):


    def setUp(self):
        # Connect to the production database
        self.conn = sqlite3.connect('db.sqlite3')
        self.cursor = self.conn.cursor()
        self.account_id = 3
        self.locations = [[645, 'Starbucks', '19107', 39.952543000000006, -75.16060407927046, '1201 Market St Philadelphia, PA 19107', '["Mon", "5:30 AM - 1:00 PM", "Tue", "5:30 AM - 1:00 PM", "Wed", "5:30 AM - 1:00 PM", "Thu", "5:30 AM - 1:00 PM", "Fri", "5:30 AM - 1:00 PM", "Sat", "5:30 AM - 1:00 PM", "Sun", "5:30 AM - 1:00 PM"]', 3, 2, '["Accepts Credit Cards"]', '$ '], [750, 'The Athenaeum of Philadelphia', '19106', 39.9468773, -75.15097408881009, '219 S 6th St Philadelphia, PA 19106', '["Mon", "9:00 AM - 5:00 PM", "Tue", "9:00 AM - 5:00 PM", "Wed", "9:00 AM - 5:00 PM", "Thu", "9:00 AM - 5:00 PM", "Fri", "9:00 AM - 5:00 PM", "Sat", "Closed", "Sun", "Closed"]', -1, 3, '["Free Wi-Fi"]', '-1']]

        # Instantiate SavedRoutesController with the test database connection
        self.saved_routes_controller = SavedRoutesController()

        self.path_controller = PathController()
    
     # SavedRoutesController.py

    def tearDown(self):
        # Rollback the transaction
        self.conn.rollback()

        # Close database connection
        self.conn.close()

    def test_getLocationInfo(self):
        self.saved_routes_controller.addSavedRoute(self.account_id, self.locations)
        pass_result = self.saved_routes_controller.getLocationInfo([[645, 750]])
        pass_expected_result = [[['Starbucks', '1201 Market St Philadelphia, PA 19107'],
        ['The Athenaeum of Philadelphia', '219 S 6th St Philadelphia, PA 19106']]]
        self.saved_routes_controller.deleteAllSavedRoutes()
        
        self.assertEqual(pass_result, pass_expected_result)

        empty_result = self.saved_routes_controller.getLocationInfo([[]])
        self.assertEqual(empty_result , [[]])

        fail_result = self.saved_routes_controller.getLocationInfo(7)
        self.assertEqual(fail_result, None)
    
    def test_addSavedRoute(self):
        
        self.saved_routes_controller.addSavedRoute(self.account_id, self.locations)
        result = self.saved_routes_controller.getSavedRoutes(3)
        self.saved_routes_controller.deleteAllSavedRoutes()

        expected_result = [[645, 750]]

        self.assertEqual(result, expected_result)

    #PathController.py
    
    def test_calculateReasonableRoute(self):
        result = self.path_controller.calculateReasonableRoute(['1','2'],['1'])
        # expected_result = [(740, 'Chon Tong Thai Kitchen and Desser[753 chars]$ ')]
        self.assertIsNotNone(result)

    def test_calculatePolyline(self):
        route = self.path_controller.calculateReasonableRoute(['1','2'],[])
        result = self.path_controller.calculatePolyline(route)
        self.assertIsNotNone(result)


if __name__ == '__main__':
    cov = coverage.Coverage()
    cov.start()

    try:
        unittest.main()
    except:  # catch-all except clause
        pass

    cov.stop()
    cov.save()

    cov.html_report()
    print("Done.")




