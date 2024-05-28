import * as React from 'react';
import SearchableDropDown from '../SearchableDropDown';
import { getAllTeachers } from '/lib/firebase/library';

import { functions } from "/lib/firebase/initFirebase.ts"
import { httpsCallable } from 'firebase/functions';

import { removeEmojis } from "/library/utils/strings/parseEmoji.ts"

export default function SearchableTeacherDropDown({ startTimeTimestamp, endTimeTimestamp, valueUpdated, value = null, placeHolder = "", width }) {
  const [options, setOptions] = React.useState([]);
  const [optionsData, setTeacherData] = React.useState([]);

  // Initialize the lastFetched useRef with null values and an empty array for results
  const lastFetched = React.useRef({
    startTimeTimestamp: null,
    endTimeTimestamp: null,
    results: []
  });

  const valueSelected = (value) => {
    // Assume value comes with emojis and is derived from options.
    // We need to match this value to a cleaned data entry in optionsData
    const cleanValue = removeEmojis(value);
    const rowValue = optionsData.find(teacher => removeEmojis(teacher.decoratedName) === cleanValue);
    console.log("Value updated", rowValue);
    valueUpdated(rowValue);
  }

  const fetchAvailability = React.useCallback(() => {
    if (startTimeTimestamp === lastFetched.current.startTimeTimestamp &&
        endTimeTimestamp === lastFetched.current.endTimeTimestamp) {
      // Use cached results if timestamps haven't changed
      setOptions(lastFetched.current.results);
      return;
    }
    
    getAllTeachers().then(teachers => {
      setTeacherData(teachers.map(teacher => ({
        ...teacher,
        decoratedName: (teacher.isAvailable ? "✔️ " : "❌ ") + teacher.name + (teacher.accessToCar ? " 🚗" : "")
      })));

      const availabilityPromises = teachers.map(teacher => {
        const isEmployeeAvailableInRange = httpsCallable(functions, 'isEmployeeAvailableInRange');
       
        return isEmployeeAvailableInRange({
          employeeID: teacher.id,
          startTimeTimestamp,
          endTimeTimestamp
        })
        .then((result) => {
          const availablePrefix = result.data.isAvailable ? "✔️ " : "❌ ";
          const carSuffix = teacher.accessToCar ? " 🚗" : "";
          return availablePrefix + teacher.name + carSuffix;
        })
        .catch(() => {
          return "❌ " + teacher.name;
         
        });
      });

      Promise.all(availabilityPromises).then(teacherNames => {
        teacherNames.sort((a, b) => a.startsWith("✔️ ") && !b.startsWith("✔️ ") ? -1 : 1);
        setOptions(teacherNames);
        lastFetched.current = {
          startTimeTimestamp,
          endTimeTimestamp,
          results: teacherNames
        };
      });
    });
  }, [startTimeTimestamp, endTimeTimestamp]);

  React.useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return (
    <SearchableDropDown options={options} value={value} valueUpdated={valueSelected} placeHolder={placeHolder} width={width} />
  );
}
