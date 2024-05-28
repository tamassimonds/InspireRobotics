"use client"
import Card from '@mui/joy/Card';
import Button from '@mui/joy/Button';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { getLocationDetails} from '/lib/firebase/inventoryFirebaseLogic';
import {useRouter} from 'next/navigation';

export default function Home() {
  const [location, setLocation] = useState([]); // This will be an array of objects with the shape: [{id: string, name: string}

  const router = useRouter();

  const searchParams = useSearchParams();
  const locationID = searchParams.get('locationID');

  const editPressed = () => {
    router.push(`/admin/inventory/locations/addLocation?id=${locationID}`)
  }



  useEffect(() => {
    console.log(locationID);
    getLocationDetails(locationID).then((data) => {
      setLocation(data);
    })
    
  }, [locationID]);
  
    return (
      <div>
        <h1>Location Details</h1>
        <Card>
          <h2>{location.name}</h2>
          <p>{location.address}</p>
          <Button onClick={editPressed}>Edit</Button>
        </Card>



      </div>
     
    )
  }
  