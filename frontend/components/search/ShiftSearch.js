"use client"

import * as React from 'react';
import Input from '@mui/joy/Input';
import { Stack, Box } from '@mui/material';



import SearchableDropDown from "/components/dropDown/SearchableDropDown.js"
import SchoolDropDown from "/components/dropDown/specific/SchoolDropDown.js"
import CourseDropDown from "/components/dropDown/specific/CourseDropDown.js"


import TextInput from "/components/inputs/TextInput.js"
import Button from '@mui/joy/Button';


export default function ProgramSearch({programs=[], sortedPrograms}) {

  const programTypes = ["Holiday", "School"]


  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
    <SearchableDropDown width={150} placeHolder="Type" options={programTypes}/>
   
    <SchoolDropDown width={150} placeHolder="Schools" />
    <CourseDropDown width={150} placeHolder="Courses"/>
    <TextInput width={300} placeHolder="Search"/>
    <Box flexGrow={1} />
    
    <Button color="danger">Clear</Button>
    <Button>More</Button>
  </Stack>
  );
}