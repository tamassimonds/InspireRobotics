"use client"

import Card from '@mui/joy/Card';
import React from 'react';
import { useEffect,useState } from 'react';

import { addDoc, updateDoc, collection, getDocs, query, where, doc,deleteDoc  } from "firebase/firestore";
import { dbref } from '/lib/firebase/library';
import GenericForm from '/components/form/GenericForm.js'
import { useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {useRouter} from "next/navigation"

import {getFeedbackTicketWithID, writeResponseToTicket} from "/library/lib/feedback/services/fetchTickets"



export default function Home() {
  const userData = useSelector(state => state.user.userData);
  const router = useRouter()
  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    const fetchFeedbackTicket = async () => {
      getFeedbackTicketWithID(id).then((feedbackTicket) => {
        console.log("feedbackTicket", feedbackTicket);  
        const questions = feedbackTicket.questions;
        const fields = []
        for (let i = 0; i < questions.length; i++) {
          fields.push({
            name: feedbackTicket.questions[i],
            label: feedbackTicket.questions[i],
            type: feedbackTicket.inputTypes[i],
            required: true,
            props: { placeholder: 'Enter course name' },
          
          })
        }
        console.log(fields)
        setFormFields(fields);

      });
   
    };
    fetchFeedbackTicket();
  }, [id]);
  
  

  const handleSubmit = async (formData) => {
    console.log("Form Data", formData);

    // Fetch the current feedback ticket to get valid questions
    const feedbackTicket = await getFeedbackTicketWithID(id);

    // Filter formData to include only fields that are listed in the feedbackTicket's questions
    const filteredFormData = Object.keys(formData)
      .filter(key => feedbackTicket.questions.includes(key))
      .reduce((obj, key) => {
        obj[key] = formData[key];
        return obj;
      }, {});

    console.log("Filtered Form Data", filteredFormData);
    
      
    await writeResponseToTicket(id, filteredFormData);

    router.push("./giveFeedback/complete")
  };

  const collectionName = "employeeFeedback";

    return (
      <div>
      <Card>
      <h1>Shift Feedback</h1>
    
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        submitBackURL= "./giveFeedback/complete"
        referenceID ={id}
        handleFormSubmit={handleSubmit}
        canDelete={false}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
      <p>Please report immediate Issues to Ben or Toby</p>
      </Card>
    </div>
     
    )
  }
  