"use client"

import React, { useState, useEffect } from 'react';
import Button from '@mui/joy/Button';
import { addDoc, updateDoc, collection, getDocs, getDoc, query, where, doc,deleteDoc  } from "firebase/firestore";
import { dbref } from '/lib/firebase/library';
import GenericInput from './GenericInput';
import { useRouter } from 'next/navigation';
import Card from '@mui/joy/Card';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';

export default function AbstractForm({ fields, collectionName, canDelete=true, submitBackURL, deleteBackURL, referenceID, handleFormDelete, handleFormSubmit, includeUserData, customIDGenerator, passedFormData  }) {
  const [formData, setFormData] = useState({});
   const router = useRouter(); // useRouter hook for navigation
  const [formErrors, setFormErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector(state => state.user.userData);

  const validateForm = () => {
    const errors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = 'This field is required';
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    console.log("collectionName", collectionName)
    const fetchDocument = async () => {
      console.log('fetching document', referenceID);

      if (collectionName.includes('/')) {
      
        // If collectionName contains '/', it's a path to a specific document
        const [parentCollectionName, documentId] = collectionName.split('/');
        const docRef = doc(dbref, parentCollectionName, documentId);

        // Fetch the document directly
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({ ...docSnap.data(), id: documentId });
        } else {
          console.log('No document found at the given path.');
        }
      } else {
        // Perform a query in the collection
        const q = query(collection(dbref, collectionName), where('id', '==', referenceID));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setFormData({ ...docData, id: referenceID });
        } else {
          console.log('No documents found with the given ID.');
        }
      }

      
    };

    fetchDocument();
  }, [referenceID, collectionName]);
  useEffect(() => {
    if(passedFormData){
      setFormData(passedFormData)
    }
  }, [passedFormData])
  const handleInputChange = (fieldName) => (value) => {
    // Reformats data from drop downs
    console.log("handleInputChange", fieldName, value)
    
    if ((fieldName === 'school' || fieldName === 'course' || fieldName == "program" || fieldName === "handleEquipment")) {
      const updatedData = { ...formData };
      
      if(value){
        // Check and set name and ID if present in the value
        if (value.name) updatedData[`${fieldName}Name`] = value.name;
        if (value.id) updatedData[`${fieldName}ID`] = value.id;
      } else{
        updatedData[`${fieldName}Name`] = "";
        updatedData[`${fieldName}ID`] = "";
      }
      
  
      setFormData(updatedData);
    } else if((fieldName=== "holidayProgramModule") && value ){
      const updatedData = { ...formData };
      if (value.id) updatedData[`${fieldName}ID`] = value.id;
      if (value.course.id) updatedData[`courseID`] = value.course.id;
      if (value.course.name) updatedData[`courseName`] = value.course.name;
      delete updatedData.holidayProgramModule;

      setFormData(updatedData);

    } else {
      // Handle other fields normally
      setFormData({ ...formData, [fieldName]: value });
    }

    
  };

  function removeUndefinedValues(data) {
    // Create a new object to store the filtered data
    const filteredData = {};
  
    // Iterate over each key in the data object
    for (const key in data) {
      // Check if the value is not undefined
      if (data[key] !== undefined) {
        // Add the key-value pair to the filtered data
        filteredData[key] = data[key];
      }
    }
  
    // Return the filtered data object
    return filteredData;
  }

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    formData.lastUpdated = new Date()
    
    if(handleFormSubmit){
      handleFormSubmit(formData, submitBackURL).then(() => {
        setIsLoading(false);
      })
      return;
    }

    if (includeUserData ) {
      try{
        formData.employeeID = userData.id;
        formData.employeeName = userData.name;
      } catch{
        console.error("User data can't be found on form submission")
      }
      
    }
    

    try {
      if (formData.id && !collectionName.includes("/")) {
        const q = query(collection(dbref, collectionName), where("id", "==", formData.id));
        const querySnapshot = await getDocs(q);
        const filteredFormData = removeUndefinedValues(formData);
  
        if (!querySnapshot.empty) {
          const docToUpdate = querySnapshot.docs[0];
          await updateDoc(docToUpdate.ref, filteredFormData);
          console.log("Document updated with ID: ", filteredFormData.id);
        } else {
          console.log("No document found with the given ID to update.");
        }
      } else if (collectionName.includes("/")) {
        // If collectionName contains '/', treat it as a path to a specific document
        const [parentCollectionName, documentId] = collectionName.split('/');
        const docRef = doc(dbref, parentCollectionName, documentId);
        const filteredFormData = removeUndefinedValues(formData);
  
        // Update the document directly
        await updateDoc(docRef, filteredFormData);
        console.log("Document updated at path: ", collectionName);
      }else {
        if(customIDGenerator){
          formData.id = customIDGenerator(filteredFormData);
        } else {
          formData.id = uuidv4();
        }
        
        const docRef = await addDoc(collection(dbref, collectionName), formData);
        console.log("Document created with ID: ", docRef.id);
      }

      // Redirect to the submitBackURL if it is provided
      if (submitBackURL) {
        console.log(submitBackURL)
        router.push(submitBackURL);
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  const handleDelete = async () => {

    //If passed handleDelete run there custom handleDelete else run defualt
    setIsLoading(true);

    if(handleFormDelete){
      handleFormDelete(formData, deleteBackURL).then(() => {
        setIsLoading(false);
      })

      return
    }

    if (!formData.id) {
      console.error("No ID found in formData. Cannot delete the document.");
      return;
    }
  
    try {
      const q = query(collection(dbref, collectionName), where("id", "==", formData.id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const docToDelete = querySnapshot.docs[0];
        await deleteDoc(docToDelete.ref);
        console.log("Document deleted with ID: ", formData.id);
  
        // Optional: Redirect after deletion
        if (deleteBackURL) {
          router.push(deleteBackURL);
        }
      } else {
        console.log("No document found with the given ID to delete.");
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const renderFields = () => {
    
    return fields.map((field, index) => {
      // Determine the key to use in formData
      let formDataKey;
      switch (field.name) {
        case 'course':
          formDataKey = 'courseName';
          break;
        case 'program':
          formDataKey = 'programName';
          break;
        case 'teacher':
          formDataKey = 'teacherName';
          break;
          case 'school':
            formDataKey = 'schoolName';
            break;
        case 'school':
          formDataKey = 'schoolName';
          break;
        case 'handleEquipment':
          formDataKey = 'handleEquipmentName';
          break;
        default:
          formDataKey = field.name;
      }
  
      return (
        <div key={index}>
          <label htmlFor={field.name}>{field.label}</label>
          <GenericInput
            type={field.type}
            value={formData[formDataKey]} // Use the determined key
            valueUpdated={handleInputChange(field.name)}
            {...field.props} // Additional props for the input
          />
          {/* Display an error message if there is an error for this field */}
          {formErrors[field.name] && (
            <p className="error" style={{ color: 'red' }}>{formErrors[field.name]}</p>
          )}
        </div>
      );
    });
  };
  
  return (
    <div>
      <Card>
        {renderFields()}
        
        {isLoading ? <p>Loading...</p> : <Button onClick={handleSubmit}>Submit</Button>}

        {(referenceID && canDelete) && <Button onClick={handleDelete} color="danger">Delete</Button>}
      </Card>
    </div>
  );
};