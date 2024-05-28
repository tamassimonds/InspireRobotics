"use client"
import React, { useEffect, useState } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import NumberInput from "/components/inputs/NumberInput.js";
import Button from '@mui/joy/Button';
import CheckBox from '/components/inputs/CheckBox.js';
import Chip from '@mui/joy/Chip';
import Cloud from '@mui/icons-material/Cloud';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import Box from '@mui/joy/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { getProgramWithID } from "/lib/firebase/library";

export default function ProgramCard({ programData, programID, seeMoreDetailsPressed }) {
    const [program, setProgram] = useState(programData);


    //if we haven't been passed program data go fetch it based off programID
      useEffect(() => {
          if (programID && (programData == undefined)) {
              getProgramWithID(programID)
                  .then(data => {
                    console.log(data)
                      if (data.length > 0) {
                          setProgram(data[0]); // Assuming only one program is returned
                      }
                  })
                  .catch(error => {
                      console.error("Error fetching program:", error);
                  });
          }
      }, [programID]);
     
    // Check if program data is available before rendering
    if (!program) {
        return <div>Loading...</div>; // or some other placeholder content
    }

    return (
        <Card>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
                <Typography level="title-lg">{program.name}</Typography>
                <Box flexGrow={1} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip variant="soft" startDecorator={<TurnedInNotIcon />}>
                        {program.courseName}
                    </Chip>
                </Box>
            </Stack>
            
            <Typography level="title-md" sx={{ px: 2 }}>{program.schoolName}</Typography>
            <Typography variant="body2" sx={{ px: 2 }}>Start Date: {program.startDate}</Typography>
            <Typography variant="body2" sx={{ px: 2 }}>End Date: {program.endDate}</Typography>
            <Typography variant="body2" sx={{ px: 2 }}>Year Level: {/* Year level data here if available */}</Typography>
            
            <Button onClick={() => {seeMoreDetailsPressed(programData.id)}}>See More Details</Button>
        </Card>
    );
}