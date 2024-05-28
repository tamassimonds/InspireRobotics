"use client"

import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/joy/Card';
import Button from '@mui/joy/Button';
import Stack from '@mui/material/Stack';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import DateInput from "/components/inputs/DateInput.js"
import TimeInput from "/components/inputs/TimeInput.js"
import NumberInput from "/components/inputs/NumberInput.js"
import EditableTable from "/components/table/EditableTable.js"

export default function StartEndTimeInput({ valueUpdated, value }) {
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [dayErrorMessage, setDayErrorMessage] = useState("");

  const handleAddSession = () => {
    setDayErrorMessage("");

    // Create moment objects from timestamps
    const startDateMoment = moment(startDate);
    const startTimeMoment = moment(startTime);
    const endTimeMoment = moment(endTime);

    // Check if the timestamps are valid
    if (!startDateMoment.isValid() || !startTimeMoment.isValid() || !endTimeMoment.isValid()) {
      setDayErrorMessage("Invalid date or time. Please enter valid values.");
      return;
    }

    let newTableData = [];
    for (let week = 0; week < numberOfWeeks; week++) {
      // Calculate the date for the current week
      const weekStartDateMoment = moment(startDate).add(week, 'weeks');

      // Combine the week's date with the start time and end time
      const startDateTimeMoment = weekStartDateMoment.clone().hour(startTimeMoment.hour()).minute(startTimeMoment.minute());
      const endDateTimeMoment = weekStartDateMoment.clone().hour(endTimeMoment.hour()).minute(endTimeMoment.minute());

      const uniqueId = uuidv4();

      const newDay = {
        startDate: weekStartDateMoment.format('DD/MM/YYYY'),
        startTime: startDateTimeMoment.format('hh:mm A'),
        endTime: endDateTimeMoment.format('hh:mm A'),
        startDay: weekStartDateMoment.format('dddd'),
        uniqueId,
        startDayTimeStamp: weekStartDateMoment.valueOf(),
        startTimeTimeStamp: startDateTimeMoment.valueOf(),
        endTimeTimeStamp: endDateTimeMoment.valueOf(),
      };

      newTableData.push(newDay);
    }

    // Log and update state with the new table data
    console.log(newTableData);
    setTableData([...tableData, ...newTableData]);
    valueUpdated([...tableData, ...newTableData]);
  };


  const fields = [
    { id: 'startDate', numeric: false, disablePadding: true, label: 'date' },
    { id: 'startDay', numeric: false, disablePadding: true, label: 'Day' },
    { id: 'startTime', date: true, numeric: true, disablePadding: false, label: 'Start Time' },
    { id: 'endTime', date: true, numeric: true, disablePadding: false, label: 'End Time' },
    { id: 'startDayTimeStamp', hidden: true, numeric: false, disablePadding: true, label: 'date' },
    { id: 'startTimeTimeStamp', hidden: true, date: true, numeric: true, disablePadding: false, label: 'Start Time' },
    { id: 'endTimeTimeStamp',hidden: true,  date: true, numeric: true, disablePadding: false, label: 'End Time' },
    
  ];



  const rowDeleted = (row) => {
    console.log("row", row);
    console.log(tableData)
    const newTableData = tableData.filter((day) => day.uniqueId !== row.uniqueId);
    setTableData(newTableData);
    valueUpdated([...newTableData]);
};
   

  React.useEffect(() => {
    
    if (value) {
      setTableData(value);
    }
  }, [value]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
        
        <Card>
            <Stack spacing={6} direction="row">
                <div>
                    <label htmlFor="">Date</label>
                    <DateInput valueUpdated={setStartDate} />
                </div>
                <div>
                    <label htmlFor="">Start Time</label>
                    <TimeInput valueUpdated={setStartTime} />
                </div>
                <div>
                    <label htmlFor="">End Time</label>
                    <TimeInput valueUpdated={setEndTime} />
                </div>
            </Stack>
            <label htmlFor="">Weekly Number Of Weeks</label>
            <NumberInput valueUpdated={setNumberOfWeeks} />
            <Button onClick={handleAddSession}>Add Session</Button>
            <EditableTable data={tableData} fields={fields} handleDeletePressed={rowDeleted} />
        </Card>
        
    </div>
)
}