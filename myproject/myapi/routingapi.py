import requests

def get_lati_longi(api_key, address):

   

    url = 'https://maps.googleapis.com/maps/api/directions/json'

    location1 = {
        "address": "1801 N Broad St, Philadelphia, PA 19122"
    }

    location2 = {
        "address": "9739 Roosevelt Blvd, Philadelphia, PA 19114"
    }



    params = {

        "origin": "1801 N Broad St, Philadelphia, PA 19122",
        "destination": "9739 Roosevelt Blvd, Philadelphia, PA 19114",
        "mode": "walking",

        "key": api_key

    }


    header = {
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
    }



    response = requests.get(url, params=params)



    if response.status_code == 200:

        data = response.json()


        return data


    else:

        print("Failed to make the request.")

        return 0, 0

def use_routing_api(api_key):

   

    url = ' https://routes.googleapis.com/directions/v2:computeRoutes'

    location1 = {
        "address": "1801 N Broad St, Philadelphia, PA 19122"
    }

    location2 = {
        "address": "9739 Roosevelt Blvd, Philadelphia, PA 19114"
    }

    legs = [
        {
            "address": "2nd W Lehigh Ave, Philadelphia, PA 19133"
        }
    ]


    params = {

        "origin": location1,
        "destination": location2,
        "intermediates": legs,
        "travelMode": "WALK",

    }


    header = {
        "X-Goog-FieldMask": "routes.duration,routes.legs.startLocation,routes.legs.endLocation,routes.distanceMeters,routes.polyline.encodedPolyline",
        "X-Goog-Api-Key": api_key
    }



    response = requests.post(url, json=params, headers=header)



    if response.status_code == 200:

        data = response.json()


        return data


    else:

        print("Failed to make the request.")

        return 0, 0

api_key = "PUT KEY HERE"

address = '1801 N Broad St, Philadelphia, PA 19122'



#route = get_lati_longi(api_key, address)

#print(f"Distance: {route}")

#route2 = use_routing_api(api_key)
location1 = {
    "address": "1801 N Broad St, Philadelphia, PA 19122"
}

location2 = {
    "address": "9739 Roosevelt Blvd, Philadelphia, PA 19114"
}
params = {

        "origin": location1,
        "destination": location2,
        "travelMode": "WALK",

}

outer = {
    "address": location1["address"],
    "inside": params
}

print(f"Route: {outer}")
