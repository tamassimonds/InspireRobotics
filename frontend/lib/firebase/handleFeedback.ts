import {
    db,
    auth
} from '../firebase/initFirebase'
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
    addDoc,
    setDoc
} from "firebase/firestore";



export const dbref = db;



export const getAllEmployeeFeedback = async () => {
    try {
        // Reference to the 'employeeFeedback' collection
        const employeeFeedbackCollectionRef = collection(db, "employeeFeedback");

        // Create a query against the collection
        const q = query(employeeFeedbackCollectionRef);

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Extract the data from each document
        const employeeFeedback = querySnapshot.docs.map(doc => ({
            
            ...doc.data()
        }));

        console.log("Employee Feedback fetched successfully");
        return employeeFeedback; // Returns an array of employee feedback objects
    } catch (error) {
        console.error("Error fetching employee feedback:", error);
        throw error; // Optional: throw the error to handle it in the calling function
    }
};

import {
    getAllProgramClassesSessions,
    groupSessionsIntoShifts

} from '../firebase/library'




export const getAllCustomQuestions = async () => {
    try {
        // Reference to the 'customQuestions' collection
        const customQuestionsCollectionRef = collection(db, "customQuestions");

        // Create a query against the collection
        const q = query(customQuestionsCollectionRef);

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Extract the data from each document
        const customQuestions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Custom Questions fetched successfully");
        return customQuestions; // Returns an array of custom question objects
    } catch (error) {
        console.error("Error fetching custom questions:", error);
        throw error; // Optional: throw the error to handle it in the calling function
    }
};


