
"use client"


import WeekSelect from '/components/search/weekSelect.js';
import Card from "@mui/joy/Card";

import {useState, useEffect} from 'react';
import EditableShiftsAllocation from '/components/table/specific/EditableShiftsAllocation.js';
const moment = require('moment');

export default function Home() {

    const [searchStatus, setSearchStatus] = useState(true)
    const [startTimeStamp, setStartTimeStamp] = useState()
    const [endTimeStamp, setEndTimeStamp] = useState()

    const changeSearchStatus = (status) => {
        setSearchStatus(status)
    }

    const getTimestampInOneWeek = (timestamp) => {
        // Create a Moment instance from the provided timestamp
        const momentInstance = moment(timestamp);

        // Add one week to the moment instance
        momentInstance.add(1, 'weeks');

        // Return the new timestamp (in milliseconds)
        return momentInstance.valueOf();
    };

    function getMondayTimestampOfTheWeek(date) {
      // Create a moment object for the given date
      const givenDate = moment(date);
  
      // Find the start of the week (Sunday) and add one day to get to Monday
      const monday = givenDate.startOf('week').add(1, 'days');
  
      // Return the timestamp
      return monday.valueOf(); // or monday.unix() for a UNIX timestamp
  }
  
  // Example usage:
  let date = new Date(); // Use any date
  let mondayTimestamp = getMondayTimestampOfTheWeek(date);

  
  useEffect(() => {
    // Get the current date
    let currentDate = new Date();

    // Get the timestamp of the Monday of the current week
    let currentWeekMondayTimestamp = getMondayTimestampOfTheWeek(currentDate);

    // Set the startTimeStamp to the Monday of the current week
    setStartTimeStamp(currentWeekMondayTimestamp);

    // Set the endTimeStamp to one week from the current week's Monday
    setEndTimeStamp(getTimestampInOneWeek(currentWeekMondayTimestamp));
}, []);
    

    const updateInputTime = (time) => {
        // Start and End time is set to start and end of week
        const startOfWeek = moment(time).startOf('week').valueOf(); // .valueOf() will convert the moment object to a timestamp
        const endOfWeek = moment(time).endOf('week').valueOf(); // .valueOf() will convert the moment object to a timestamp

        setStartTimeStamp(startOfWeek)
        setEndTimeStamp(endOfWeek)
      

        console.log(time, getTimestampInOneWeek(time))
    }

    return (
      <div>
        <h1>Allocate Shifts</h1>
        <Card>

            {searchStatus && (
              <WeekSelect valueUpdated={updateInputTime} value={startTimeStamp} />
            )}   
          
          
          <EditableShiftsAllocation changeSearchStatus={changeSearchStatus} startTimeTimestamp={startTimeStamp} endTimeTimestamp ={endTimeStamp}/>
          
          
          
        </Card>
      </div>
     
    )
  }
  