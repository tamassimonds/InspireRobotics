"use client"

import Card from '@mui/joy/Card';
import React, {useEffect, useState} from 'react';

import { v4 as uuidv4 } from 'uuid';

import GenericForm from '/components/form/GenericForm.js'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { createUser, createNewEmployee} from "/lib/firebase/auth"
import { getConfigurations} from "/lib/firebase/handleSettings"
export default function Home() {
  const router = useRouter();  
  const searchParams = useSearchParams();

  const memberID = searchParams.get('memberID');

  const [config, setConfig] = useState({})
  const [errorMessage, setErrorMessage] = useState("")
  const getConfigs = async () => {
    const configs = await getConfigurations()
    setConfig(configs)
  }

  useEffect(() => {
    getConfigs()
  }, [])


  const formFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
   
    },
    {
      name: 'address',
      label: 'Address (Street, Suburb, State, Country)',
      type: 'text',
      required: true,
   
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,

    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'phone',
 
    },
    {
      name: 'wwcNumber',
      label: 'WWC Number',
      type: 'text',
     
    },
    
    
   
   
    {
      name: 'accessToCar',
      label: 'Access To Car',
      type: 'boolean',
    
    },

    {
      name: 'isInTraining',
      label: 'Is In Training',
      type: 'boolean',
      prop: {defaultValue: true}
      
    },
   
    
   
    
   
   
    // Add more fields as needed for your form
  ];


  const handleFormSubmit = async (formData) => {
    console.log(formData.email);
    setErrorMessage("");
  
    // Create user
    const userResponse = await createUser(formData.email);
    if (!userResponse || userResponse.error) {
      console.log(userResponse)
      setErrorMessage(typeof userResponse.message === "string" ? userResponse.message : "Failed to create user account. May be that email is taken already");
      return;
    }

    const userID = uuidv4()
  
    // Prepare employee data
    const employeeData = {
      ...formData,
      UID: [userResponse.uid],
      id: userID,
      accountDisabled: false,
      rndPayRate: config.paySettings.defaultRNDRate,
      standardPayRate: config.paySettings.defaultStandardPay, 
      transportationPayStart: config.paySettings.defaultTransportationPayStartHours,
      activeTeacher: true,
    };
    console.log(employeeData)
    // Create new employee
    const employeeResponse = await createNewEmployee(employeeData);
    if (!employeeResponse.success) {
      console.log(userResponse)
      setErrorMessage(typeof employeeResponse.message === "string" ? employeeResponse.message : "Failed to create employee.");
      return;
    }
  
    console.log("Employee created successfully with ID:", employeeResponse.id);
    router.push("/admin/team/members/memberProfile?memberID="+userID)
    // Additional success handling code...
  };

  const collectionName = "employees";

    return (
      <div>
      <h1>New Employee</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= {"/admin/team/members/memberProfile?memberID="+memberID}
        handleFormSubmit={handleFormSubmit}
        referenceID ={memberID}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
        <p style={{color: "red"}}>{errorMessage}</p>

    </div>
     
    )
  }
  