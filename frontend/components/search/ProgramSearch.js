
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

// Import your specific dropdown components
import SchoolDropDown from "/components/dropDown/specific/SchoolDropDown.js";
import CourseDropDown from "/components/dropDown/specific/CourseDropDown.js";

export default function ProgramSearch({ programs, onProgramsFiltered, privateProgram = false }) {
  const [upcomingChecked, setUpcomingChecked] = useState(true);
  const [completedChecked, setCompletedChecked] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');


  useEffect(()=> {
    applyFilters();
  }, [programs, upcomingChecked, completedChecked, selectedSchool, selectedCourse])

  const handleUpcomingChange = (event) => {
    setUpcomingChecked(event.target.checked);
    applyFilters();
  };

  const handleCompletedChange = (event) => {
    setCompletedChecked(event.target.checked);
    applyFilters();
  };

  const handleSchoolChange = (school) => {
    console.log(school);
    setSelectedSchool(school ? school.name : '');
    applyFilters();
  };

  const handleCourseChange = (course) => {
    setSelectedCourse(course ? course.name : '');
    applyFilters();
  };

  const applyFilters = () => {
    if(!programs) return
    const currentDate = new Date().getTime();

    

    const filteredPrograms = programs.filter(program => {
      return (upcomingChecked ? program.endDateTimeStamp >= currentDate : true) &&
             (completedChecked ? program.endDateTimeStamp < currentDate : true) &&
             (selectedSchool ? program.schoolName === selectedSchool : true) &&
             (selectedCourse ? program.courseName === selectedCourse : true);
    });

    // Pass the filtered programs back to the parent component
    onProgramsFiltered(filteredPrograms);
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControlLabel
          control={<Checkbox checked={upcomingChecked} onChange={handleUpcomingChange} />}
          label="Upcoming Programs"
        />
        <FormControlLabel
          control={<Checkbox checked={completedChecked} onChange={handleCompletedChange} />}
          label="Completed Programs"
        />
        <SchoolDropDown valueUpdated={handleSchoolChange} />
        <CourseDropDown valueUpdated={handleCourseChange} />
        <Button onClick={applyFilters}>Apply Filters</Button>
      </Stack>
    </Card>
  );
}