import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';

export default function SearchableDropDown({ valueUpdated, options = [], width = 300, placeHolder = "", value = "" }) {
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div>
      <Autocomplete
        placeholder={placeHolder}
        value={internalValue}
        onChange={(event, newValue) => {
          setInternalValue(newValue);
          valueUpdated(newValue);
        }}
        inputValue={internalValue}
        onInputChange={(event, newInputValue) => {
          setInternalValue(newInputValue);
        }}
        options={options}
        getOptionLabel={(option) => option ?? ''}
        isOptionEqualToValue={(option, value) => option === value}
        sx={{ width: width }}
      />
    </div>
  );
}