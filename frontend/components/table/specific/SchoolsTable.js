"use client"

import * as React from 'react';
import Input from '@mui/joy/Input';
import { Stack, Box } from '@mui/material';

import { getAllSchools } from "/lib/firebase/library";
import { useRouter } from 'next/navigation';


import SearchableTable from "/components/table/SearchableTable.js"

export default function ProgramSearch({programs=[], sortedPrograms}) {
    const router = useRouter()


    const [schools, setSchools] = React.useState([])

    const handleRowSelected = (row) => {
    console.log('row Selected', row);

    const courseID = row.id;

    router.push('./overview/schoolDetails?schoolID='+courseID)
    };


    const fields = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'ID' },
    ];

    React.useEffect(() => {
    getAllSchools().then((schools) => {
        
        
        
        const tableData = schools.map(schools => ({
        name: schools.name || 'N/A', // Fallback to 'N/A' if the name is not available
        id: schools.id || 'N/A', // Fallback to 'N/A' if the name is not available
        }))
        setSchools(tableData)
        console.log(schools)
    })
    }, [])


    return (
    <div>
        <SearchableTable searchField="name" fields={fields} data={schools} handleRowSelected={handleRowSelected}/>
    </div>
    );
}