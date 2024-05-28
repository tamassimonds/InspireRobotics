"use client"
import Button from '@mui/joy/Button';


import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import SearchableTable from "/components/table/SearchableTable.js";

import { getAllHolidayProgramModules} from '/lib/firebase/library';

const fields = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'course', numeric: false, disablePadding: true, label: 'Course' },
  { id: 'cost', numeric: false, disablePadding: true, label: 'Cost' },
  { id: 'hours', numeric: false, disablePadding: true, label: 'Hours' },
  { id: 'minAge', numeric: false, disablePadding: true, label: 'Min Age' },
  { id: 'maxAge', numeric: false, disablePadding: true, label: 'Max Age' },
  { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'ID' },
 
];

export default function Home() {
  const router = useRouter();

  const [modules, setModules] = useState([])

  
  
  const handleRowSelected = (row) => {
    console.log('row Selected', row);
  }

  useEffect(() => {
    getAllHolidayProgramModules().then((modules) => {
      console.log(modules)
      const tableData = modules.map(module => ({
        name: module.name || 'N/A', // Fallback to 'N/A' if the name is not available
        course: module.course.name || 'N/A', // Fallback to 'N/A' if the name is not available
        cost: module.costPerStudent || 'N/A', // Fallback to 'N/A' if the name is not available
        hours: module.hours || 'N/A', // Fallback to 'N/A' if the name is not available
        minAge: module.minAge || 'N/A', // Fallback to 'N/A' if the name is not available
        maxAge: module.maxAge || 'N/A', // Fallback to 'N/A' if the name is not available
        id: module.id || 'N/A', // Fallback to 'N/A' if the name is not available
      }))
      setModules(tableData)
      console.log(modules)
    })
  }, [])



  return (
    <div>
          
            <Button onClick={()=>{router.push('./holidayModules/addHolidayModule');}}>Add Holiday Module</Button>
            <SearchableTable searchField="name" data={modules} fields={fields}></SearchableTable>
     
    </div>
   
  )
}
