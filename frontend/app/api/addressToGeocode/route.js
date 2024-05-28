

import {NextResponse} from 'next/server';
import axios from "axios";

const DATA_SOURCE_URL = 'https://jsonplaceholder.typicode.com/todos';

export async function GET() {
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


const HERE_API_KEY = "Z6SFAk3PgNDeBiQCgg6Ev_zeF_DIBNqZ9XjAbpIrQCE"; 

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

export async function POST(request) {
    const {address} = await request.json();
    console.log(address)
    if(!address) return new NextResponse({"message": "No address provided"});

    const geoCode = await getGeocodeFromAddress(address);
    
    return new NextResponse(JSON.stringify(geoCode));
}