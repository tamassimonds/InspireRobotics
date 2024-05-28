"use client"
import React, { useState, useEffect } from 'react';
import Card from '@mui/joy/Card';
import TextInput from "/components/inputs/TextInput.js";
import ImageInput from "/components/inputs/imageInput.js";
import Button from '@mui/joy/Button';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid function

import {addDoc, collection,doc, updateDoc,  query, where, getDocs  } from "firebase/firestore";

import {uploadImage, dbref} from '/lib/firebase/library';

import {useRouter} from 'next/navigation';
import { useSearchParams } from 'next/navigation'

import {getCourseDetailsWithID} from '/lib/firebase/courseFirebaseLogic'

export default function Home() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [iconImage, setIconImage] = useState(""); // This will be a File object
  const [largeImage, setLargeImage] = useState(""); // This will be a File object
  const [isLoading, setIsLoading] = useState(false); // Used to disable the submit button while saving
  // Initial courseData state
  const initialCourseDataState = {
    name: '',
    id: '', // This will be set when fetching data or creating a new course
    shortDescription: '', // Optional
    longDescription: '', // Optional
    notionLink: '', // Optional
    iconImageURL: '', // Optional
    largeImageURL: '', // Optional
  };

  const [courseData, setCourseData] = useState(initialCourseDataState);
  
  // Fetching courseID from URL search params
  const searchParams = useSearchParams();
  const courseID = searchParams.get('courseID');

  useEffect(() => {
    console.log(courseID);
    if (courseID) {
      // If there is a courseID, fetch the course data
      getCourseData();
    } else {
      // If there is no courseID, we are creating a new course, so set a new id
      setCourseData({ ...initialCourseDataState, id: uuidv4() });
    }
  }, [courseID]);

  const getCourseData = async () => {
    try {
      const data = await getCourseDetailsWithID(courseID);
      setCourseData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
      setErrorMessage("Failed to fetch course data.");
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(""); // Clear previous error message
    // Assume validation is complete here
    if (!courseData.name.trim()) {
      setErrorMessage("Course Name is required.");
      return;
    }
    if(isLoading){
      return
    }
    setIsLoading(true);
    
    try {
      let iconImageUrl = courseData.iconImageURL;
      let largeImageUrl = courseData.largeImageURL;

      // Upload icon image if a new one was provided
      if (iconImage) {
        iconImageUrl = await uploadImage(iconImage, `courses/images/${courseData.id}/icon`);
      }

      // Upload large image if a new one was provided
      if (largeImage) {
        largeImageUrl = await uploadImage(largeImage, `courses/images/${courseData.id}/large`);
      }
      console.log("GOT TO HERE: ");
      // Prepare the data to be saved in Firestore
      const dataToSave = {
        ...courseData,
        iconImageURL: iconImageUrl,
        largeImageURL: largeImageUrl,
      };

      if (courseID) {
        // Update the existing course document
        console.log(dataToSave)
        await updateCourseByCourseID(courseID, dataToSave);
        
        console.log("Document updated with ID: ", courseID);
      } else {
        // Add a new course document
        const docRef = await addDoc(collection(dbref, "courses"), dataToSave);
        console.log("Document written with ID: ", docRef.id);
      }

      // Navigate to the course overview page after successful operation
      router.push('/admin/courses/overview');

    } catch (error) {
      console.log("Error adding or updating document: ", error);
      setErrorMessage("Failed to submit course. Please try again.");
    }
  };
  const renderIconImage = () => {
    if (courseData.iconImageURL) {
      return <img src={courseData.iconImageURL} alt="Course Icon" style={{ maxWidth: '100px' }} />;
    }
    return null; // If no image URL, don't render anything
  };
  
  const updateCourseByCourseID = async (courseID, dataToSave) => {
    if (!courseID) {
      throw new Error("Course ID is required");
    }
  
    // Define the collection reference
    const coursesRef = collection(dbref, "courses");
  
    // Create a query to find the document with the matching courseID
    const q = query(coursesRef, where("id", "==", courseID));
  
    // Execute the query
    const querySnapshot = await getDocs(q);
  
    // Check if the document exists
    if (querySnapshot.empty) {
      throw new Error("No document found with the provided course ID");
    }
  
    // Assuming only one document will match the courseID
    const docRef = querySnapshot.docs[0].ref;
  
    // Update the document
    await updateDoc(docRef, dataToSave);
    console.log("Document updated with course ID: ", courseID);
  };

  const handleInputChange = (field) => (value) => {
    setCourseData({ ...courseData, [field]: value });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card>
        <label htmlFor="courseName">Course Name</label>
        <TextInput value={courseData.name} valueUpdated={handleInputChange('name')} />

   
        <div style={{ marginBottom: '8px' }}> {/* Adjust margin as needed */}
          <label htmlFor="courseDescription">Course Website Short Description (optional)</label>
          <p style={{ fontSize: 'small', color: 'gray', marginTop: '4px' }}>Used under Course Names for short description</p>
          <TextInput value={courseData.shortDescription} valueUpdated={handleInputChange('shortDescription')} />
        </div>

        <div style={{ marginBottom: '8px' }}> {/* Adjust margin as needed */}
          <label htmlFor="courseDescription">Course Website Long Description (optional)</label>
          <p style={{ fontSize: 'small', color: 'gray', marginTop: '4px' }}>Use in holiday program for more detail overview</p>
          <TextInput value={courseData.longDescription} valueUpdated={handleInputChange('longDescription')} />
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          {renderIconImage()}
          <label htmlFor="courseIcon">Course Icon (optional)</label>
          <ImageInput valueUpdated={(value) => setIconImage(value)} />
        </div>
        <label htmlFor="courseIcon">Course Icon (optional)</label>
        <ImageInput  valueUpdated={(value)=>setIconImage(value)} />

        <label htmlFor="courseIcon">Course Large Image (optional)</label>
        <ImageInput valueUpdated={(value)=>setLargeImage(value)} />

        <label htmlFor="courseNotionLink">Course Notion Link (optional)</label>
        <TextInput value={courseData.notionLink} valueUpdated={handleInputChange('notionLink')} />
        

        <Button onClick={handleSubmit}>{isLoading ? "loading" :"Add Course"}</Button>
      </Card>
    </div>
  );
}