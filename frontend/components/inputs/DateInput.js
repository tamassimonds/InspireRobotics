import * as React from 'react';
import { useState, useEffect } from 'react';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import moment from 'moment';

export default function InputSlotProps({ value, valueUpdated }) {
  // Function to format timestamp to date string "YYYY-MM-DD"
  const formatDate = (timestamp) => {
    return timestamp ? moment(timestamp).format('YYYY-MM-DD') : '';
  };

  // State to manage the input value
  const [inputValue, setInputValue] = useState(formatDate(value));

  // Update the input value when the 'value' prop changes
  useEffect(() => {
    setInputValue(formatDate(value));
  }, [value]);

  const handleDateChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue); // Update state with the new input value

    if (valueUpdated) {
      const timestamp = Date.parse(newValue);
      console.log(timestamp);
      valueUpdated(timestamp);
    }
  };

  return (
    <Stack spacing={1.5} sx={{ minWidth: 300 }}>
      <Input
        type="date"
        value={inputValue}
        onChange={handleDateChange}
        slotProps={{
          input: {
            min: '2018-06-07T00:00', // Adjust these values as needed
            max: '2018-06-14T00:00', // Adjust these values as needed
          },
        }}
      />
    </Stack>
  );
}