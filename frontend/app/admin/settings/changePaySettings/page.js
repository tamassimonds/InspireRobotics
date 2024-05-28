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
      name: 'timeInMinutesAddedToEachShift',
      label: 'Time in Minutes Added Before Each Shift',
      type: 'number',
      required: true,
    },
    {
      name: 'defaultStandardPay',
      label: 'Default Standard Pay',
      type: 'number',
      required: true,
    },
    {
      name: 'defaultRNDRate',
      label: 'Default RND Pay',
      type: 'number',
      required: true,
    },
    {
      name: 'defaultTransportationPayStartHours',
      label: 'Default Transport Pay Start Hours',
      type: 'number',
      required: true,
    },
    
    
    
   
    // Add more fields as needed for your form
  ];
  const collectionName = "configurations/paySettings";

    return (
      <div>
      <h1>Storage Location Registration</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= "/admin/settings"
        referenceID ={locationID}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
     
    )
  }
  