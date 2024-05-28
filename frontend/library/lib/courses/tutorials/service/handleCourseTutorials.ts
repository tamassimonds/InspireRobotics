


import {
    db,
    auth
} from '/lib/firebase/initFirebase'


import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    QuerySnapshot,
} from "firebase/firestore";


import { Tutorial, db_to_tutorial } from "../tutorial";


export const getCourseTutorials = async (courseID: string): Promise<Tutorial[]> => {
    const courseRef = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseRef);

    if (courseQuerySnapshot.empty) {
        throw new Error("Course not found");
    }

    // Assuming we use the first matching document as the course document
    const courseDocRef = courseQuerySnapshot.docs[0].ref;
    const tutorialsRef = collection(courseDocRef, "tutorials");
    const tutorialsSnapshot = await getDocs(tutorialsRef);
    const tutorials = tutorialsSnapshot.docs.map(doc => db_to_tutorial(doc.data()));

    return tutorials;
};

export const addCourseTutorial = async (courseID: string, tutorial: Tutorial): Promise<void> => {
    const courseRef = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseRef);

    if (courseQuerySnapshot.empty) {
        throw new Error("Course not found");
    }

    const courseDocRef = courseQuerySnapshot.docs[0].ref;
    const tutorialRef = doc(collection(courseDocRef, "tutorials"));

    try {
        await setDoc(tutorialRef, tutorial);
        console.log("Tutorial added successfully to the course");
    } catch (error) {
        console.error("Error adding tutorial: ", error);
        throw new Error("Failed to add tutorial to the course");    
    }
};


export const deleteCourseTutorial = async (courseID: string, tutorial: Tutorial): Promise<void> => {
    // Reference to the course collection and query for the specific course by ID
    const courseRef = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseRef);

    if (courseQuerySnapshot.empty) {
        throw new Error("Course not found");
    }


    // Get the reference to the specific course document
    const courseDocRef = courseQuerySnapshot.docs[0].ref;

    // Query for the specific tutorial by its ID field within the tutorials subcollection
    const tutorialsRef = collection(courseDocRef, "tutorials");
    const tutorialQuery = query(tutorialsRef, where("id", "==", tutorial.id));
    const tutorialQuerySnapshot = await getDocs(tutorialQuery);

    if (tutorialQuerySnapshot.empty) {
        throw new Error("Tutorial not found");
    }

    // Get the reference to the specific tutorial document
    const tutorialDocRef = tutorialQuerySnapshot.docs[0].ref;

    try {
        // Delete the tutorial document
        await deleteDoc(tutorialDocRef);
        console.log("Tutorial removed successfully from the course");
    } catch (error) {
        console.error("Error removing tutorial: ", error);
        throw new Error("Failed to remove tutorial from the course");
    }
};

export const updateCourseTutorial = async (courseID: string, tutorialID: string, updateData: Partial<Tutorial>): Promise<void> => {
    // Reference to the course collection and query for the specific course by ID
    const courseRef = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseRef);

    if (courseQuerySnapshot.empty) {
        throw new Error("Course not found");
    }

    // Get the reference to the specific course document
    const courseDocRef = courseQuerySnapshot.docs[0].ref;

    // Query for the specific tutorial by its ID field within the tutorials subcollection
    const tutorialsRef = collection(courseDocRef, "tutorials");
    const tutorialQuery = query(tutorialsRef, where("id", "==", tutorialID));
    const tutorialQuerySnapshot = await getDocs(tutorialQuery);

    if (tutorialQuerySnapshot.empty) {
        throw new Error("Tutorial not found");
    }

    // Get the reference to the specific tutorial document
    const tutorialDocRef = tutorialQuerySnapshot.docs[0].ref;

    try {
        // Update the tutorial document
        await updateDoc(tutorialDocRef, updateData);
        console.log("Tutorial updated successfully in the course");
    } catch (error) {
        console.error("Error updating tutorial: ", error);
        throw new Error("Failed to update tutorial in the course");
    }
};
