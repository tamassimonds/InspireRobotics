import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

export default function UneditableTagsInput({ value, valueUpdated }) {
  const [tags, setTags] = React.useState([]);

  // Sync external value prop with internal tags state
  useEffect(() => {
    setTags(value);
  }, [value]);

  const handleOnChange = (event, newValue) => {
    // Update tags state and call valueUpdated
    setTags(newValue);
    if (valueUpdated) {
      valueUpdated(newValue);
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
       
         
          inputProps={{ ...params.inputProps, inputMode: 'none', pattern: '[]*' }}
        />
      )}
    />
  );
}