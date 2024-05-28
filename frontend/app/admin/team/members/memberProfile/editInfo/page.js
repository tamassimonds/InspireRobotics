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
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
   
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,

    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'phone',
  
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },
    {
      name: 'WWCNumber',
      label: 'WWC Number',
      type: 'text',
     
    },
    {
      name: 'universityCourse',
      label: 'University Course',
      type: 'text',
      
    },
    {
      name: 'profileImage',
      label: 'Profile Image',
      type: 'image',
 
    },
   
    {
      name: 'accessToCar',
      label: 'Access To Car',
      type: 'boolean',
     
    },
    {
      name: 'activeTeacher',
      label: 'Is Active Teacher?',
      type: 'boolean',
    },

    {
      name: 'isAdmin',
      label: 'Can access admin website?',
      type: 'boolean',
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
  