import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

export default function TagsInput({ value, valueUpdated }) {
  const [tags, setTags] = React.useState([]);

  // Effect to sync external value prop with internal tags state
  useEffect(() => {
    console.log(value);
    if (value) {
      setTags(value);
      valueUpdated(value);
    }
  }, [value]);

  const handleOnChange = (event, newValue) => {
    // Filter out non-numeric values
    const numericValues = newValue.filter(value => !isNaN(value) && value.trim() !== '');
    setTags(numericValues);
    if (valueUpdated) {
      valueUpdated(numericValues);
    }
  };

  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={[]} // You can put options here if you want to suggest values
      freeSolo // Allows users to input values not suggested in the options
      value={tags}
      onChange={handleOnChange}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label="Type and press enter"
          placeholder="Type and press enter"
          inputProps={{ ...params.inputProps, inputMode: 'numeric', pattern: '[0-9]*' }}
        />
      )}
    />
  );
}