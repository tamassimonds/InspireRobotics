"use client"

import SearchableTable from "/components/table/SearchableTable.js"
import Button from '@mui/joy/Button';
import * as React from 'react';

import Link from "next/link";
import { getAllCourses } from "/lib/firebase/library";
// useRouter
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter()


  const [courses, setCourses] = React.useState([])

  const fields = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'ID' },
   
  ];

  const handleRowSelected = (row) => {
    console.log('row Selected', row);
    
    const courseID = row.id;
    
    router.push('./overview/courseDetails?courseID='+courseID)
  };


  
  React.useEffect(() => {
    getAllCourses().then((courses) => {
      
       
     
      const tableData = courses.map(course => ({
        name: course.name || 'N/A', // Fallback to 'N/A' if the name is not available
        id: course.id || 'N/A', // Fallback to 'N/A' if the name is not available
      }))
      setCourses(tableData)
      console.log(courses)
    })
  }, [])


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Courses</h1>
        <Button color="success"> <Link href="./overview/addCourse">Add Course</Link></Button>
      </div>
      <SearchableTable searchField="name" fields={fields} data={courses} handleRowSelected={handleRowSelected}/>
    </div>
  );
}