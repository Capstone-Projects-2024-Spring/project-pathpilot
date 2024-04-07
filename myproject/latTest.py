from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut


geolocator = Nominatim(user_agent="Geopy Library")
list = ["4 W Palmer St, Philadelphia, PA 19125", "1849 Willington St Philadelphia, PA", '1740 Willington St Philadelphia, PA']
for i in list:
    location_variable = geolocator.geocode("4 W Palmer St, Philadelphia, PA 19125", limit=10, exactly_one=False)
    print(location_variable)

    try:
            location_variable = geolocator.geocode(address, limit=10, exactly_one=False)
            print("Latitude: " + location_variable.latitude)
            print("Longitude " + location_variable.longitude)
        except GeocoderTimedOut:
            logging.info('TIMED OUT: GeocoderTimedOut: Retrying...')
            sleep(randint(1*100,2*100)/100)
            location_variable = geolocator.geocode(address, limit=10, exactly_one=False)
            geolocator.geocode(address, limit=10, exactly_one=False)
            print("Latitude: " + location_variable.latitude)
            print("Longitude " + location_variable.longitude)
        except GeocoderServiceError as e:
            logging.info('CONNECTION REFUSED: GeocoderServiceError encountered.')
            logging.error(e)
            print("Can't do it sorry")
            continue
        except Exception as e:
            logging.info('ERROR: Terminating due to exception {}'.format(e))
            print("Can't do it sorry")
            continue