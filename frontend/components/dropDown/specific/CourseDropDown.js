"use client"
import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';
import SearchableDropDown from '../SearchableDropDown';
import {getAllCourses} from '/lib/firebase/library';

export default function SearchableCourseDropDown({ valueUpdated, value, defaultOption = null, placeHolder= ""}) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [optionsData, setCourseData] = React.useState('');


  const valueSelected = (value) => {
    const rowValue = optionsData.find(c => c.name === value);
    valueUpdated(rowValue)
  }
    

  React.useEffect(() => {
    let courseName = []
    getAllCourses().then((courses) => {
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