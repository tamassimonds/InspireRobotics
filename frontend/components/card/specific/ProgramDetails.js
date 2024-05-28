'use client'

import Card from '@mui/joy/Card';
import { useEffect, useState } from 'react';
import { getCourseAndKitDetails } from '/lib/firebase/courseFirebaseLogic'
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import {getProgramWithID} from "/lib/firebase/library"

export default function ProgramDetailsCard({ programID, admin=false, editProgramPressed }) {

    const [programsData, setProgramsData] = useState([])


    useEffect(() => {
        getProgramWithID(programID).then((data) => {
          console.log("program", data);
          if (data) {
            const programData = data[0];
      
            // Directly check if 'isHolidayProgram' is undefined in programData
            if (programData.isHolidayProgram === undefined || programData.isHolidayProgram == false) {
              // Set isHolidayProgram to false if it's undefined
              setProgramsData({ ...programData, isHolidayProgram: false });
            } 
          }
        });
      }, [programID]);

      return (
      <Card style={{ padding: '20px', margin: '20px', textAlign: 'left', width: 'auto', maxWidth: 'none' }}>
          <Typography variant="h1" >
            Program Details
          </Typography>
          <Box>
            <Typography>
              <strong>Name:</strong> {programsData.name ?? ''}
            </Typography>
            <Typography>
              <strong>School Name:</strong> {programsData.schoolName ?? ''}
            </Typography>
            <Typography>
              <strong>Course Name:</strong> {programsData.courseName ?? ''}
            </Typography>
            <Typography>
              <strong>Num Student:</strong> {programsData.numStudents ?? ''}
            </Typography>
            <Typography>
            <strong>Year Level:</strong> {Array.isArray(programsData?.yearLevel) ? programsData?.yearLevel.join(', ') : ''}
            </Typography>
            <Typography>
              <strong>Start Date:</strong> {programsData.startDate ?? ''}
            </Typography>
            <Typography>
              <strong>End Date:</strong> {programsData.endDate ?? ''}
            </Typography>
           
            <Typography>
              <strong>Assigned Equipment:</strong> {programsData.handleEquipmentName ?? ''}
            </Typography>
            {admin && (
              <Typography>
                <strong>Revenue:</strong> {programsData.revenue ?? ''}
              </Typography>
            )}
          </Box>
          { editProgramPressed != undefined && (
          <Button
            onClick={editProgramPressed}
          >
            Edit Program
          </Button>
          )}
        </Card>
      );
    }