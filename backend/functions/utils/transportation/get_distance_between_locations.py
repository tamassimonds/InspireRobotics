






# utils/transportation/address_to_geocode.py

import requests

from utils.transportation.address_to_geocode import AddressToGeocode
from utils.transportation.route import Route

HERE_API_KEY = "TecZa84n1w9m8-sJ-PpF063n1jC6MJzsYsXjitp_xjA"




def calculate_route(origin_address, destination_address):
    """
    Calculates the route between two addresses using the HERE Routing API.
    """
    try:
        origin_coords = AddressToGeocode.get_geocode_from_address(origin_address)
        destination_coords = AddressToGeocode.get_geocode_from_address(destination_address)

        if not origin_coords or not destination_coords:
            raise ValueError("Could not retrieve geocode for origin or destination")

        origin = f"{origin_coords['lat']},{origin_coords['lng']}"
        destination = f"{destination_coords['lat']},{destination_coords['lng']}"

        url = f"https://router.hereapi.com/v8/routes?origin={origin}&destination={destination}&return=summary,typicalDuration&transportMode=car&apikey={HERE_API_KEY}"

        route_response = requests.get(url)
        route_response.raise_for_status()

        if 'routes' in route_response.json() and route_response.json()['routes']:
            route = Route.db_to_obj(route_response.json()['routes'][0]['sections'][0]['summary'])
            return route
        else:
            raise ValueError("Unable to find a route between the specified addresses")

    except requests.RequestException as error:
        print(f'Error during route calculation: {error}')
        raise

# These functions can be called from other parts of your application as needed.
