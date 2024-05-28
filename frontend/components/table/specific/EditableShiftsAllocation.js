"use client"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Card from "@mui/joy/Card"
import Calendar from "/components/calendar/specific/ProgramCalendar.js"
import Button from '@mui/joy/Button';
import DropDownTable from "/components/table/DropDownTable.js"
import {getAllProgramClassesSessions, getShiftsWithinTimePeriod, getAllTeachers} from "/lib/firebase/library"
import EditableShiftsAllocationTable from "/components/table/specific/EditableShiftsAllocationTable.js"
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react';
 
import Table from "/components/table/Table.js"
import Grid from '@mui/material/Grid';
import ClassTable from "/components/table/specific/ClassesInProgramTable.js"

import ShiftsTable from "/components/table/specific/ShiftsInProgramTable.js"
import TeacherDropDown from "/components/dropDown/specific/TeacherDropDown.js"

import { v4 as uuidv4 } from 'uuid'; // Importing uuid function


import { updateSessionTeachers, checkForShiftWarnings} from "/lib/firebase/shiftsFirebaseLogic"
import {removeEmojis} from "/library/utils/strings/parseEmoji"
import moment from 'moment';

export default function Page({programID, startTimeTimestamp, endTimeTimestamp, teacherID, changeSearchStatus}) {
  
  const [emailStatusMessage, setEmailStatusMessage] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);

  const [programsTableData, setProgramsTableData] = React.useState([])
  const [shiftsTableData, setShiftsTableData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [teacherIDName, setTeacherIDName] = React.useState(teacherID)
  const [teacherScores, setTeacherScores] = React.useState({})
  const [isSaved, setIsSaved] = React.useState(true)
  const [saveHasBeenPressed, setSaveHasBeenPressed] = React.useState(false)

  const shiftsTableStructure = {
    mainFields: [
      { name: 'shift', label: 'Shift', alignRight: false },
      { name: 'school', label: 'School', alignRight: false },
      { name: 'date', label: 'Date', alignRight: false },
      { name: 'day', label: 'Day', alignRight: false },

      { name: 'startTime', label: 'Start Time', alignRight: false },
      { name: 'endTime', label: 'End Time', alignRight: false },
      { name: 'numSessions', label: 'Num Session', alignRight: false },
      { name: 'teacher1', label: 'Lecturer', alignRight: false },
      { name: 'teacher2', label: 'Facilitator', alignRight: false },
      { name: 'warnings',  hidden: true, label: 'Warnings', alignRight: false}

      // ... add more fields as needed
    ],
    subFields: [
      { name: 'sessionStartTime', label: 'Start Time', alignRight: false },
      { name: 'sessionEndTime', label: 'End Time', alignRight: false },
      { name: 'teacher1', label: 'Lecturer', alignRight: false },
      { name: 'teacher2', label: 'Facilitator', alignRight: false },
      { name: 'warnings',  hidden: true, label: 'Warnings', alignRight: false}
      

    ],
  };

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

  


  const formatShiftsDataForTable = (shiftsData, teacherID) => {
    
    console.log("shiftsData", shiftsData)
    return Promise.all(Object.entries(shiftsData).map(async ([date, shiftData]) => {
      
      
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
          console.log("shiftData", shiftData)
          
          const startTime = moment(shiftData.date, "DD/MM/YYYY");
          const warnings = await checkForShiftWarnings(shiftData); // Pass teachers here if needed

          let mainFieldData = {
            shift: shiftData.programData.name,
            date: shiftData.date,
            day: startTime.format('ddd'),
            school: shiftData.programData.schoolName,
            startTime: shiftStartTime,
            endTime: shiftEndTime,
            numSessions: filteredSessions.length,
            teacher1: '---',
            teacher2: '---', // Default value if there is no second common teacher
            
            warnings: warnings,
            shiftID: shiftData.shiftID
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
          console.log("filteredSessions",filteredSessions)
          const subFieldData = filteredSessions.map(session => ({
            sessionID: session.sessionID,
            sessionStartTime: session.startTime,
            sessionEndTime: session.endTime,
            teacher1: session.teacherNames ? session.teacherNames[0] : '',
            teacher2: session.teacherNames ? session.teacherNames[1] : '',
          }));
          console.log("subFieldData", subFieldData)
          // Combine main and sub field data
          return {
            ...mainFieldData,
            subField: subFieldData,
          };
        }
        return null
      })).then(results => results.filter(Boolean));
    };

  function extractAllSessionsFromShifts(shiftsTableData) {
    let allSessions = [];

    shiftsTableData.forEach(shift => {
        shift.subField.forEach(session => {
            allSessions.push({
                sessionID: session.sessionID,
                date: shift.date,
                shiftName: shift.shift,
                sessionStartTime: session.sessionStartTime,
                sessionEndTime: session.sessionEndTime,
                teacher1: session.teacher1,
                teacher2: session.teacher2 ?? '---', // Fallback for undefined teacher2
            });
        });
    });

    return allSessions;
}

const savePressed = async () => {
  setSaveHasBeenPressed(true)
  
  const sessions = extractAllSessionsFromShifts(shiftsTableData);

  try {
      // Creating an array of promises for each session update
      const updatePromises = sessions.map(session => {
          return updateSessionTeachers(session.sessionID, [session.teacher1, session.teacher2].filter(Boolean));
      });

      // Wait for all session updates to complete
      await Promise.all(updatePromises);

      // After all updates are done, change the search status
      changeSearchStatus(true);
      
      setIsSaved(true)
  } catch (error) {
      console.error("Error updating sessions:", error);
      // Handle errors as needed
  }
  getShiftsWithinTimePeriodAndUpdateTable()// recalls to update warnings
};
  
  const handleTeacherSelection = ({ rowData, value, fieldName, cellData, subField, isSubField }) => {
    changeSearchStatus(false);
    setIsSaved(false)
    // 
    setShiftsTableData(currentData => {
        return currentData.map(shift => {
            // Find the correct shift
            const teacherName  = removeEmojis(value?.name ?? '---')
            console.log("teacherName", value)
            if (shift.shift === rowData.shift) {
              
                if (isSubField && subField && subField.sessionID) {
                    // Update the specific session within the shift (subfield update)
                    const updatedSubFields = shift.subField.map(session => {
                        if (session.sessionID === subField.sessionID) {
                            return { 
                                ...session, 
                                [fieldName]: teacherName, // Handle undefined value.name
                          
                            };
                        }
                        return session;
                    });

                    // Check if all sessions now have the same teacher
                    const allSameTeacher = updatedSubFields.every(session => session[fieldName] === teacherName);
                    const mainFieldValue = allSameTeacher && teacherName;

                    return {
                        ...shift,
                        [fieldName]: mainFieldValue,
                        subField: updatedSubFields,
                        
                    };
                } else {
                    // Update all sessions within the shift (main field update)
                    const newValue = value?.name ?? '---'; // Handle undefined value.name
                    return {
                        ...shift,
                        [fieldName]: newValue, // Update the main field
                        
                        subField: shift.subField.map(session => ({
                            ...session,
                            [fieldName]: newValue, // Update all subfields
                            
                        }))
                    };
                }
            }
            return shift;
        });
    });
};

async function makeAllocateShiftsPostRequest(startDateTimestamp, endDateTimestamp, alreadyAssignedShifts) {
  const url = '/api/scheduling/allocateShifts';
  const payload = {
      startDateTimestamp,
      endDateTimestamp,
      alreadyAssignedShifts
  };

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return data;
  } catch (error) {
      console.error('Error making POST request:', error);
  }
}
const autoGenerate = async () => {
  changeSearchStatus(false);
  setIsSaved(false)
  setIsLoading(true);
  

  // Fetch allocated teachers data
  const allocationData = await makeAllocateShiftsPostRequest(startTimeTimestamp, endTimeTimestamp, []);
  const allocatedTeacherData = allocationData.assignedTeachers; 
  

  // Flatten out the date part and focus on the shiftIDs
  const flattenedTeacherData = {};
  Object.keys(allocatedTeacherData).forEach(dateKey => {
    Object.keys(allocatedTeacherData[dateKey]).forEach(shiftID => {
      flattenedTeacherData[shiftID] = allocatedTeacherData[dateKey][shiftID];
    });
  });

  console.log(flattenedTeacherData)
  console.log("shiftsTableData", shiftsTableData)
  // Update the shiftsTableData with the allocated teachers

  let updatedShifts = shiftsTableData
  updatedShifts.forEach(shift => {


    // Find the corresponding allocated teacher data for each shift
    const shiftTeacherData = flattenedTeacherData[shift.shiftID]; // Use shiftID to match

    // If there is allocated teacher data, update the shift's teacher fields
    if (shiftTeacherData) {
      const teacherIDs = shiftTeacherData.assignedTeachers || [];
      shift.teacher1 = teacherIDs[0] ? teacherIDName[teacherIDs[0]] || '' : ''; // Assign the first teacher name or empty string
      shift.teacher2 = teacherIDs[1] ? teacherIDName[teacherIDs[1]] || '' : ''; // Assign the second teacher name or empty string

      // Update the subField (sessions) similarly
      shift.subField = shift.subField.map(session => {
        session.teacher1 = teacherIDs[0] ? teacherIDName[teacherIDs[0]] || '' : ''; // Assign the first teacher name or empty string
        session.teacher2 = teacherIDs[1] ? teacherIDName[teacherIDs[1]] || '' : ''; // Assign the second teacher name or empty string
        return session;
      });
    }

    
    
  
  })
 
  console.log("updatedShifts", updatedShifts)
  setShiftsTableData(updatedShifts);
  setIsLoading(false);
};

