from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut


geolocator = Nominatim(user_agent="Geopy Library")
list = ["124 S 18th St, Philadelphia, PA 19103", "1849 Willington St Philadelphia, PA", '1740 Willington St Philadelphia, PA']
for i in list:
    location_variable = geolocator.geocode(i, limit=10, exactly_one=False)
    print(location_variable)