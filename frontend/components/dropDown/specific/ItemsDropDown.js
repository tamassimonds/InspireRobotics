"use client"
import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';
import SearchableDropDown from '../SearchableDropDown';
import {getAllItems} from '/lib/firebase/inventoryFirebaseLogic';

export default function SearchableCourseDropDown({ valueUpdated, defaultOption = null, placeHolder= ""}) {
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
    getAllItems().then((courses) => {
      setCourseData(courses)
      courses.forEach(course => {
        courseName.push(course.name)
      })
      setOptions(courseName)
    })
  }, [])

  return (
    <SearchableDropDown options={options} valueUpdated={valueSelected} placeHolder={placeHolder} />
  );
}