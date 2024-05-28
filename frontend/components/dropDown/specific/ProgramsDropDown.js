"use client"
import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';
import SearchableDropDown from '../SearchableDropDown';
import {getAllPrograms} from '/lib/firebase/library';

export default function SearchableProgramsDropDown({ valueUpdated, value, placeHolder= ""}) {
  const [currentValue, setCurrentValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [optionsData, setCourseData] = React.useState('');


  const valueSelected = (value) => {
    const rowValue = optionsData.find(c => c.name === value);
    valueUpdated(rowValue)
   
    
  }

  React.useEffect(() => {
    setCurrentValue(value);
   
    console.log("placeHolder", value)
  }, [value]);

  React.useEffect(() => {

   
    let courseName = []
    getAllPrograms().then((courses) => {
      setCourseData(courses)
      courses.forEach(course => {
        courseName.push(course.name)
      })
      setOptions(courseName)
    })
  }, [])

  return (
    <SearchableDropDown options={options} value={value} valueUpdated={valueSelected} placeHolder={placeHolder} />
  );
}