const handleEmailTeachers = async () => {
  setEmailStatusMessage("");
  setEmailError(false);

  try {
    const response = await fetch('/api/sendShiftNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add any necessary body or headers to your request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setEmailStatusMessage("Successfully emailed teachers.");
  } catch (error) {
    console.error('Error sending email:', error);
    // setEmailStatusMessage("Failed to send email to teachers.", error);
    setEmailError(true);
  }
};
  const updateWarnings = async (shiftsData) =>{
    formatShiftsDataForTable(shiftsData, teacherID).then((formattedShiftsData) => {
      setShiftsTableData(formattedShiftsData);
  
    });
  }
  const getShiftsWithinTimePeriodAndUpdateTable= async () => {
    
    setShiftsTableData([])

    getShiftsWithinTimePeriod(startTimeTimestamp, endTimeTimestamp).then((shiftsData) => {
      formatShiftsDataForTable(shiftsData, teacherID).then((formattedShiftsData) => {
        setShiftsTableData(formattedShiftsData);
        setIsLoading(false);
      });
     
    });
  }

  useEffect(() => {
   
    setIsLoading(true)
    setShiftsTableData([])

    getShiftsWithinTimePeriodAndUpdateTable()

    getAllTeachers().then((teachersData) => {
      console.log(teachersData)
      
      // Creating an object with id as key and name as value
      const teachersDictionary = teachersData.reduce((acc, teacher) => {
        acc[teacher.id] = teacher.name;
        return acc;
      }, {});
      setTeacherIDName(teachersDictionary)
    })

      
    //   setShiftsTableData(formattedShiftsData);
    //   // Now you can use formattedData as the data prop for DropDownTable
    // });
  }, [startTimeTimestamp, endTimeTimestamp]);
  


  return (
    <div>
      <EditableShiftsAllocationTable
        data={shiftsTableData}
        structure={shiftsTableStructure}
        
        onTeacherSelectedChange={handleTeacherSelection}
        onEditPressed={(item, fieldName, newValue) => {
          
          // You can also handle the update logic here if needed
        }}
        
      />
      {isLoading && (
              <h1>Loading...</h1>
            )} 
      <br />
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid xs={2}>
            
          <Button onClick={autoGenerate}  sx={{ marginLeft: 2, width: '100%' }}>Auto Generate</Button>
          
          </Grid>
          <Grid xs={7}>
          
          </Grid>

          <Grid xs={3}>
          <Button color='success' sx={{ width: '100%' }} onClick={savePressed}>Save</Button>  </Grid>
          {!isSaved && (
          
            <h3 style={{color:"red"}}>Changes not saved</h3>
            )}
        </Grid>
        <br />
        <Button onClick={handleEmailTeachers}>Email Changed Teachers</Button>
        
          {emailStatusMessage && (
            <div style={{ color: emailError ? "red" : "green" }}>
              {emailStatusMessage}
            </div>
          )}
    </div>
  );
}