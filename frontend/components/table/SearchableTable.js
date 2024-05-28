import * as React from 'react';
import TextInput from "/components/inputs/TextInput.js";
import Table from "/components/table/Table.js";
import Stack from '@mui/joy/Stack';



/* 
const fields = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'ID' },
 
];
*/
export default function SearchableTable({ fields = [], data = [], name = "", searchField="", handleRowSelected }) {
  const [searchTextValue, setSearchTextValue] = React.useState("");
  const [filteredData, setFilteredData] = React.useState([]);

  React.useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data);
      searchUpdated(searchTextValue); // Update with the current search text
    }
  }, [data]); // Runs only when `data` changes

  const searchUpdated = (value) => {
    setSearchTextValue(value);
    if (!value) {
      setFilteredData(data);
      return;
    }
    setFilteredData(data.filter(row => {
      const fieldValue = row[searchField];
      if(!fieldValue) return ""
      return fieldValue && typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(value.toLowerCase());
    }));
  };

  return (
    <div>
      <Stack direction="row">
        <label htmlFor="">Search: </label>
        <TextInput valueUpdated={(value) => searchUpdated(value)} />
      </Stack>
      <Table
        fields={fields}
        data={filteredData}
        name={name}
        handleRowSelected={handleRowSelected}
      />
    </div>
  );
}