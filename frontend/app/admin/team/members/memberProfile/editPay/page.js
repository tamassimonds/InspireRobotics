"use client"

import Card from '@mui/joy/Card';
import React from 'react';


import GenericForm from '/components/form/GenericForm.js'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'


export default function Home() {
  const router = useRouter();  
  const searchParams = useSearchParams();

  const memberID = searchParams.get('memberID');

 

  const formFields = [
    {
      name: 'standardPayRate',
      label: 'Standard Rate',
      type: 'money',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    {
      name: 'rndPayRate',
      label: 'RnD Pay Rate',
      type: 'money',
      props: { placeholder: 'Enter course name' },
    },
    {
      name: 'transportationPayStart',
      label: 'Transportation Pay Start (in num hours)',
      type: 'number',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    
   
   
    // Add more fields as needed for your form
  ];
  const collectionName = "employees";

    return (
      <div>
      <h1>Pay Rate</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= {"/admin/team/members/memberProfile?memberID="+memberID}
        referenceID ={memberID}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
     
    )
  }
  