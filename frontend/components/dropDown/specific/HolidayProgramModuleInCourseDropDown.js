"use client"
import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';
import SearchableDropDown from '../SearchableDropDown';
import {getAllHolidayProgramModules} from '/lib/firebase/library';

export default function SearchableCourseDropDown({ courseID, valueUpdated, defaultOption = null, placeHolder= ""}) {
  const [value, setValue] = React.useState({ label: defaultOption });
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [optionsData, setCourseData] = React.useState('');


  const valueSelected = (value) => {
    const rowValue = optionsData.find(c => c.name === value);
    valueUpdated(rowValue)
  }
    

  React.useEffect(() => {
    let courseName = []
    getAllHolidayProgramModules().then((courses) => {
      const filteredCourses = courses.filter(course => course.course.id === courseID)

      setCourseData(filteredCourses)
      filteredCourses.forEach(course => {
        courseName.push(course.name)
      })
      setOptions(courseName)
    })
  }, [])

  return (
    <SearchableDropDown options={options} valueUpdated={valueSelected} placeHolder={placeHolder} />
  );
}