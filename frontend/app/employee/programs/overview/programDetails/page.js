"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Card from "@mui/joy/Card";
import ProgramCalendar from "/components/calendar/specific/ProgramCalendar.js";
import Grid from '@mui/material/Unstable_Grid2'; // Ensure you're using the correct import for Grid2
import ProgramDetails from "/components/card/specific/ProgramDetails.js";
import ClassesTable from "/components/table/specific/ClassesInProgramTable.js";
import ShiftsTable from "/components/table/specific/ShiftsInProgramTable.js";
import ProgramUnitDetails from "/components/card/specific/ProgramUnitDetails.js";

export default function Home() {
  const router = useRouter();
  const [userID, setUserID] = useState([]);
  const userData = useSelector(state => state.user.userData);
  // Note: Adjusted for clarity, ensure you have the correct hook for search params
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  const programID = searchParams.get('programID');

  useEffect(() => {
    if (userData && userData.id) {
      setUserID(userData.id);
      console.log("userID", userData.id);
    }
  }, [userData]);

  return (
    <div>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          {/* Adjustments made here for responsive design */}
          <Grid xs={12} sm={6}> {/* Full width on xs, half on sm and up */}
            <ProgramDetails programID={programID}/>
          </Grid>
          <Grid xs={12} sm={6}>
            <Card style={{ height: '300px'}}>
              <ProgramUnitDetails programID={programID}/>
            </Card>
          </Grid>

          {/* Repeating the pattern for other rows */}
          <Grid xs={12} sm={6}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Shifts</h1>
              </div>
              <ShiftsTable programID={programID} teacherID={userID}/>
            </Card>
          </Grid>
          <Grid xs={12} sm={6}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Classes</h1>
              </div>
              <ClassesTable programID={programID}/>
            </Card>
          </Grid>

          <Grid xs={12} sm={6}>
            <Card>
              <ProgramCalendar programID={programID}/>
            </Card>
          </Grid>
          {/* This Grid item appears to be empty and can be adjusted or removed as needed */}
          <Grid xs={12} sm={6}>
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
}
