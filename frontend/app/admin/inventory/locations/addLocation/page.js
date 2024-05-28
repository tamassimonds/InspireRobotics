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
      label: 'Location Name',
      type: 'text',
      props: { placeholder: 'Enter course name' },
    },
    
    {
      name: 'address',
      label: 'Address: include full address, city, state, country',
      type: 'text',
    },
    {
      name: 'locationAccessInfo',
      label: 'Access Info: e.g locker code, bay number etc',
      type: 'text',
    },
 
   
    // Add more fields as needed for your form
  ];
  const collectionName = "inventoryLocations";

    return (
      <div>
      <h1>Storage Location Registration</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= "/admin/inventory/locations"
        referenceID ={locationID}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
     
    )
  }
  