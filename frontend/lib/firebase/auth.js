import { use } from 'react';
import {
    db,
    auth
} from './initFirebase'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  getCountFromServer,
  where,
  query,
  QuerySnapshot,
  addDoc,
  setDoc,
  Firestore
} from "firebase/firestore";



import { getAuth, signOut , signInWithEmailAndPassword,sendPasswordResetEmail, createUserWithEmailAndPassword   } from "firebase/auth";

import { v4 as uuidv4 } from 'uuid'; // Importing uuid function

export var user = auth.currentUser;
export var userData = null;

export const loginWithEmailAndPassword = async (email, password) => { 
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential); // This should log the userCredential
    return userCredential.user; // Return the user object
  } catch (error) {
    console.error(error.code, error.message); // Log the error
    return null;
  }
};

export const createUser = async (email) => {
  console.log(email)
  try {
    const password = uuidv4()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created:', userCredential.user); // This should log the newly created user object
    resetPassword(email)
    return userCredential.user; // Return the user object
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: true, message: error.message || "An error occurred" };
  }
};

export const createNewEmployee = async (employeeData) => {
  try {
    const employeesRef = collection(db, 'employees');
    const docRef = await addDoc(employeesRef, employeeData);
    console.log("New employee created with ID:", docRef.id);
    return { success: true, id: docRef.id }; // Return success status and the ID
  } catch (error) {
    console.error("Error creating new employee:", error);
    return { success: false, message: error };
  }
};


export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    // Password reset email sent successfully
    return null;
  } catch (error) {
    console.log(error.code, error.message);
    return error.message;
  }
};


export const getUserDetails = async (userID) => {
  const employeesRef = collection(db, 'employees'); // Reference to the employees collection
  const q = query(employeesRef, where('UID', 'array-contains', userID)); // Query to find the employee with the given UID in the UID array

  try {
    const querySnapshot = await getDocs(q);
    let employeeData = null;

    querySnapshot.forEach((doc) => {
      // Assuming there's only one employee with this UID in the array
      employeeData = doc.data();
    });
    userData = employeeData;
    
    console.log("userData",userData)
  } catch (error) {
    console.error("Error fetching employee data:", error);
    userData = null;
  }
  return userData
};

export const validateEmployeeAuth = async () => {
  const user = auth.currentUser;
  
  // Check if we're running on localhost
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  
  if (user) {
    console.log(user);
    
    return user;
  } else if (isLocalhost) {
    // Only auto-login if on localhost
    console.log("Attempting auto-login for testing purposes...");

    // You should replace these credentials with variables or environment-specific checks
    // to ensure they are not exposed in your production code.
    const loginDetails = await loginWithEmailAndPassword("tamassimonds@inspirerobotics.com.au", "inspirerobotics299792458");
    return validateEmployeeAuth();
  } else {
    // No user is signed in.
    console.log("No user is signed in");
    return null;
  }
}

export const validateAdminAuth = async () => {
  const user = auth.currentUser;
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  if (user) {
    console.log(user)
    const userDetails = await getUserDetails(user.uid)
    console.log("userDetails", userDetails)
    if(userDetails.isAdmin){
      console.log("IS ADMIN")
      return user
    } else{
      return null
    }
  } else if (isLocalhost) {
    // Only auto-login if on localhost
    console.log("Attempting auto-login for testing purposes...");

    // You should replace these credentials with variables or environment-specific checks
    // to ensure they are not exposed in your production code.
    const loginDetails = await loginWithEmailAndPassword("tamassimonds@inspirerobotics.com.au", "inspirerobotics299792458");
    return validateEmployeeAuth();
  }
  else {
    // No user is signed in.

    //THIS IS JUST FOR TESTING
    //!!!
    
    
    console.log("No user is signed in")
    return null
  }
}


export const handleSignOut = async () => {
  try {
      await signOut(auth);
      console.log('User signed out successfully');
      // Additional logic after signing out, like redirecting to a login page
      // or resetting user-related state in your application
  } catch (error) {
      console.error('Error signing out:', error);
      // Handle any errors that occur during sign out
  }
};