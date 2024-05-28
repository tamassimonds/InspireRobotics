"use client"
import { getFirestore, addDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useSearchParams } from 'next/navigation';
import GenericForm from '/components/form/GenericForm.js';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();
  
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const formFields = [
    {
      name: 'codeID',
      label: 'CodeID*',
      type: 'text',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    {
      name: 'amount',
      label: 'Amount*',
      type: 'number',
      required: true,
      props: { placeholder: 'Enter course name' },
    },
    // Add more fields as needed for your form
  ];

  const collectionName = "couponCodes";

  const handleFormSubmit = async (formData) => {
    formData.valid = true
    formData.id = uuidv4();

    console.log('Form submitted with data:', formData);
    const db = getFirestore(); // Assuming db is your Firestore instance
    
    try {
      const couponsRef = collection(db, collectionName);
      const querySnapshot = await getDocs(query(couponsRef, where("id", "==", id)));

      if (!querySnapshot.empty) {
        // Update the first document found with the provided id
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, formData);
        console.log('Document updated successfully');
      } else {
        // No document found with the provided id, adding a new document
        await addDoc(couponsRef, formData);
        console.log('Document added successfully');
      }
      router.push('/admin/privatePrograms/coupons');
    } catch (error) { 
      console.error('Error writing document: ', error);
    }
  }

  return (
    <div>
      <h1>Add Coupon</h1>
      <GenericForm
        fields={formFields}
        collectionName={collectionName}
        handleFormSubmit={handleFormSubmit}
        submitBackURL="/admin/privatePrograms/coupons"
        referenceID={id}
        // Omit documentId if creating a new document
        // documentId="existing-document-id" // Uncomment if updating an existing document
      />
    </div>
  );
}
