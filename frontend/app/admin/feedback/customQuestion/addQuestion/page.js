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
      name: 'label',
      label: 'Label(shorthand for question e.g improvements, discussion, otherNotes)',
      type: 'text',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    {
      name: 'question',
      label: 'Question*',
      type: 'text',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    
    {
      name: 'program',
      label: 'Programs',
      type: 'programs',
    },
    {
      name: 'course',
      label: 'Course',
      type: 'course',
    },
    {
      name: 'deactive',
      label: 'deactive',
      type: 'boolean',
    },
    
   
    // Add more fields as needed for your form
  ];
  const collectionName = "customQuestions";

    return (
      <div>
      <h1>Custom Question</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= "../customQuestion"
        deleteBackURL = "../customQuestion"
        referenceID ={locationID}
        
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
     
    )
  }
  