"use client"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Card from "@mui/joy/Card"
import Calendar from "/components/calendar/specific/ProgramCalendar.js"
import Button from '@mui/joy/Button';
import DropDownTable from "/components/table/DropDownTable.js"
import {getAllProgramClassesSessions} from "/lib/firebase/library"

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react';
 
import Table from "/components/table/Table.js"
import moment from 'moment';

const classesTableStructure = {
  mainFields: [
    { name: 'class', label: 'Class', alignRight: false },
    { name: 'numSessions', label: 'Num Session', alignRight: false },
    { name: 'yearLevel', label: 'Year Level', alignRight: false },
    { name: 'startTime', label: 'Start Time', alignRight: false },
    { name: 'endTime', label: 'End Time', alignRight: false },
    // ... add more fields as needed
  ],
  subFields: [
    { name: 'session', label: 'Session', alignRight: false },
    { name: 'date', label: 'Date', alignRight: false },
    { name: 'startTime', label: 'Start Time', alignRight: false },
    { name: 'endTime', label: 'End Time', alignRight: false },
    { name: 'teacher1', label: 'Lecturer', alignRight: false },
    { name: 'teacher2', label: 'Facilitator', alignRight: false },
  ],
};

const shiftsTableStructure = {
  mainFields: [
    { name: 'shift', label: 'Shift', alignRight: false },
    { name: 'date', label: 'Date', alignRight: false },
    { name: 'startTime', label: 'Start Time', alignRight: false },
    { name: 'endTime', label: 'End Time', alignRight: false },
    { name: 'numSessions', label: 'Num Session', alignRight: false },
    { name: 'teacher1', label: 'Lecturer', alignRight: false },
    { name: 'teacher2', label: 'Facilitator', alignRight: false },
    // ... add more fields as needed
  ],
  subFields: [
    { name: 'session', label: 'Session', alignRight: false },
    { name: 'startTime', label: 'Start Time', alignRight: false },
    { name: 'endTime', label: 'End Time', alignRight: false },
    { name: 'teacher1', label: 'Lecturer', alignRight: false },
    { name: 'teacher2', label: 'Facilitator', alignRight: false },
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

function arrayToString(arr) {
  // Check if the input is an array
  if (!Array.isArray(arr)) {
    console.error('Age Input must be an array');
    return arr
  }

  // Join the array elements with a comma separator
  return arr.join(', ');
}


const formatProgramDataForTable = (programData) => {
  return programData.classes.map((classItem) => {
    // Use the timestamps for comparison
    const allStartTimes = classItem.sessions.map(session => session.startTimeTimestamp);
    const allEndTimes = classItem.sessions.map(session => session.endTimeTimestamp);

    const allFormattedStartTimes = classItem.sessions.map(session =>
      moment(session.startTimeTimestamp).format('H:mm a')
    );
    const allFormattedEndTimes = classItem.sessions.map(session =>
      moment(session.endTimeTimestamp).format('H:mm a')
    );
    
    
    // Check if all formatted start times are the same
    const allSameStartTime = allFormattedStartTimes.every((val, i, arr) => val === arr[0]);
    const allSameEndTime = allFormattedEndTimes.every((val, i, arr) => val === arr[0]);

    // Calculate earliest start time and latest end time for the class
    const { classStartTime, classEndTime } = findClassTimes(classItem.sessions);
    // Format main field data
    const mainFieldData = {
      class: classItem.classID,
      numSessions: classItem.sessions.length,
      yearLevel: arrayToString(classItem.yearLevel),
      startTime: allSameStartTime ? classStartTime : '---', // Use formatted time
      endTime: allSameEndTime ? classEndTime : '---', // Use formatted time
    };

    // Format sub field data
    const subFieldData = classItem.sessions.map((session) => ({
      session: session.sessionID,
      date: session.date,
      startTime: new Date(session.startTimeTimestamp).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }),
      endTime: new Date(session.endTimeTimestamp).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }),
      teacher1: session.teacherNames ? session.teacherNames[0] : '',
      teacher2: session.teacherNames ? session.teacherNames[1] : '',
    }));

    // Combine main and sub field data
    return {
      ...mainFieldData,
      subField: subFieldData,
    };
  });
};

export default function Home({programID,teacherID, onEditPressed}) {

  const [programsTableData, setProgramsTableData] = React.useState([])
  const [shiftsTableData, setShiftsTableData] = React.useState([])

 

  useEffect(() => {
    getAllProgramClassesSessions(programID).then((programData) => {
      const formattedClassesData = formatProgramDataForTable(programData);
      console.log(formattedClassesData)
      setProgramsTableData(formattedClassesData);
      // Now you can use formattedData as the data prop for DropDownTable
    });
  }, []);
  

  return (
    <div>
     
     
       
        <DropDownTable data ={programsTableData} structure={classesTableStructure} onEditPressed={onEditPressed}></DropDownTable>
        
       
        
     
    </div>
  );
}