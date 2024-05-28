

import {NextResponse} from 'next/server';

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

export async function POST(request) {
    const {userID, tittle} = await request.json();
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