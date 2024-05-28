import * as React from 'react';
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/joy/Button';

import { useEffect } from 'react';

export default function BasicInput({ value, placeHolder, valueUpdated, width = "100%" }) {
  const [currentValue, setCurrentValue] = React.useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  

  const handleChange = (event) => {
    const newValue = event.target.value;
    setCurrentValue(newValue);

    if (valueUpdated) {
      valueUpdated(newValue);
    }
  };

  return (
    <div>
      <Textarea
        placeholder={placeHolder}
        required
        value={currentValue}
        onChange={handleChange}
        sx={{ mb: 1, width: width }}
      />
   
   
    </div>
  );
}
