"use client"

import Card from '@mui/joy/Card';
import React from 'react';

import { addDoc, updateDoc, collection, getDocs, query, where, doc,deleteDoc  } from "firebase/firestore";
import { dbref } from '/lib/firebase/library';
import GenericForm from '/components/form/GenericForm.js'
import { useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {useRouter} from "next/navigation"

export default function Home() {
  const userData = useSelector(state => state.user.userData);
  const router = useRouter()

  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const formFields = [
    {
      name: 'type',
      label: 'Type',
      type: 'ticketReason',
      required: true,
      props: { placeholder: 'Enter course name' },
    },

    
    
    {
      name: 'subject',
      label: 'Subject',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      
    },
    {
      name: 'dateOccurred',
      label: 'Date Occurred',
      type: 'date',
      required: true,
    },
    {
      name: 'numMinutes',
      label: 'Num Minutes Added',
      type: 'number',
      required: true,
    },
   
    // Add more fields as needed for your form
  ];

  const handleSubmit = async (formData, submitBackURL) => {

    formData = {...formData, employeeID: userData.id, employeeName: userData.name, status:"pending", dateSubmitted: new Date(), dateResolved: null}
      console.log(formData)
      
    if (formData.id) {
      const q = query(collection(dbref, collectionName), where("id", "==", formData.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docToUpdate = querySnapshot.docs[0];
        await updateDoc(docToUpdate.ref, formData);
        console.log("Document updated with ID: ", formData.id);
      } else {
        console.log("No document found with the given ID to update.");
      }
    } else {
      formData.id = uuidv4();
      const docRef = await addDoc(collection(dbref, collectionName), formData);
      console.log("Document created with ID: ", docRef.id);
    }

    // Redirect to the submitBackURL if it is provided
    if (submitBackURL) {
      router.push(submitBackURL);
    }
 
};

  const collectionName = "tickets";

    return (
      <div>
      <h1>Ticket Submit</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= "/employee/shifts/tickets"
        deleteBackURL = "/employee/shifts/tickets"
        referenceID ={id}
        handleFormSubmit={handleSubmit}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
      <p>Please note tickets have to be approved so may take a few days to be processed</p>
    </div>
     
    )
  }
  