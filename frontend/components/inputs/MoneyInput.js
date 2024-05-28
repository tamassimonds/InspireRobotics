import * as React from 'react';
import Input from '@mui/joy/Input';

export default function InputDecorators({ valueUpdated, value }) {
  const [currency, setCurrency] = React.useState('dollar');
  
  // Ensure currentValue is always initialized to a string
  const [currentValue, setCurrentValue] = React.useState(value || '');

  const handleInputChange = (event) => {
    setCurrentValue(event.target.value);
    if (valueUpdated) {
      valueUpdated(event.target.value);
    }
  };

  React.useEffect(() => {
    // Also ensure the value is always a string here
    setCurrentValue(value || '');
  }, [value]);

  return (
    <Input
      placeholder="Amount"
      value={currentValue}
      onChange={handleInputChange}
      startDecorator={{ dollar: '$' }[currency]}
      sx={{ width: 300 }}
    />
  );
}