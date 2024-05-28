import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

export default function BasicTimePicker({ defaultValue, valueUpdated, label = "Time picker" }) {
  const [selectedTime, setSelectedTime] = React.useState(defaultValue ? dayjs(defaultValue) : null);

  const handleTimeChange = (newValue) => {
    setSelectedTime(newValue);
  
    // Check if newValue is a valid date object
    if (valueUpdated && newValue && dayjs(newValue).isValid()) {
      valueUpdated(newValue.toISOString());
    } else {
      valueUpdated(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker 
          label={label}
          value={selectedTime}
          onChange={handleTimeChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
