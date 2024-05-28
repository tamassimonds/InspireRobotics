
import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';
import SearchableDropDown from '../SearchableDropDown';
import {getCourseTutorials} from "library/lib/courses/tutorials/service/handleCourseTutorials.ts"

export default function SearchableCourseTutorialDropDown({ courseID, valueUpdated, value = null, placeHolder = "", width }) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [optionsData, setCourseTutorialData] = React.useState('');


  const valueSelected = (value) => {
    const rowValue = optionsData.find(c => c.title === value);
    valueUpdated(rowValue)
  }
    

  React.useEffect(() => {

    if(courseID === "") {
        throw new Error("Course ID is required")
    }

    let courseTutorialName = []
    getCourseTutorials(courseID).then((courseTutorials) => {
      setCourseTutorialData(courseTutorials)
      courseTutorials.forEach(courseTutorial => {
        courseTutorialName.push(courseTutorial.title)
      })
      setOptions(courseTutorialName)
    })
  }, [value])

  return (
    <SearchableDropDown options={options} value={value} valueUpdated={valueSelected} placeHolder={placeHolder} />
  );
}





























