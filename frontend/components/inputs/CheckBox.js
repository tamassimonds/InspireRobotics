import * as React from 'react';
import { Stack } from '@mui/material';
import Checkbox from '@mui/joy/Checkbox';

export default function BasicCheckbox({ options = [], valueUpdated }) {
  // Convert string array to an array of objects with 'label' properties
  const formattedOptions = options.map(option => typeof option === 'string' ? { label: option } : option);

  const [checkedValues, setCheckedValues] = React.useState(
    formattedOptions.reduce((acc, option) => {
      acc[option.label] = option.defaultChecked !== undefined ? option.defaultChecked : false;
      return acc;
    }, {})
  );

  const handleChange = (label) => (event) => {
    const newCheckedValues = {
      ...checkedValues,
      [label]: event.target.checked,
    };
    setCheckedValues(newCheckedValues);

    // Call the callback with only the checked options
    if (valueUpdated) {
      const checkedOptions = Object.entries(newCheckedValues)
                                  .filter(([label, isChecked]) => isChecked)
                                  .map(([label]) => label);
                                  valueUpdated(checkedOptions);
    }
  };

  return (
    <Stack sx={{ display: 'flex', gap: 3 }}>
      {formattedOptions.map((option, index) => (
        <Checkbox
          key={index}
          label={option.label}
         
          checked={checkedValues[option.label]}
          onChange={handleChange(option.label)}
        />
      ))}
    </Stack>
  );
}