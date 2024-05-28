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
      name: 'description',
      label: 'Description',
      type: 'text',
    },
    {
      name: 'link',
      label: 'Link To Buy',
      type: 'text',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    {
      name: 'manufacturedInHouse',
      label: 'Manufactured In House',
      type: 'boolean',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    {
      name: 'finite',
      label: 'Finite',
      type: 'boolean',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    {
      name: 'tool',
      label: 'Tool',
      type: 'boolean',
      props: { placeholder: 'Enter course description', multiline: true },
    },
   
    {
      name: 'cost',
      label: 'Cost',
      type: 'money',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    {
      name: 'imageUrl',
      label: 'Image',
      type: 'image',
      props: { placeholder: 'Enter course description', multiline: true },
    },
   
    // Add more fields as needed for your form
  ];
  const collectionName = "items";

    return (
      <div>
      <h1>Storage Location Registration</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= "/admin/inventory/items"
        referenceID ={locationID}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
     
    )
  }
  