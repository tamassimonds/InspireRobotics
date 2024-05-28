"use client"
import * as React from 'react';

import Table from "/components/table/Table.js"

import { getAllSchoolProgram } from "/lib/firebase/library";
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import ProgramSearch from "/components/search/ProgramSearch.js"
import { useRouter } from 'next/navigation';
const fields = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'ID' },

  { id: 'schoolName', numeric: false, disablePadding: false, label: 'School' },
  { id: 'courseName', numeric: false, disablePadding: false, label: 'Course' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Start' },
  { id: 'endDate', date: true, numeric: false, disablePadding: false, label: 'End' },
  { id: 'revenue', date: true, numeric: true, disablePadding: false, label: 'Revenue' },
];


  
export default function Page({}) {
  const router = useRouter()

  const [programs, setPrograms] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [sortedPrograms, setSortedPrograms] = useState([]);
  const [loading, setLoading] = useState(true); // Add a state to track the loading status


  const transformData = (data) => {
    const transformedData = data.map(program => ({
      name: program.name || 'N/A', // Fallback to 'N/A' if the name is not available
      schoolName: program.schoolName || 'N/A',
      id: program.id || 'N/A',
      courseName: program.courseName || 'N/A',
      startDate: program.startDate || 'N/A',
      endDate: program.endDate || 'N/A',
      revenue: program.revenue || 'N/A' // Fallback to 'N/A' if revenue is not available
    }));
    return transformedData
  }

  const programsSorted = (programs) => {
    setSortedPrograms(programs)
    const transformedData = transformData(programs)
    setTableData(transformedData);
  }
  const handleRowSelected = (row) => {
    console.log('row Selected', row);
   router.push('./overview/programDetails?programID='+row.id)

  };

  useEffect(() => {
    let mounted = true;

    getAllSchoolProgram().then((data) => {
      if (mounted) {
        console.log(data);
        setPrograms(data);
        // Transform the data to fit the table
        const transformedData = transformData(data)
        setTableData(transformedData);
        console.log("tableData",transformedData)
        setLoading(false); // Finish loading

      }
      
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
       
       <ProgramSearch programs={programs} onProgramsFiltered={programsSorted} />
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : (
        <Table data={tableData} fields={fields} name="Programs" handleRowSelected={handleRowSelected} />
      )}
    </div>
     
    
  );
}