"use client"

import Card from '@mui/joy/Card';
import React from 'react';


import GenericForm from '/components/form/GenericForm.js'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  
  const [formID, setFormID] = React.useState(''); // This will be a number

  const searchParams = useSearchParams();

  const generateSixLetterID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

  React.useEffect(() => {
    setFormID(generateSixLetterID());
  }, []);

  const locationID = searchParams.get('id');

  const formFields = [
    {
      name: 'kit',
      label: 'Kit',
      type: 'kit',
      props: { placeholder: 'Enter course name' },
    },
   
    
    {
      name: 'unitOwner',
      label: 'Owner',
      type: 'unitOwner',
    },
    
    {
      name: 'program',
      label: 'Program Assigned',
      type: 'programs',
      props: { placeholder: 'Enter course description', multiline: true },
    },
   
    // Add more fields as needed for your form
  ];

  const customIDGenerator = () => {
    return formID
  }

  const collectionName = "units";

    return (
      <div>
      <h1>Kit Input</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= "/admin/inventory/units"
        referenceID ={locationID}
        customIDGenerator = {customIDGenerator}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
      <h1>ID: {formID}</h1>
    </div>
     
    )
  }
  