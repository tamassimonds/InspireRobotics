
"use client"

import Image from 'next/image'
import styles from './page.module.css'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import EditableTable from '../components/table/EditableTable.js'
import PlainTable from '../components/table/Table.js'

import NestedModal from "../components/modal/NestedModal.js"

import DeleteModal from "../components/modal/DeleteModal.js"

import openModal from "../components/modal/NestedModal.js"

import SearchableDropDown from "../components/dropDown/SearchableDropDown.js"
import Card from '@mui/joy/Card';


import PlainCalendar from "../components/calendar/PlainCalendar.js"

import RadioButton from "../components/inputs/RadioButton.js"

import DateInput from "../components/inputs/DateInput.js"

import MoneyInput from "../components/inputs/MoneyInput.js"

import TextInput from "../components/inputs/TextInput.js"
import TimeInput from "../components/inputs/TimeInput.js"

import CheckBox from "../components/inputs/CheckBox.js"

import { getFunctions, httpsCallable } from "firebase/functions";


export default function DashBoard() {
  


  React.useEffect(() => { 
   

    // const isEmployeeAvailableInRange = httpsCallable(functions, 'addmessage');
    // console.log("isEmployeeAvailableInRange", isEmployeeAvailableInRange)
    // isEmployeeAvailableInRange()
    // isEmployeeAvailableInRange({ text: "messageText" })
    //   .then((result) => {
    //     // Read result of the Cloud Function.
    //     /** @type {any} */
    //     const data = result.data;
    //     console.log(data)
    //     const sanitizedMessage = data.text;
    //   });

  }, []);

  const [open, setOpen] = React.useState(false);
  const [modalLoading, setModalLoading] = React.useState(false);
  function handleClick() {
    setOpen(true);
  }
  
  function handleClose() {
    if (modalLoading == false){
      setOpen(false);
    }
  }

  function modalDeletePressed(){
    console.log("delete pressed")
    setModalLoading(true)
    
  }


  function onClick(){
    console.log("clicked")
  }

  function inputSelected(value){
    console.log(value)
  }
  
  const radioOptions = [
    { label: 'Outlined', value: 'outlined' },
    { label: 'Filled', value: 'filled' },
    { label: 'Standard', value: 'standard' },
  ];

  const dropDownOptions = ["one", "two", "three"];

  return (
    <div>
      <Card>
      <h1>Inputs</h1>
      <CheckBox
      options={[
        { label: 'Option 1', defaultChecked: true },
        { label: 'Option 2', defaultChecked: false },
      ]}
      valueUpdated={(newValues) => console.log('New checked values:', newValues)}
    />
      <TextInput></TextInput>
      <TimeInput 
      defaultValue="2024-09-24T1:34:56" 
      valueUpdated={(value) => console.log("New value:", value)}
      label="Custom Time Picker"
    />
    
      <MoneyInput defaultValue={233}></MoneyInput>
      
      <RadioButton
      options={radioOptions}
      onSelect={(value) => console.log('Selected:', value)}
      defaultSelected="outlined"
    />
      <DateInput onDateUpdate={inputSelected}></DateInput>
      <SearchableDropDown valueUpdated={inputSelected} options={dropDownOptions} defaultOption="one"> </SearchableDropDown>
      </Card>
      <PlainCalendar></PlainCalendar>
      <Stack spacing={2} direction="row">
        
        <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
      </Stack>
      <EditableTable />
      <PlainTable></PlainTable>
      <DeleteModal deletePressed={modalDeletePressed} open={open} handleClose={handleClose} loading={modalLoading}/>
      <button onClick={handleClick}>Like</button>
    </div>
   
  )
}
