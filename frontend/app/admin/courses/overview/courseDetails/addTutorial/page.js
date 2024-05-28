"use client"


import Card from '@mui/joy/Card';
import React, { useEffect, useState } from 'react';


import GenericForm from '/components/form/GenericForm.js'
import { useSearchParams } from 'next/navigation'

import {Tutorial, db_to_tutorial} from "library/lib/courses/tutorials/tutorial"
import {addCourseTutorial, deleteCourseTutorial, updateCourseTutorial} from "library/lib/courses/tutorials/service/handleCourseTutorials.ts"
import { v4 as uuidv4 } from 'uuid'; // Importing uuid function

import { useRouter } from 'next/navigation';

import {getTutorialWithID} from "library/lib/courses/tutorials/service/fetchTutorial.ts"

export default function Home() {
  
  const searchParams = useSearchParams();
  const router = useRouter()
  const id = searchParams.get('id');
  const courseID = searchParams.get('courseID');

  const [tutorialData, setTutorialData] = useState(null);

  const formFields = [
    {
      name: 'title',
      label: 'Tutorial Tittle*',
      type: 'text',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    {
      name: 'link',
      label: 'Tutorial Docs Link*',
      type: 'text',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    // Add more fields as needed for your form
  ];
  const collectionName = "courses/39WJWNDXbjPquqvDfmcY/tutorials";

  useEffect(() => {
    if(id === null) return;
    getTutorialWithID(courseID, id).then((tutorial) => {
      setTutorialData(tutorial)
    });
  }, [id]);


  const handleFormSubmit = async (formData) => {
    if (id) {
      // Update existing tutorial
      try {
        await updateCourseTutorial(courseID, id, formData);
        router.push(`/admin/courses/overview/courseDetails?courseID=${courseID}`);
      } catch (error) {
        console.error("Failed to update tutorial:", error);
      }
    } else {
      // Add new tutorial
      formData.id = uuidv4(); // Assign a unique ID to the form data
      const tutorial = db_to_tutorial(formData); // Convert form data into a tutorial object
      try {
        await addCourseTutorial(courseID, tutorial);
        router.push(`/admin/courses/overview/courseDetails?courseID=${courseID}`);
      } catch (error) {
        console.error("Failed to add tutorial:", error);
      }
    }
  };
  const handleFormDelete = async () => {

    const tutorial = await getTutorialWithID(courseID, id)
    console.log("tutorial", tutorial)
    try {
      await deleteCourseTutorial(courseID, tutorial); // Try adding the tutorial
      // If successful, navigate to the course details page
      router.push(`/admin/courses/overview/courseDetails?courseID=${courseID}`);
  } catch (error) {
      console.error("Failed to add tutorial:", error); // Log the error if the addition fails
      // Optionally, handle the error in UI, such as displaying an error message to the user
  }
  }

    return (
      <div>
      <h1>Add Tutorial</h1>
      <GenericForm
        fields={formFields}
        handleFormSubmit = {handleFormSubmit}
        // handleFormDelete={handleFormDelete}
        passedFormData={tutorialData}
        collectionName={collectionName}
        submitBackURL= {`/admin/courses/overview/courseDetails?courseID=${courseID}`}
        referenceID ={id}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
     
    )
  }
  