import * as React from 'react';
import SearchableDropDown from '../SearchableDropDown';
import { getAllOwners } from '/lib/firebase/inventoryFirebaseLogic';

export default function SearchableCourseDropDown({ valueUpdated, value = null, placeHolder = "", width }) {
  const [options, setOptions] = React.useState([]);
  const [optionsData, setCourseData] = React.useState([]);

  const valueSelected = (value) => {
    const rowValue = optionsData.find(c => c.name === value);
    valueUpdated(rowValue);
  }

  React.useEffect(() => {
    let courseName = [];
    getAllOwners().then((data) => {
      console.log(data)
      setCourseData(data);
      data.forEach(course => {
        courseName.push(course.name);
      });
      setOptions(courseName);
    });
  }, []);

  return (
    <SearchableDropDown 
      options={options} 
      valueUpdated={valueSelected} 
      placeHolder={placeHolder} 
      width={width} 
      defaultOption={value}
    />
  );
}
