"use client"
import {useState, useEffect} from 'react';
import { Stack, Box } from '@mui/material';

import ImageTable from "/components/table/ImageTable.js"
import Button from '@mui/joy/Button';
import SearchableDropDown from "/components/dropDown/SearchableDropDown.js"
import TextInput from "/components/inputs/TextInput.js"
import {getAllTeachers} from "/lib/firebase/library"


const fields = [
  { id: 'imageUrl', numeric: false, disablePadding: true, label: '' },

  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  
];

export default function TeamMemberTable({handleRowSelected, isAdmin=true, addNewEmployeePressed }) {

  const [teamMembers, setTeamMembers] = useState([])


  



  useEffect(() => {
    console.log('addNewEmployeePressed', typeof handleRowSelected); // Check the type to ensure it's a function

    getAllTeachers().then((teamMembers) => {
      console.log(teamMembers)
      const tableData = teamMembers.map(teamMember => ({
        name: teamMember.name || 'N/A', // Fallback to 'N/A' if the name is not available
        id: teamMember.id || 'N/A', // Fallback to 'N/A' if the name is not available
        imageUrl: teamMember.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', // Fallback to 'N/A' if the name is not available
      }))
      setTeamMembers(tableData)
      console.log(teamMembers)
    })
  }, [])

  return (
    <div>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
     
        <TextInput width={300} defaultValue="Search"/>
        <Box flexGrow={1} />
        {isAdmin && (
              <Button onClick={addNewEmployeePressed}>Add New Employee</Button>
          )}

           
          
           
      </Stack>
      <ImageTable fields={fields} data={teamMembers} handleRowSelected={handleRowSelected}/>
    </div>
  );
}