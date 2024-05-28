"use client"
import Button from "@mui/joy/Button"
import DateInput from "/components/inputs/DateInput.js"
import Card from "@mui/joy/Card";
import Timeline from '/components/table/timeline.js';
import {getAllTeachersAvailabilityAndExceptions} from "lib/firebase/library"
import moment from 'moment';
import Stack from "@mui/joy/Stack"
import { useEffect, useState } from "react";

export default function EmployeeAvailabilityTimeline() {

  const [date, setDate] = useState(new Date());
  const [dayOfWeek, setDayOfWeek] = useState();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const processDataForTable = (data, inputDate) => {
    const formattedData = {};
  
    for (const [employeeID, info] of Object.entries(data)) {
      const availabilityArray = new Array(88).fill(0);
      const dateMoment = moment(inputDate);
      let isAvailableForTheDay = false;
  
      for (const availability of info.weekly) {
        if (availability.day === dateMoment.format('dddd')) {
          isAvailableForTheDay = true;
          
          const startTime = moment(availability.startTime, 'h:mm A');
          const endTime = moment(availability.endTime, 'h:mm A');
  
          const startHour = startTime.hour();
          const startMinute = startTime.minute();
          const endHour = endTime.hour();
          const endMinute = endTime.minute();
  
          let startIndex = (startHour - 6) * 6 + Math.floor(startMinute / 10);
          let endIndex = (endHour - 6) * 6 + Math.ceil(endMinute / 10);
  
          // Ensure indices are within bounds
          startIndex = Math.max(startIndex, 0);
          endIndex = Math.min(endIndex, 87);
  
          availabilityArray.fill(1, startIndex, endIndex);
        }
      }
  
      if (isAvailableForTheDay) {
        for (const exception of info.exceptions) {
          const exceptionStart = moment(exception.startDateTimestamp);
          const exceptionEnd = moment(exception.endDateTimestamp);
  
          if (dateMoment.isSame(exceptionStart, 'day')) {
            const startHour = exceptionStart.hour();
            const startMinute = exceptionStart.minute();
            const endHour = exceptionEnd.hour();
            const endMinute = exceptionEnd.minute();
  
            let startIndex = (startHour - 6) * 6 + Math.floor(startMinute / 10);
            let endIndex = (endHour - 6) * 6 + Math.ceil(endMinute / 10);
  
            // Ensure indices are within bounds
            startIndex = Math.max(startIndex, 0);
            endIndex = Math.min(endIndex, 87);
  
            availabilityArray.fill(0, startIndex, endIndex);
          }
        }
      }

      // Check assigned sessions and mark as '2'
      if (info.sessionsAssigned) {
      info.sessionsAssigned.forEach(session => {
          const sessionStart = moment(session.startTimeTimestamp);
          const sessionEnd = moment(session.endTimeTimestamp);

          if (dateMoment.isSame(sessionStart, 'day')) {
              let startIndex = (sessionStart.hour() - 6) * 6 + Math.floor(sessionStart.minute() / 10);
              let endIndex = (sessionEnd.hour() - 6) * 6 + Math.ceil(sessionEnd.minute() / 10);

              startIndex = Math.max(startIndex, 0);
              endIndex = Math.min(endIndex, 87);

              availabilityArray.fill(2, startIndex, endIndex);
          }
      });
    }
      formattedData[employeeID] = { name: info.name, array: availabilityArray };
    }
  
    return formattedData;
  };
  // In EmployeeAvailabilityTimeline component
  useEffect(() => {
    setLoading(true);
      setDayOfWeek(moment(date).format('dddd'));
      getAllTeachersAvailabilityAndExceptions().then((data) => {
          console.log("data", data)
          const formattedData = processDataForTable(data, date);
          setData(formattedData);
          setLoading(false);
          console.log("formattedData", formattedData);
          // Use formattedData for your Timeline component
      });
  }, [date]); 

  
    return (
      <div>
        <Card>
        <Stack direction="horizontal">        
            
          <DateInput value={date} valueUpdated={(value) => setDate(value)}/>
          
          <Button onClick={() => setDate(moment(date).subtract(1, 'days').toDate())} >Minus Day</Button>
          <Button onClick={() => setDate(moment(date).add(1, 'days').toDate())} >Add Day</Button>
          <h4>{dayOfWeek}</h4>
          {loading &&(
          <h1>Loading..</h1>
        )}
        </Stack>
      
                
        {/* Want a timeline here 
        Hard to find a good one online
        Might consider making own */}
        <Timeline data={data}></Timeline>
        </Card>
      </div>
     
    )
  }
  