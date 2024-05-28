"use client"

import Card from '@mui/joy/Card';
import React from 'react';


import GenericForm from '/components/form/GenericForm.js'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  
  const searchParams = useSearchParams();

  const locationID = searchParams.get('id');

  const formFields = [
    {
      name: 'name',
      label: 'Name*',
      type: 'text',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    {
      name: 'address',
      label: 'Full Address (Street, City, State, Country)',
      type: 'text',
    },
    {
      name: 'email',
      label: 'address',
      type: 'text',
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
    },
    {
      name: 'universityCourse',
      label: 'University Course',
      type: 'text',
    },
    {
      name: 'WWCNumber',
      label: 'WWC Number',
      type: 'text',
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },
    {
      name: 'accessToCar',
      label: 'Access To Car',
      type: 'boolean',
    },
    
    {
      name: 'profileImage',
      label: 'Profile Image',
      type: 'image',
    },
    
    
    
   
    // Add more fields as needed for your form
  ];
  const collectionName = "employees";

    return (
      <div>
      <h1>User Info</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= "/employee/profile/main"
        referenceID ={locationID}
        canDelete={false}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
     
    )
  }
  