"use client"
import React, { useState } from 'react';
import Card from '@mui/joy/Card';
import TextInput from "/components/inputs/TextInput.js";
import MoneyInput from "/components/inputs/MoneyInput.js";
import NumberInput from "/components/inputs/NumberInput.js";
import CourseDropDown from "/components/dropDown/specific/CourseDropDown.js";
import Button from '@mui/joy/Button';
import { addDoc, collection } from "firebase/firestore"; 
import { dbref } from '/lib/firebase/library';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid function

import {useRouter} from 'next/navigation';
export default function Home() {
  
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState("");
  const [moduleData, setModuleData] = useState({
    name: '',
    course: '',
    costPerStudent: '',
    minAge: '',
    maxAge: '',
    hours: '',
    id: uuidv4(), // Generate a unique ID for each module
    // ... other fields if any
  });

  const handleInputChange = (field) => (value) => {
    setModuleData({ ...moduleData, [field]: value });
  };

  const validateData = () => {
    for (const [key, value] of Object.entries(moduleData)) {
      // Check if the value is a string and empty
      if (typeof value === 'string' && value.trim() === '') {
        setErrorMessage(`The field '${key}' cannot be empty.`);
        return false;
      }
  
      // For non-string values (like numbers), check if they are not set (assuming 0 is not a valid value)
      if (typeof value !== 'string' && (value === null || value === undefined)) {
        setErrorMessage(`The field '${key}' cannot be empty or zero.`);
        return false;
      }
    }
    return true;
  };

  const addModule = async () => {
    setErrorMessage(""); // Clear previous error message

    if (!validateData()) {
      // Error message is set in validateData function
      return;
    }

    try {
      const docRef = await addDoc(collection(dbref, "holidayProgramModules"), moduleData);
      console.log("Document written with ID: ", docRef.id);
      router.push('/admin/courses/holidayModules');
      // Reset form or navigate away
    } catch (e) {
      console.error("Error adding document: ", e);
      setErrorMessage("Failed to add module. Please try again.");
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card>
        <label htmlFor="">Holiday Module Name</label>
        <TextInput valueUpdated={handleInputChange('name')} />
        
        <label htmlFor="">Course</label>
        <CourseDropDown valueUpdated={handleInputChange('course')} />

        <label htmlFor="">Cost per Student</label>
        <MoneyInput valueUpdated={handleInputChange('costPerStudent')} />
        
        <label htmlFor="">Min age (Age NOT YEAR LEVEL)</label>
        <NumberInput valueUpdated={handleInputChange('minAge')} />

        <label htmlFor="">Max age</label>
        <NumberInput valueUpdated={handleInputChange('maxAge')} />

        <label htmlFor="">Recommended Number of Hours</label>
        <NumberInput valueUpdated={handleInputChange('hours')} />

       

        <p style={{ color: "red" }}>{errorMessage}</p>
        <Button onClick={addModule}>Add Module</Button>
      </Card>
    </div>
  );
}