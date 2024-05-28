'use client'

import Card from '@mui/joy/Card';
import { useEffect, useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import { getSchoolWithID } from '/lib/firebase/library';
import Button from '@mui/joy/Button';
export default function SchoolDetailsCard({ schoolID, editSchoolPressed }) {
    const [schoolData, setSchoolData] = useState({})

    useEffect(() => {
        getSchoolWithID(schoolID).then((data) => {
            console.log("school", data);
            if (data) {
                const schoolDetails = data[0];
                setSchoolData(schoolDetails);
            }
        });
    }, [schoolID]);

    return (
        <Card style={{ padding: '20px', margin: '20px', textAlign: 'left', width: 'auto', maxWidth: 'none' }}>
            <Typography variant="h1">
                School Details
            </Typography>
            <Box>
                <Typography>
                    <strong>Name:</strong> {schoolData.name ?? ''}
                </Typography>
                <Typography>
                    <strong>Address:</strong> {schoolData.address ?? ''}
                </Typography>
                <Typography>
                    <strong>Primary:</strong> {schoolData.primary ? 'Yes' : 'No'}
                </Typography>
                <Typography>
                    <strong>Secondary:</strong> {schoolData.secondary ? 'Yes' : 'No'}
                </Typography>
                <Typography>
                    <strong>Public:</strong> {schoolData.public ? 'Yes' : 'No'}
                </Typography>
                { editSchoolPressed != undefined && (
                  <Button
                    onClick={editSchoolPressed}
                  >
                    Edit School
                  </Button>
                  )}
            </Box>
        </Card>
    );
}