import httpx
from urllib.parse import quote

# Constants
HERE_API_KEY = "Z6SFAk3PgNDeBiQCgg6Ev_zeF_DIBNqZ9XjAbpIrQCE"



class AddressToGeocode:
    def get_geocode_from_address(address: str):
        if not address:
            raise ValueError("Address is required")

        # Encode the address to be URL-safe using urllib.parse.quote
        encoded_address = quote(address)

        # Construct the URL for the HERE Discover API
        url = f"https://discover.search.hereapi.com/v1/discover?at=37.8136,144.9631&limit=2&q={encoded_address}&apiKey={HERE_API_KEY}"

        # Perform the HTTP GET request
        try:
            with httpx.Client() as client:
                response = client.get(url)
            response.raise_for_status()  # Will raise an httpx.HTTPStatusError for 4XX/5XX responses

            # Access the position data of the first item in the response
            position_data = response.json()['items'][0]['position']
            return position_data

        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred: {e}")
        except httpx.RequestError as e:
            print(f"Request error occurred: {e}")
        except KeyError:
            print("Error processing the response data. It seems there was no valid position data returned.")
