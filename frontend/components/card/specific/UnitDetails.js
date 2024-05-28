'use client'

import Card from '@mui/joy/Card';
import { useEffect, useState } from 'react';
import { getUnitWithID } from '/lib/firebase/inventoryFirebaseLogic'
import Button from '@mui/joy/Button';
import { useRouter } from 'next/navigation';

export default function CourseDetailsCard({ unitID }) {
    const [isLoading, setIsLoading] = useState(true); // This will be an array of objects with the shape: [{id: string, name: string}
    const [unitData, setUnitData] = useState({
        id: '',
        kit: {
            name: '',
            id: '',
        },
        course: {
            name: '',
            id: '', // Generate a unique ID for each course
        },
    })

    const router = useRouter();

    useEffect(() => {
        async function getUnitData() {
            console.log(unitID);
            const data = await getUnitWithID(unitID);
            setUnitData(data);
            console.log(data);
            setIsLoading(false)
        }
        getUnitData();
    }, [unitID]);

    const editPressed = () => {
        router.push(`/admin/inventory/units/addUnit?id=${unitID}`)
        console.log("edit pressed")
    }
    
    if (isLoading) {
        return (
            <div>
                
                <h2>Loading...</h2>
                
            </div>
        );
    }else{
    return (
        <div>
            <Card variant="outlined">
                <h1>Details</h1>
                <p>ID: {unitData?.id ?? 'N/A'}</p>
                <p>Kit Owner: {unitData.unitOwner.name ?? 'N/A'}</p>
                <p>Kit: {unitData?.kit?.name ?? 'No kit associated'}</p>
                <Button onClick={editPressed}>Edit</Button>
            </Card>
            <Card>
                <h1>
                    Recent Staff Flags
                </h1>

            </Card>
        </div>
    );
    }
}