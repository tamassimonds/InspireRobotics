
"use client"


import React, { useState,useEffect } from 'react';

import Button from '@mui/joy/Button';
import TeamMemberTable from "/components/table/specific/TeamMembersTable.js"
import BioCardShort from "/components/card/bioCardShort.js"
import EditableTable from "/components/table/EditableTable.js"
import EmployeeCalendar from "/components/calendar/specific/EmployeeCalendar.js"
import Card from '@mui/joy/Card';
import ShiftSearch from "/components/search/ShiftSearch.js"
import TimeInput from "/components/inputs/TimeInput.js"
import DateInput from "/components/inputs/DateInput.js"
import { v4 as uuidv4 } from 'uuid'; // Importing uuid function
import { useSelector } from 'react-redux';

import SearchableDropDown from "/components/dropDown/SearchableDropDown.js"
import moment from 'moment';

import {timestampToTime} from "lib/firebase/library"
import {updateEmployeeAvailability, getEmployeeAvailabilityAndExceptions , updateEmployeeExceptions} from "lib/firebase/employeeFirebaseLogic"

export default function TeamMembers() {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const [availability, setAvailability] = useState([]);
  const userData = useSelector(state => state.user.userData);
  const [calendarUpdate, setCalendarUpdate] = useState(0);
  const [exception, setException] = useState([]);
  const [availabilityInputError, setAvailabilityInputError] = useState("");
  const [availabilityInput, setAvailabilityInput] = useState({
    start: "",
    end: "",
    day: ""
  });
  const [exceptionInput, setExceptionInput] = useState({
    endDateTimestamp : "",
    startDateTimestamp : "",
  });

  const availabilityTableFields = [
    { id: 'day', numeric: false, disablePadding: true, label: 'Day' },
    { id: 'startTime', numeric: false, disablePadding: true, label: 'Start' },
    { id: 'endTime', numeric: false, disablePadding: true, label: 'End' },
    { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'id' },
  ];
  const exceptionTableFields = [
    { id: 'startDateTime', numeric: false, disablePadding: true, label: 'Start' },
    { id: 'endDateTime', numeric: false, disablePadding: true, label: 'End' },
    { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'id' },
  ];

 
  const handleExceptionChange = (field) => (value) => {
    setExceptionInput(prev => ({ ...prev, [field]: value }));
  };

function isValidDateTimeRange(startTimestamp, endTimestamp) {
  // Convert the timestamps to Date objects
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  // Check if the dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return false;
  }

  // Check if the start date is before the end date
  return startDate < endDate;
}
function getEndTimestamp(endDate, endTime) {
  // Create a new Date object from the endDate timestamp
  const date = new Date(endDate);

  // Parse the endTime
  const time = new Date(endTime);

  // Combine the date and time
  const combinedDateTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );

  // Return the timestamp
  return combinedDateTime.getTime();
}

function formatTimestampToTime(timestamp) {
  return moment(timestamp).format('h:mm A');
}
function formatTimestampToDate(timestamp) {
  return moment(timestamp).format('DD/MM/YY HH:mm');
}

const addException = () => {
  console.log(exceptionInput);
  const startDateTimestamp = getEndTimestamp(exceptionInput.startDate, exceptionInput.startTime);
  const endDateTimestamp = getEndTimestamp(exceptionInput.endDate, exceptionInput.endTime);
 console.log(startDateTimestamp,endDateTimestamp)
  if (!isValidDateTimeRange(startDateTimestamp, endDateTimestamp)) {
    // Handle the error, e.g., set an error state and display it to the user
    return
  }

  const exceptionInputFormatted = {
    startDateTimestamp: startDateTimestamp,
    endDateTimestamp: endDateTimestamp,
    startTime: formatTimestampToTime(startDateTimestamp),
    endTime: formatTimestampToTime(endDateTimestamp),
    startDateTime: formatTimestampToDate(startDateTimestamp),
    endDateTime: formatTimestampToDate(endDateTimestamp),
    id: uuidv4(),
    date: exceptionInput.startDate,

  }

  setException([...exception, exceptionInputFormatted]);
  updateEmployeeExceptions(userData.id, [...exception, exceptionInputFormatted]).then(() => {
    setCalendarUpdate(calendarUpdate + 1)
  })
};

