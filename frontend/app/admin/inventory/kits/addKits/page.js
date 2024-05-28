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
      label: 'Kit Name',
      type: 'text',
      props: { placeholder: 'Enter course name' },
    },
    
    {
      name: 'description',
      label: 'Description',
      type: 'text',
    },
    {
      name: 'numBoxes',
      label: 'numBoxes',
      type: 'number',
    },
    
    {
      name: 'courseIDs',
      label: 'Courses',
      type: 'multipleCourse',
      props: { placeholder: 'Enter course description', multiline: true },
    },
   
    // Add more fields as needed for your form
  ];
  const collectionName = "kits";

    return (
      <div>
      <h1>Kit Input</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= "/admin/inventory/kits"
        referenceID ={locationID}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
     
    )
  }
  