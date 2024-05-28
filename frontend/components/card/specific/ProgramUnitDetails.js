import Card from '@mui/joy/Card';
import { useEffect, useState } from 'react';
import { getUnitWithProgramID } from '/lib/firebase/inventoryFirebaseLogic'; // make sure this function is defined and exported
import Button from '@mui/joy/Button';
import { useRouter } from 'next/navigation'; // Corrected from 'next/navigation' to 'next/router'
import UnitCard from '/components/card/specific/UnitDetails.js';

export default function CourseDetailsCard({ programID, admin = false }) {
    const [isLoading, setIsLoading] = useState(true);
    const [unitData, setUnitData] = useState(null); // Start with null since we'll be fetching an object

    const router = useRouter();

    useEffect(() => {
        async function fetchUnitData() {
            if (programID) { // Make sure programID is not null or undefined
                console.log('Fetching unit with Program ID:', programID);
                const data = await getUnitWithProgramID(programID);
                setUnitData(data);
                console.log(data);
                setIsLoading(false);
            }
        }
        fetchUnitData();
    }, [programID]);

    const editPressed = () => {
        if (unitData && unitData.id) { // Make sure unitData and unitData.id are not null or undefined
            router.push(`/admin/inventory/units/addUnit?id=${unitData.id}`);
        }
    }

    if (isLoading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    } else if (unitData) { // Make sure unitData is not null or undefined
        return (
            <div>
              
                    <h1>Unit Details</h1>
                    <p>Unit Name: {unitData.kit?.name ?? 'No kit associated'}</p>
                    <p>Unit Address: {unitData.locationAddress ?? 'No kit associated'}</p>
                    <p>Unit ID: {unitData.id ?? 'No kit associated'}</p>
                    <p>Unit Address: {unitData.locationAddress ?? 'No kit associated'}</p>
                    {admin  && (<Button onClick={editPressed}>Edit</Button> )}
                    <Button color="success">Picked Up</Button>
         
                
            </div>
        );
    } else {
        return (
            <div>
                <h2>No unit data available</h2>
            </div>
        );
    }
}