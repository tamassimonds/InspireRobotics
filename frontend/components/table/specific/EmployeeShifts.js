import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Table from "/components/table/Table.js"; // Adjust the import path as needed
import { getAllSessionsForTeacher } from "/lib/firebase/employeeFirebaseLogic"; // Adjust the import path as needed
import Card from '@mui/joy/Card';
import Box from '@mui/material/Box'; // Import Box from MUI
import Typography from '@mui/joy/Typography'; // Import Typography from MUI
import Boolean from "/components/inputs/Boolean.js"

function UpcomingShiftsTable({ employeeID, shiftUpcoming=false }) {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUpcomingShifts, setIsUpcomingShifts] = useState(shiftUpcoming);
    const [shiftsData, setShiftsData] = useState({ shifts: {}, allClasses: [], allPrograms: [] });

  function transformShiftsToTableData(isUpcomingShifts, shifts, allClasses, allPrograms) {
    let tableData = [];
    const currentDate = moment(); // Use the current date

    // Create a map for programID to program details
    const programMap = allPrograms.reduce((map, program) => {
        map[program.id] = { programName: program.name, schoolName: program.schoolName };
        return map;
    }, {});
    console.log("shifts", shifts)
    
    for (const [date, shiftDetails] of Object.entries(shifts)) {
        // Parse the date in the format "DD/MM/YYYY"
        const shiftDate = moment(date, "DD/MM/YYYY");
        
        // Check if the shift date is today or in the future
        

        if(isUpcomingShifts){
            if (shiftDate.isSameOrAfter(currentDate, 'day')) { 
                const programInfo = shiftDetails.programData
                tableData.push({
                    date: shiftDetails.date,
                    day: shiftDate.format('dddd'),
                    shiftStartTime: shiftDetails.shiftStartTime,
                    shiftEndTime: shiftDetails.shiftEndTime,
                    programName: programInfo ? programInfo.name : 'Unknown',
                    schoolName: programInfo ? programInfo.schoolName : 'Unknown'
                });      
            }
        } 
        else{
           
            const programInfo = shiftDetails.programData
            tableData.push({
                date: shiftDetails.date,
                day: shiftDate.format('dddd'),
                shiftStartTime: shiftDetails.shiftStartTime,
                shiftEndTime: shiftDetails.shiftEndTime,
                programName: programInfo ? programInfo.name : 'Unknown',
                schoolName: programInfo ? programInfo.schoolName : 'Unknown'
            });      
            
        }
        
    }
    setLoading(false);
    return tableData;
}

  useEffect(() => {
    
    if (employeeID) {
      setLoading(true);
      getAllSessionsForTeacher(employeeID).then((data) => {
        setShiftsData(data)
        // Process only upcoming shifts
        const tableFormattedData = transformShiftsToTableData(isUpcomingShifts,data.shifts, data.allClasses, data.allPrograms);
        setTableData(tableFormattedData);
        
        setLoading(false);
      });
    }
  }, [employeeID]);


  const searchChanged = (value) => {
    setIsUpcomingShifts(value)
    setLoading(true);
    const data = shiftsData;
    const tableFormattedData = transformShiftsToTableData(value, data.shifts, data.allClasses, data.allPrograms);
    setTableData(tableFormattedData);
    setLoading(false);
  }
  

 
const fields = [
    { id: 'programName', numeric: false, disablePadding: true, label: 'Program' },
    { id: 'schoolName', numeric: false, disablePadding: true, label: 'School' },
    { id: 'date', numeric: false, disablePadding: true, label: 'Date' },
    { id: 'day', numeric: false, disablePadding: true, label: 'Day' },
    { id: 'shiftStartTime', numeric: false, disablePadding: true, label: 'Start' },
    { id: 'shiftEndTime', numeric: false, disablePadding: true, label: 'End' },
   
  ];
  return (
    <Card>
      <h1>{loading ? "Loading..." : ""}</h1>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Boolean value={isUpcomingShifts} valueUpdated={searchChanged} />

      <Typography component="p" variant="subtitle1">
        Upcoming
      </Typography>
    </Box>
      
      <Table fields={fields} data={tableData} />
    </Card>
  );
}

UpcomingShiftsTable.propTypes = {
  employeeID: PropTypes.string.isRequired,
  isUpcomingShifts: PropTypes.bool
};

export default UpcomingShiftsTable;