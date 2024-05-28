"use client"
import * as React from 'react';

import Table from "/components/table/Table.js"

import { getAllPrograms } from "/lib/firebase/library";
import { useState, useEffect } from 'react';

import ProgramSearch from "/components/search/ProgramSearch.js"
import { useRouter } from 'next/navigation';

import Button from '@mui/joy/Button';

import {getStartTimeStampOfProgram, getEndTimeStampOfProgram} from 'library/lib/privatePrograms/utils/dates'

const fields = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'publishToWebsite', date: true, numeric: true, disablePadding: false, label: 'On Website' },
  { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'ID' },
  { id: 'numBookings', date: true, numeric: true, disablePadding: false, label: 'Num Bookings' },
  { id: 'maxCapacity', date: true, numeric: true, disablePadding: false, label: 'Max Capacity' },
  { id: 'locationName', numeric: false, disablePadding: false, label: 'Location' },
  { id: 'courseName', numeric: false, disablePadding: false, label: 'Course' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Start' },
  { id: 'endDate', date: true, numeric: false, disablePadding: false, label: 'End' },
  { id: 'revenue', date: true, numeric: true, disablePadding: false, label: 'Revenue' },
];


  
export default function Page({}) {
  const router = useRouter();

  const [programs, setPrograms] = useState([]);
  const [transformedPrograms, setTransformedPrograms] = useState([]);

  const [tableData, setTableData] = useState([]);


  const handleEditButtonClick = (row) => {
    console.log('Edit button clicked', row);
  };

  const handleRowSelected = (row) => {
    console.log('row Selected', row);
    router.push(`/admin/programs/holidayPrograms/details?id=${row.id}`);
    
    
  };

  const onProgramsFiltered = (filteredPrograms) => {
    setTableData(filteredPrograms);
  }


  useEffect(() => {
    let mounted = true;
  
    getAllPrograms().then((data) => {
      if (mounted) {
        console.log(data);
        setPrograms(data);
  
        // Filter the data to include only programs where isHolidayProgram is true
        const filteredData = data.filter(program => program.isHolidayProgram);
        console.log("filteredData", filteredData)
        // Transform the filtered data to fit the table
        const transformedData = filteredData.map(program => ({
          name: program.name || 'N/A', // Fallback to 'N/A' if the name is not available
          courseID: program.courseID,
          publishToWebsite: program.publishToWebsite ? "Yes" : "No",
          numBookings: program.enrolledStudents ? program.enrolledStudents.length : 0, // Get the length of the enrolledStudents array
          courseName: program.courseName || 'N/A',
          startDateTimeStamp: getStartTimeStampOfProgram(program.dates),
          endDateTimeStamp: getEndTimeStampOfProgram(program.dates),
          startDate: program.dates?.[0]?.startDate || 'N/A',
          endDate: program.dates?.[0]?.endDate || 'N/A',
          locationName: program.locationName || 'N/A',
          maxCapacity: program.maxCapacity || 'N/A',
          id: program.id,
          // Add any additional fields you need here
        }));
        setTransformedPrograms(transformedData);
      }
      
    });
  
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
       
      <ProgramSearch programs={transformedPrograms} onProgramsFiltered={onProgramsFiltered}  />
      <Table data={tableData} fields={fields} name="Programs" 
      handleRowSelected={handleRowSelected}/>
     
    </div>
  );
}