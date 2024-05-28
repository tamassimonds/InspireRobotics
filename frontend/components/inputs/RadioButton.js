import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';

export default function RadioButton({ options = [], onSelect, defaultSelected = "" }) {
  const [selectedValue, setSelectedValue] = React.useState(defaultSelected);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);

    if (onSelect) {
      onSelect(newValue);
    }
  };

  return (
    <FormControl>
      <FormLabel>Variants</FormLabel>
      <RadioGroup
        value={selectedValue}
        onChange={handleChange}
        name="radio-buttons-group"
      >
        {options.map((option, index) => (
          <Radio
            key={index}
            value={option.value}
            label={option.label}
            variant="outlined"
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}