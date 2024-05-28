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
      name: 'subject',
      label: 'Subject*',
      type: 'text',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    
    {
      name: 'description',
      label: 'Description',
      type: 'text',
    },
    {
      name: 'anonymous',
      label: 'Anonymous',
      type: 'boolean',
    },
   
   
    // Add more fields as needed for your form
  ];
  const collectionName = "employeeIdeaSuggestion";

    return (
      <div>
      <h1>Idea Suggestion</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        includeUserData={true}
        submitBackURL= "/employee/feedback/ideaSubmit/ideaSubmitComplete"
        referenceID ={locationID}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
     
    )
  }
  