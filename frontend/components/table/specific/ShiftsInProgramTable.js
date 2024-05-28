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

import ClassTable from "/components/table/specific/ClassesInProgramTable.js"

import ShiftsTable from "/components/table/specific/ShiftsInProgramTable.js"



const shiftsTableStructure = {
  mainFields: [
 
    { name: 'date', label: 'Date', alignRight: false },
    { name: 'startTime', label: 'Start Time', alignRight: false },
    { name: 'endTime', label: 'End Time', alignRight: false },
    { name: 'numSessions', label: 'Num Session', alignRight: false },
    { name: 'teacher1', label: 'Lecturer', alignRight: false },
    { name: 'teacher2', label: 'Facilitator', alignRight: false },
    
    // ... add more fields as needed
  ],
  subFields: [
    { name: 'session', hidden:true, label: 'Session', alignRight: false },
    { name: 'startTime', label: 'Start Time', alignRight: false },
    { name: 'endTime', label: 'End Time', alignRight: false },
    { name: 'teacher1', label: 'Lecturer', alignRight: false },
    { name: 'teacher2', label: 'Facilitator', alignRight: false },
  
  ],
};

const onEditPressed = (row) =>{
  console.log(row)
}

const parseTime = (timeString) => {
  // Assuming timeString is in the format "HH:mm", "HH:mm AM/PM", or "HH:mmAM/PM"
  const referenceDate = new Date().toISOString().split('T')[0];

  // Check if timeString includes AM/PM without a space (like "03:30PM")
  const amPmMatch = timeString.match(/(\d{2}):(\d{2})(AM|PM)/i);
  if (amPmMatch) {
    let [ , hours, minutes, amPm ] = amPmMatch;
    hours = parseInt(hours);
    amPm = amPm.toUpperCase();

    // Convert 12-hour format to 24-hour format
    if (amPm === "PM" && hours < 12) {
      hours += 12;
    } else if (amPm === "AM" && hours === 12) {
      hours = 0;
    }

    // Reconstruct timeString in 24-hour format
    timeString = `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  return new Date(`${referenceDate}T${timeString}`);
};

const findClassTimes = (sessions) => {
  let earliestStartTime = Number.MAX_VALUE;
  let latestEndTime = 0;

  sessions.forEach(session => {
      const startTime = parseTime(session.startTime).getTime();
      const endTime = parseTime(session.endTime).getTime();

      if (startTime < earliestStartTime) {
          earliestStartTime = startTime;
      }
      if (endTime > latestEndTime) {
          latestEndTime = endTime;
      }
  });

  // Convert back to time string, excluding seconds
  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  
  const classStartTime = earliestStartTime !== Number.MAX_VALUE ? new Date(earliestStartTime).toLocaleTimeString([], timeOptions) : 'Unknown';
  const classEndTime = latestEndTime !== 0 ? new Date(latestEndTime).toLocaleTimeString([], timeOptions) : 'Unknown';

  return {
      classStartTime,
      classEndTime
  };
};

const formatShiftsDataForTable = (shiftsData, teacherID) => {
  return Object.entries(shiftsData).map(([date, shiftData]) => {

    
    const sessions = shiftData
    const shiftStartTime = shiftData.shiftStartTime;
    const shiftEndTime = shiftData.shiftEndTime;
    let filteredSessions =   shiftData;
    if (teacherID !== undefined) {
    filteredSessions = shiftData.filter(session => 
      session.teacherIDs.includes(teacherID)
    );
  }


    if (filteredSessions.length > 0) {
        // Initial setup for main field data
        let mainFieldData = {
          date: shiftData.date,
          date: shiftData.date,
          startTime: shiftStartTime,
          endTime: shiftEndTime,
          numSessions: filteredSessions.length,
          teacher1: '---',
          teacher2: '---', // Default value if there is no second common teacher
        };

        // Collect teachers from all sessions
        let allTeachers = filteredSessions.flatMap(session => session.teacherNames || []);

        // Find common teachers
        let commonTeachers = allTeachers.filter(teacher => 
          filteredSessions.every(session => session.teacherNames && session.teacherNames.includes(teacher))
        );

        // Remove duplicates and assign teachers to main field
        let uniqueCommonTeachers = [...new Set(commonTeachers)];
        if (uniqueCommonTeachers.length > 0) {
          mainFieldData.teacher1 = uniqueCommonTeachers[0];
          mainFieldData.teacher2 = uniqueCommonTeachers[1] || '----';
        }

        // Format sub field data
        const subFieldData = filteredSessions.map(session => ({
          session: session.sessionID,
          startTime: session.startTime,
          endTime: session.endTime,
          teacher1: session.teacherNames ? session.teacherNames[0] : '',
          teacher2: session.teacherNames ? session.teacherNames[1] : '',
        }));

        // Combine main and sub field data
        return {
          ...mainFieldData,
          subField: subFieldData,
        };
      }
      return null
  }).filter(Boolean);
};

export default function Home({programID,teacherID}) {
  

  const [programsTableData, setProgramsTableData] = React.useState([])
  const [shiftsTableData, setShiftsTableData] = React.useState([])



  useEffect(() => {
    console.log("TEAHCER ID", teacherID)
    getAllProgramClassesSessions(programID).then((programData) => {
      console.log(programData)
      const formattedShiftsData = formatShiftsDataForTable(programData.shifts, teacherID);
     
     
      
      setShiftsTableData(formattedShiftsData);
      // Now you can use formattedData as the data prop for DropDownTable
    });
  }, [teacherID]);
  

  return (
    <div>
        <DropDownTable data ={shiftsTableData} structure={shiftsTableStructure} onEditPressed={onEditPressed}></DropDownTable>

    </div>
  );
}