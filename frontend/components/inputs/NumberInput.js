import React from 'react';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';

import { useEffect } from 'react'; 

export default function NumberInput({ width = "100%", value, valueUpdated }) {
  const inputRef = React.useRef(null);
  const [currentValue, setCurrentValue] = React.useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleInputChange = (event) => {
    if (valueUpdated) {
      const newValue = event.target.value;
      setCurrentValue(newValue);
      if (valueUpdated) {
        valueUpdated(newValue);
      }
    }
  };

  return (
    <Stack spacing={1.5} sx={{ width: width }}>
      <Input
        type="number"
        width={width}
        value={currentValue}

        onChange={handleInputChange}
      />
    </Stack>
  );
}