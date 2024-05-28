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
      label: 'Item Name*',
      type: 'text',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    
    {
      name: 'address',
      label: 'Address',
      type: 'text',
    },
  
    {
      name: 'primary',
      label: 'Primary',
      type: 'boolean',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    {
      name: 'public',
      label: 'Public',
      type: 'boolean',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    {
      name: 'secondary',
      label: 'Secondary',
      type: 'boolean',
      props: { placeholder: 'Enter course description', multiline: true },
    },
   
   
    // Add more fields as needed for your form
  ];
  const collectionName = "schools";

    return (
      <div>
      <h1>Add School</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= "/admin/schools/overview"
        referenceID ={locationID}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
     
    )
  }
  