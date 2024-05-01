import sqlite3
import csv
import json
import geopy
from geopy.geocoders import Nominatim

def get_zip_code(latitude, longitude):
    geolocator = Nominatim(user_agent="Geopy Library")
    location = geolocator.reverse((latitude, longitude))
    address = location.raw['address']
    zip_code = address.get('postcode')
    return zip_code

def main():
    conn = sqlite3.connect('myproject/db.sqlite3')
    print("opened database successfully")
    cursor = conn.cursor()
    with open('myproject/csvs/Regional_Rail_Stations (1).csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in reader:
            name = row[1]
            latitude = row[2]
            longitude = row[3]
            zipcode = get_zip_code(latitude,longitude)
            address = row[4]
            hours = row[5]
            rating = row[6] 
            loTypeID = row[7]
            attributes = row[8]
            priceValue = row[9]
            cursor.execute("INSERT INTO myapi_location (location_name, zip_code, latitude, longitude, street_address, hours_of_op, average_star_rating, location_type_id, attributes, cost) VALUES (?,?,?,?,?,?,?,?,?,?)", (name, zipcode, latitude, longitude, address, json.dumps(hours) , rating, loTypeID, json.dumps(attributes), priceValue))
            conn.commit()
            print(zipcode)
    conn.close()
    
if __name__ == '__main__':
   #cProfile.run('main()', sort='ncalls')
    main()

# this is the subway data manipulation
    """conn = sqlite3.connect('myproject/db.sqlite3')
    print("opened database successfully")
    cursor = conn.cursor()
    with open('myproject/Public Transit DB.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in reader:
            name = row[0]
            zipcode = row[1]
            latitude = row[2]
            longitude = row[3]
            address = row[4]
            hours = row[5]
            rating = row[6] 
            loTypeID = row[7]
            attributes = row[8]
            priceValue = row[9]
            cursor.execute("INSERT INTO myapi_location (location_name, zip_code, latitude, longitude, street_address, hours_of_op, average_star_rating, location_type_id, attributes, cost) VALUES (?,?,?,?,?,?,?,?,?,?)", (name, zipcode, latitude, longitude, address, json.dumps(hours) , rating, loTypeID, json.dumps(attributes), priceValue))
            conn.commit()
            print("Added to database successfully")
    conn.close()"""