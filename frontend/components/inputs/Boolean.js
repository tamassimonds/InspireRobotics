import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/joy/Checkbox';

export default function BasicCheckbox({ label, value, defaultValue, valueUpdated }) {
  // Initialize isChecked with value or defaultValue if value is undefined
  const [isChecked, setIsChecked] = useState(value !== undefined ? value : defaultValue);

  useEffect(() => {
    // Update isChecked if value prop changes
    setIsChecked(value !== undefined ? value : defaultValue);
  }, [value, defaultValue]);

  const handleChange = (event) => {
    const newChecked = event.target.checked;
    setIsChecked(newChecked);

    if (valueUpdated) {
      valueUpdated(newChecked);
    }
  };

  return (
    <div>
      <Checkbox
        checked={isChecked} // Use isChecked for the checked state
        onChange={handleChange}
      />
      {label && <label>{label}</label>}
    </div>
  );
}
