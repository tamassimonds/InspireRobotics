import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';
import SearchableDropDown from '../SearchableDropDown';
import {getAllSchools} from '/lib/firebase/library';

export default function SearchableCourseDropDown({ valueUpdated, value = null, placeHolder = "", width }) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [optionsData, setCourseData] = React.useState('');


  const valueSelected = (value) => {
    const rowValue = optionsData.find(c => c.name === value);
    valueUpdated(rowValue)
  }
    

  React.useEffect(() => {
    let courseName = []
    getAllSchools().then((courses) => {
      setCourseData(courses)
      courses.forEach(course => {
        courseName.push(course.name)
      })
      setOptions(courseName)
    })
  }, [value])

  return (
    <SearchableDropDown options={options} value={value} valueUpdated={valueSelected} placeHolder={placeHolder} />
  );
}