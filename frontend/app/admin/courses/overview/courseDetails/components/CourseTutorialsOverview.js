"use client"
import {useState, useEffect} from 'react';
import { Stack, Box, Table } from '@mui/material';

import Button from '@mui/joy/Button';
import SearchableDropDown from "/components/dropDown/SearchableDropDown.js"
import TextInput from "/components/inputs/TextInput.js"

import {getCourseTutorials} from "library/lib/courses/tutorials/service/handleCourseTutorials.ts"

import SearchableTable from "/components/table/SearchableTable.js"


import {get} from "library/lib/courses/tutorials/service/handleCourseTutorials.ts"


import { useRouter } from 'next/navigation';


const fields = [
  
  { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
  { id: 'link', numeric: false, disablePadding: true, label: 'Link' },
  
];

export default function CourseTutorialsOverview({courseID, isAdmin= false }) {

    const handleRowSelected = (row) => {
    
        const id = row.id;
    
        router.push(`/admin/courses/overview/courseDetails/addTutorial?courseID=${courseID}&id=${id}`)
    };

    const router = useRouter()
    const addTutorialPressed = () => {
        router.push(`/admin/courses/overview/courseDetails/addTutorial?courseID=${courseID}`)
    }

    const [tutorials, setTutorials] = useState([])


    useEffect(() => {
        getCourseTutorials(courseID).then((tutorials) => {
            
            
            
            const tableData = tutorials.map(tutorials => ({
            title: tutorials.title || 'N/A', // Fallback to 'N/A' if the name is not available
            link: tutorials.link || 'N/A', // Fallback to 'N/A' if the name is not available 
            id: tutorials.id || 'N/A', // Fallback to 'N/A' if the name is not available
            }))
            setTutorials(tableData)
            console.log(tutorials)
        })
        }, [])

        
  return (
    <div>
        {isAdmin &&(
            <Button onClick={addTutorialPressed}>Add Tutorial</Button>
        )}
      <div>
        <SearchableTable searchField="name" fields={fields} data={tutorials} handleRowSelected={handleRowSelected}/>
    </div>
    </div>
  );
}