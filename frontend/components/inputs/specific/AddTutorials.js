import React, { useEffect, useState } from 'react';
import SearchableCourseTutorialDropDown from '/components/dropDown/specific/TutorialsInCourseDropdown.js';
import EditableTable from '/components/table/EditableTable.js';
import Card from '@mui/joy/Card';
import Button from '@mui/joy/Button';
import NumberInput from '/components/inputs/NumberInput.js';

import { v4 as uuidv4 } from 'uuid'; // Importing uuid function

export default function AddTutorials({ courseID, valueUpdated, value }) {
  const [tableData, setTableData] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [sessionNumber, setSessionNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fields = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'sessionNumber', numeric: false, disablePadding: true, label: 'Session Number' },
    { id: 'id', numeric: false, hidden: true, disablePadding: true, label: 'ID' },
  ];

  const tutorialSelected = (tutorial) => {
    setSelectedTutorial(tutorial);
    setSessionNumber(''); // Reset session number on new tutorial selection
    setErrorMessage('');
  };

  const handleDeletePressed = (row) => {
    const newData = tableData.filter(item => item !== row);
    setTableData(newData);
  };

  const addTutorial = () => {
    if (!selectedTutorial || sessionNumber === '') {
      setErrorMessage('Please select a tutorial and enter a session number.');
      return;
    }

    const newEntry = {
      ...selectedTutorial,
      sessionNumber: sessionNumber,
      name: selectedTutorial.title || selectedTutorial.name,
      tutorialID: selectedTutorial.id,
      id: uuidv4()
    };

    // Check if this tutorial with the same session number is already added
    if (tableData.some(item => item.id === newEntry.id && item.sessionNumber === sessionNumber)) {
      setErrorMessage('This tutorial with the same session number already exists.');
      return;
    }

    setTableData([...tableData, newEntry]);
    setSessionNumber(''); // Clear session number for the next entry
    setErrorMessage(''); // Clear any error messages
    valueUpdated([...tableData, newEntry])
  };

  useEffect(() => {
    if (value) {
      setTableData(value);
    }
  }
  , [value]);

  return (
    <div>
      <Card>
        <SearchableCourseTutorialDropDown valueUpdated={tutorialSelected} courseID={courseID} />
        <label htmlFor="sessionNumber">Session Number</label>
        <NumberInput valueUpdated={setSessionNumber} value={sessionNumber} />
        <Button color="success" onClick={addTutorial}>Add</Button>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <EditableTable fields={fields} data={tableData} handleDeletePressed={handleDeletePressed} />
      </Card>
    </div>
  );
}
