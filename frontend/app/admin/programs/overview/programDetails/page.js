"use client"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Card from "@mui/joy/Card"
import ProgramCalendar from "/components/calendar/specific/ProgramCalendar.js"
import Button from '@mui/joy/Button';
import DropDownTable from "/components/table/DropDownTable.js"
import {getAllProgramClassesSessions} from "/lib/firebase/library"
import Typography from '@mui/material/Typography';
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react';
 
import Table from "/components/table/Table.js"

import ProgramDetails from "/components/card/specific/ProgramDetails.js"
import ClassTable from "/components/table/specific/ClassesInProgramTable.js"

import ShiftsTable from "/components/table/specific/ShiftsInProgramTable.js"
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';
import {getProgramWithID} from "/lib/firebase/library"

export default function Home() {
  const router = useRouter()
  
  const [programsData, setProgramsData] = React.useState([])

  const searchParams = useSearchParams()
 
  const programID = searchParams.get('programID')

  useEffect(() => {
    getProgramWithID(programID).then((data) => {
      console.log("program", data);
      if (data) {
        const programData = data[0];
  
        // Directly check if 'isHolidayProgram' is undefined in programData
        if (programData.isHolidayProgram === undefined || programData.isHolidayProgram == false) {
          // Set isHolidayProgram to false if it's undefined
          setProgramsData({ ...programData, isHolidayProgram: false });
        } else {
          //Pushes to holiday Program Details page
             
          router.push(`/admin/programs/holidayPrograms/details?programID=${programID}`)

        }
      }
    });
  }, [programID]);


  const editProgramPressed = () =>{
   
    router.push(`/admin/programs/overview/programDetails/editProgram?isHolidayProgram=${programsData.isHolidayProgram}&programID=${programID}`)
  }

  const addClassPressed = () =>{
    router.push(`/admin/programs/overview/programDetails/editClass?page=add&programID=${programID}`)
  }

  const classEditPressed = (row) =>{
    router.push(`/admin/programs/overview/programDetails/editClass?page=edit&programID=${programID}&classID=${row.class}`)

  }

  return (
    <div>
     
      <ProgramDetails programID={programID} admin={true} editProgramPressed={editProgramPressed}/>
      <Stack spacing={3}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Classes</h1>
            <Button color="success" onClick={addClassPressed}>Add Class</Button>
          </div>
          <ClassTable programID={programID} onEditPressed={classEditPressed}></ClassTable>       
           </Card>
        <Card>
          <h1>Shifts</h1>
          <ShiftsTable programID={programID} ></ShiftsTable>

        </Card>
        
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid xs={12}>
            <Card>
              <ProgramCalendar programID={programID}></ProgramCalendar>
            </Card>
          </Grid>
          <Grid xs={0}>
          
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
}