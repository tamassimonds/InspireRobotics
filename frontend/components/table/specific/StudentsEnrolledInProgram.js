"use client"
"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Card from "@mui/joy/Card"
import Calendar from "/components/calendar/specific/ProgramCalendar.js"
import Button from '@mui/joy/Button';
import DropDownTable from "/components/table/DropDownTable.js"
import {getHolidayProgramById} from "/lib/firebase/holidayProgramsFirebaseLogic"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
 
import Table from "/components/table/Table.js"

import {calculateAgeFromDOB} from "/library/utils/dates/formatDates"


const classesTableStructure = {
  mainFields: [
    { name: 'name', label: 'Student Name', alignRight: false },
    { name: 'age', label: 'Age', alignRight: false },
    { name: 'parentName', label: 'Parent Name', alignRight: false },
    { name: 'parentEmail', label: 'Parent Email', alignRight: false },

    { name: 'parentNumber', label: 'Number', alignRight: false },
    { name: 'additionalNotes', label: 'Additional Notes', alignRight: false },
   
    // ... add more fields as needed
  ],
  subFields: [
    { name: 'secondaryContactName', label: 'Secondary Contact Name', alignRight: false },
    { name: 'secondaryContactPhone', label: 'Number', alignRight: false },
    { name: 'secondaryContactRelationship', label: 'Relationship', alignRight: false },
  ],
};




const parseTime = (timeString) => {
  // Assuming timeString is in the format "HH:mm" or "HH:mm AM/PM"
  const referenceDate = new Date().toISOString().split('T')[0];
  return new Date(`${referenceDate}T${timeString}`);
};

const findClassTimes = (sessions) => {
  let earliestStartTime = Number.MAX_VALUE;
  let latestEndTime = 0;

  sessions.forEach(session => {
      const startTime = session.startTimeTimestamp; // Use timestamp directly
      const endTime = session.endTimeTimestamp; // Use timestamp directly

      if (startTime < earliestStartTime) {
          earliestStartTime = startTime;
      }
      if (endTime > latestEndTime) {
          latestEndTime = endTime;
      }
  });

  // Convert back to time string, excluding seconds
  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  const classStartTime = earliestStartTime !== Number.MAX_VALUE ? new Date(earliestStartTime).toLocaleTimeString([], timeOptions) : '---';
  const classEndTime = latestEndTime !== 0 ? new Date(latestEndTime).toLocaleTimeString([], timeOptions) : '---';

  return {
      classStartTime,
      classEndTime
  };
};

const formatProgramDataForTable = (programData) => {
    const formattedData = [];
    if(!programData.enrolledStudents){
        return []
    }
    // Assuming each program has an array of enrolled students
    programData.enrolledStudents.forEach(student => {
      const parent = programData.enrolledParents.find(p => p.id === student.parentId);
      console.log("parent", parent)
      console.log("student", parent)

      // Create a row for each student
      const row = {
        name: student.firstName + " " + student.lastName,
        age: calculateAgeFromDOB(student.dateOfBirth),
        parentName: parent ? parent.firstName + " " + parent.lastName : '---',
        parentEmail: parent ? parent.email : '---',

        parentNumber: parent ? parent.phone : '---',
        additionalNotes: student.additionalInfo,
        // Include subField data if needed, e.g., secondaryContact information
        subField: student.secondaryContact ? [{
          additionalNotes: student.secondaryContact.secondaryContactEmail, // Example subfield
          date: '---', // Populate with actual data if available
          secondaryContactName: student.secondaryContact.secondaryContactName,
          secondaryContactPhone: student.secondaryContact.secondaryContactMobile,
        }] : [],
      };
  
      formattedData.push(row);
    });
  
    return formattedData;
  };
  

export default function Home({programID, onEditPressed}) {

  const [programsTableData, setProgramsTableData] = React.useState([])
  const [shiftsTableData, setShiftsTableData] = React.useState([])
    const [numStudents, setNumStudents] = React.useState()
 

  useEffect(() => {
    getHolidayProgramById(programID).then((programData) => {
        console.log(programData)
        setNumStudents(programData.enrolledStudents.length ? programData.enrolledStudents.length : 0)
     
     
        const formattedClassesData = formatProgramDataForTable(programData);
        console.log("formattedClassesData", formattedClassesData)
      setProgramsTableData(formattedClassesData);
      // Now you can use formattedData as the data prop for DropDownTable
    });
  }, []);
  

  return (
    <div>
     
     
        <p>Num Students: {numStudents}</p>
        <DropDownTable data ={programsTableData} structure={classesTableStructure} onEditPressed={onEditPressed}></DropDownTable>
        
       
        
     
    </div>
  );
}