function convertToTimestamp(dateString) {
  return new Date(dateString).getTime();
}

  const handleDeleteException = (row) => {
    const updatedExceptions = exception.filter((ex) => ex.id !== row.id);
    setException(updatedExceptions);
  
    // Update Firebase with the new list of exceptions
    updateEmployeeExceptions(userData.id, updatedExceptions).then(() => {
      setCalendarUpdate(calendarUpdate + 1)
    })
  };

  const handleAvailabilityChange = (field) => (value) => {
    setAvailabilityInput(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // Fetch initial data when the component mounts
    if (userData && userData.id) {
      getEmployeeAvailabilityAndExceptions(userData.id)
        .then(data => {
          setAvailability(data.weekly);
          setException(data.exceptions);
          console.log("exceptions", data.exceptions)
        })
        .catch(error => {
          console.error("Error fetching initial data: ", error);
          // Handle the error appropriately
        });
    }
  }, [userData]);

  useEffect(() => {
    console.log(userData)
  }, [userData]);

  function isValidTimeRange(start, end) {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
  
    // Check if the times are valid and start is before end
    return !isNaN(startTime) && !isNaN(endTime) && startTime < endTime;
  }

  

  const addAvailability = () => {
    console.log(availabilityInput);
    const startTimeStamp = convertToTimestamp(availabilityInput.start);
    const endTimeStamp = convertToTimestamp(availabilityInput.end);
    setAvailabilityInputError("")
    if (!isValidTimeRange(startTimeStamp, endTimeStamp) || !availabilityInput.day) {
      // Handle the error, e.g., set an error state and display it to the user
      setAvailabilityInputError("Invalid Date Input")
      return
    }
  
    const availabilityInputFormatted = {
      startTimeTimeStamp: startTimeStamp,
      endTimeTimeStamp: endTimeStamp,
      day: availabilityInput.day,
      startTime: timestampToTime(startTimeStamp),
      endTime: timestampToTime(endTimeStamp),
      id: uuidv4(),
    };
  
    setAvailability([...availability, availabilityInputFormatted]);
    updateEmployeeAvailability( userData.id,[...availability, availabilityInputFormatted]).then(() => {
      setCalendarUpdate(calendarUpdate + 1)
    })
  }

  const handleDeleteAvailability = (row) => {
    let tempAvailability = [...availability]
    tempAvailability = tempAvailability.filter((availability) => availability.id !== row.id)
    setAvailability(tempAvailability)
    updateEmployeeAvailability( userData.id,tempAvailability).then(() => {
      setCalendarUpdate(calendarUpdate + 1)
    })

  }


  return (
    <div>
          

          <Card>
            <h1>Weekly Availability</h1>
          <EmployeeCalendar employeeID={userData ? userData.id : undefined} update={calendarUpdate}></EmployeeCalendar>
          </Card>
          <Card>
            <h1>Availability</h1>
            <label htmlFor="">Start</label>
            <TimeInput valueUpdated={handleAvailabilityChange('start')} />
            <label htmlFor="">End</label>
            <TimeInput valueUpdated={handleAvailabilityChange('end')} />
            <label htmlFor="">Day</label>
            <SearchableDropDown options={daysOfWeek} valueUpdated={handleAvailabilityChange('day')} />
            <p style={{color:"red"}}>{availabilityInputError}</p>
            <Button onClick={addAvailability}>Add</Button>
            <EditableTable data={availability} fields={availabilityTableFields} handleDeletePressed={handleDeleteAvailability}></EditableTable>
          </Card>


          <Card>
        <h1>Exception</h1>
        <p>Start</p>
        <DateInput valueUpdated={handleExceptionChange('startDate')} width={"300px"} />
        <TimeInput valueUpdated={handleExceptionChange('startTime')} />
        <p>End</p>
        <DateInput valueUpdated={handleExceptionChange('endDate')} />
        <TimeInput valueUpdated={handleExceptionChange('endTime')} />
        <Button onClick={addException}>Add Exception</Button>
        <EditableTable data={exception} fields={exceptionTableFields} handleDeletePressed={handleDeleteException}></EditableTable>
      </Card>
    </div>
  );
   }