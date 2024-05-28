import * as React from 'react';
import { useState } from 'react';
import { Stack, Box } from '@mui/material';
import Button from '@mui/joy/Button';
import moment from 'moment';

import DateInput from "/components/inputs/DateInput.js";

export default function ProgramSearch({ programs = [], valueUpdated, value = new Date().getTime()}) {
  
  const [currentDate, setCurrentDate] = useState(value);


  React.useEffect(() => {
    setCurrentDate(value);
  }, [value]);

  const getTimestampInOneWeek = (timestamp, weeksToAdd) => {
    return moment(timestamp).add(weeksToAdd, 'weeks').valueOf();
  };

  const handleDateChange = (timestamp) => {
    setCurrentDate(timestamp);
    if (valueUpdated) {
      valueUpdated(timestamp);
    }
  };

  const handlePreviousWeek = () => {
    const newDate = getTimestampInOneWeek(currentDate, -1);
    handleDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = getTimestampInOneWeek(currentDate, 1);
    handleDateChange(newDate);
  };

  const handleClear = () => {
    setCurrentDate(new Date().getTime());
    if (valueUpdated) {
      valueUpdated(new Date().getTime());
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
      <DateInput valueUpdated={handleDateChange} value={currentDate}></DateInput>
      <Button onClick={handlePreviousWeek}>Previous Week</Button>
      <Button onClick={handleNextWeek}>Next Week</Button>
      <Box flexGrow={1} />
      <Button color="danger" onClick={handleClear}>Clear</Button>
      <Button>More</Button>
    </Stack>
  );
}