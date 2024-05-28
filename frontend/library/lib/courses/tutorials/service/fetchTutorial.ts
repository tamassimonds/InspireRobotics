

import {
    db,
    auth
} from '/lib/firebase/initFirebase'

import {
    collection,
    doc,
    getDocs,
    updateDoc,
    deleteDoc,
    getCountFromServer,
    where,
    query,
    QuerySnapshot,
    getDoc,
    setDoc,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";


import { Tutorial, db_to_tutorial } from "../tutorial";





export const getTutorialWithID = async (courseID: string, tutorialID: string): Promise<Tutorial> => {
    // First, find the course document by courseID
    const courseQuery = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseQuery);

    if (courseQuerySnapshot.empty) {
        throw new Error("Course not found");
    }

    // Assuming the first document found is the course
    const courseDocRef = courseQuerySnapshot.docs[0].ref;

    // Query for the tutorial in the tutorials sub-collection by tutorial ID field
    const tutorialsQuery = query(collection(courseDocRef, "tutorials"), where("id", "==", tutorialID));
    const tutorialsSnapshot = await getDocs(tutorialsQuery);

    if (tutorialsSnapshot.empty) {
        throw new Error("Tutorial not found");
    }

    // Assuming the first document found is the tutorial
    const tutorialData = tutorialsSnapshot.docs[0].data();

    // Convert the tutorial data to a Tutorial type
    const tutorial = db_to_tutorial(tutorialData);

    return tutorial;
};


