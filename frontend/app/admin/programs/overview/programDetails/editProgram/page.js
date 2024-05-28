"use client"
 
import Card from '@mui/joy/Card';
import React, { useState } from 'react';
import { addDoc, updateDoc, collection, getDocs, query, where, doc,deleteDoc  } from "firebase/firestore";
import { dbref } from '/lib/firebase/library';

import GenericForm from '/components/form/GenericForm.js'
import { useSearchParams } from 'next/navigation'

import {getClassWithProgramID} from "/lib/firebase/library"

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const isHolidayProgram = searchParams.get('isHolidayProgram');
  const programID = searchParams.get('programID');
  const [errorMessage, setErrorMessage] = useState("");

  // Define the fields for the course registration form
  const holidayProgramFields = [
    {
      name: 'name',
      label: 'Program Name',
      type: 'text',
      required: true, 
      props: { placeholder: 'Enter course name' },
    },
    
    {
      name: 'dates',
      label: 'Date',
      type: 'startendtime',
    },
    {
      name: 'locationName',
      label: 'Location Name',
      type: 'text',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    {
      name: 'locationAddress',
      label: 'Location Address',
      type: 'text',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    {
      name: 'maxCapacity',
      label: 'Max Capacity',
      type: 'number',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    {
      name: 'assignedEquipment',
      label: 'Assigned Equipment',
      type: 'handleEquipment',
    },
    {
      name: 'openToPublic',
      label: 'Open to Public',
      type: 'checkbox',
      props: { placeholder: 'Enter course description', multiline: true },
    },


    {
      name: 'otherNotes',
      label: 'Other Notes',
      type: 'text',
      props: { placeholder: 'Enter course description', multiline: true },
    },
   
    // Add more fields as needed for your form
  ];

  const schoolProgramFields = [
    {
      name: 'name',
      label: 'Program Name',
      type: 'text',
      required: true, 
      props: { placeholder: 'Enter course name' },
    },
    
    {
      name: 'school',
      label: 'School',
      type: 'school',
    },
    {
      name: 'course',
      label: 'Course',
      type: 'course',
    },
    
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
    },
    {
      name: 'endOfProgramEvent',
      label: 'End of program Event',
      type: 'boolean',
    },
    {
      name: 'programConfirmed',
      label: 'Program Confirmed',
      type: 'boolean',
    },
    {
      name: 'revenue',
      label: 'Revenue',
      type: 'money',
    },
    {
      name: 'handleEquipment',
      label: 'Assigned Equipment',
      type: 'handleEquipment',
    },
    {
      name: 'yearLevel',
      label: 'Year level',
      type: 'age',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    {
      name: 'numStudents',
      label: 'Num Students',
      type: 'number',
      props: { placeholder: 'Enter course description', multiline: true },
    },
    
    {
      name: 'otherNotes',
      label: 'Other Notes',
      type: 'text',
      props: { placeholder: 'Enter course description', multiline: true },
    },
   
    // Add more fields as needed for your form
  ];
  const collectionName = "programs";

  const handleDelete = async (formData, deleteBackURL) => {
    if (!formData.id) {
      console.error("No ID found in formData. Cannot delete the document.");
      return;
    }
  
    setErrorMessage("");
    try {
      // Check for associated classes
      const associatedClasses = await getClassWithProgramID("23asd2");
      console.log("associatedClasses",associatedClasses)
      if (associatedClasses != null) {
        console.log("Cannot delete this program as it has associated classes.");
        setErrorMessage("Cannot delete this program as it has associated classes.");
        return;
      }
      console.log("associatedClasses",associatedClasses)

      
  
      // Proceed with deletion if no associated classes are found
      const q = query(collection(dbref, collectionName), where("id", "==", formData.id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const docToDelete = querySnapshot.docs[0];
        await deleteDoc(docToDelete.ref);
        console.log("Document deleted with ID: ", formData.id);
  
        // Redirect after deletion
        if (deleteBackURL) {
          router.push(deleteBackURL);
        }
      } else {
        console.log("No document found with the given ID to delete.");
      }
    } catch (error) {
      setErrorMessage("Error deleting document: " + error);
      console.error("Error deleting document: ", error);
    } finally {

    }
  };


    return (
      <div>
      <h1>Edit Program</h1>
      <GenericForm
        fields={!isHolidayProgram ? holidayProgramFields : schoolProgramFields}
        collectionName={collectionName}
        submitBackURL= {"/admin/programs/overview/programDetails?programID=" +programID}
        deleteBackURL = {"/admin/programs/overview"}
        referenceID = {programID}
        handleFormDelete = {handleDelete}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
      <p style={{color:"red"}}>{errorMessage}</p>
    </div>
     
    )
  }
  