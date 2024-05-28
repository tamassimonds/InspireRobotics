"use client"
import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from '@mui/joy/Card';
import Typography from '@mui/material/Typography'; // Import Typography
import { useSearchParams } from 'next/navigation';
import { getHolidayProgramById } from "/lib/firebase/holidayProgramsFirebaseLogic";
import StudentsEnrolledInProgramTable from "/components/table/specific/StudentsEnrolledInProgram.js";
import Button from '@mui/joy/Button';
import {useRouter} from 'next/navigation';


export default function Page() {
  const router = useRouter();
  const [programData, setProgramData] = useState(null); // State to store program data
  const searchParams = useSearchParams();
  const programID = searchParams.get('id');

  useEffect(() => {
    getHolidayProgramById(programID).then((data) => {
      console.log("program", data);
      setProgramData(data); // Update the state with the fetched data
    });
    console.log("programID", programID);
  }, [programID]); // Ensure useEffect runs only when programID changes

  const editPressed = () =>{
    router.push(`/admin/programs/holidayPrograms/editProgram?programID=${programID}`)
  }
  
  return (
    <div>
      <Card>
          <Typography variant="h5" component="h2">Program Details</Typography>
          {programData && (
            <div>
              <Typography><strong>Name:</strong> {programData.name}</Typography>
              <Typography><strong>Module Name:</strong> {programData.holidayProgramModule.name}</Typography>
              <Typography><strong>Course Name:</strong> {programData.courseName}</Typography>
              <Typography><strong>Location:</strong> {programData.locationName}, {programData.locationAddress}</Typography>
              <Typography><strong>Max Capacity:</strong> {programData.maxCapacity}</Typography>
              <Typography><strong>Age Range:</strong> {programData.holidayProgramModule.minAge} - {programData.holidayProgramModule.maxAge}</Typography>

              <Typography><strong>Cost per student:</strong> ${programData.holidayProgramModule.costPerStudent}</Typography>
              
              <br />
              <Typography><strong>Open to Public:</strong> {programData.openToPublic ? 'No' : 'Yes'}</Typography>
              <Typography><strong>Publish To Website:</strong> {programData.publishToWebsite ? 'No' : 'Yes'}</Typography>

              {/* Add more fields as needed */}
              <Button onClick={editPressed}>Edit</Button>
            </div>
          )}
        </Card>
      <Card>
        <Typography variant="h5" component="h2">Students Enrolled</Typography>
        <StudentsEnrolledInProgramTable programID={programID}/>
      </Card>
    </div>
  );
}