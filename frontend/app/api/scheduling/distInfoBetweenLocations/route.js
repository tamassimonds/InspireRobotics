

import {NextResponse} from 'next/server';

const DATA_SOURCE_URL = 'https://jsonplaceholder.typicode.com/todos';


const HERE_API_KEY = "TecZa84n1w9m8-sJ-PpF063n1jC6MJzsYsXjitp_xjA"; //Service used for map routing

import axios from "axios";

async function getGeocodeFromAddress(address) {
  if (!address) {
    throw new Error("Address is required");
  }

  // Encode the address to be URL-safe
  const encodedAddress = encodeURIComponent(address);
 

  // Construct the URL for the HERE Discover API
  const url = `https://discover.search.hereapi.com/v1/discover?at=37.8136,144.9631&limit=2&q=${encodedAddress}&apiKey=${HERE_API_KEY}`;

  try {
    
    const response = await axios.get(url);
    console.log(response.data.items[0].position)
    return response.data.items[0].position;
  } catch (error) {
    console.error('Error fetching geocode information:', error);
    throw error; // Rethrow the error for the caller to handle
  }
}


export async function GET() {
    console.log("RECIEVED")
    const response = await fetch(DATA_SOURCE_URL);
    const data = await response.json();
    
    return new NextResponse(JSON.stringify(data), {
        headers: {
        'content-type': 'application/json',
        },
    });
    }
    

export async function DELETE(request) {
    const id = await request.json();
    if(!id) return new NextResponse({"message": "No id provided"});

    await fetch(`${DATA_SOURCE_URL}/${id}`, {
        method: 'DELETE',
        header: {
            'content-type': 'application/json',
            'API_KEY': '1234'
        }
    })
    return new NextResponse({"message": `Deleted item with id ${id}`});
}

export async function POST(req, res) {

  
    const { origin: originAddress, destination: destinationAddress } = await req.json();
    console.log(`distBetweenLocations POST Recieved: origin: ${originAddress}, dest: ${destinationAddress}`)
    if (!originAddress || !destinationAddress) {
    return new NextResponse({"message": `ERROR`});
      
    }
  
    try {
      const originCoords = await getGeocodeFromAddress(originAddress);
      const destinationCoords = await getGeocodeFromAddress(destinationAddress);
  
      if (!originCoords || !destinationCoords) {
        throw new Error("Could not retrieve geocode for origin or destination");
      }
  
      const origin = `${originCoords.lat},${originCoords.lng}`;
      const destination = `${destinationCoords.lat},${destinationCoords.lng}`;
      
  
      const url = `https://router.hereapi.com/v8/routes?origin=${origin}&destination=${destination}&return=summary,typicalDuration&transportMode=car&apikey=${HERE_API_KEY}`;
  
      const routeResponse = await axios.get(url);
      if (!routeResponse.data.routes[0] || !routeResponse.data.routes[0].sections) {
        throw new Error("Unable to find a route between the specified addresses");
        }
      console.log(JSON.stringify(routeResponse.data.routes[0].sections[0].summary, null, 2));
      return new NextResponse(JSON.stringify(routeResponse.data.routes[0].sections[0].summary, null, 2));
      
    } catch (error) {
      console.log("error", error)
      return new NextResponse({"message": `ERROR`});
    }
  }
