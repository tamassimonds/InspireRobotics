import {
    db,
    auth
} from '/lib/firebase/initFirebase';

import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    where,
    Timestamp,
    updateDoc
} from "firebase/firestore";

import { FeedbackTicket, db_to_feedback } from "../feedback";

// Function to get all feedback tickets that are marked as "to be completed" and are newer than the cutoff date
export const getAllFeedbackTicketsToBeCompletedForStaff = async (teacherID: string, cutOffDateTimestamp: number): Promise<FeedbackTicket[]> => {
    console.log(teacherID)
    const feedbackQuery = query(
        collection(db, "employeeFeedback"),
        where("teacherID", "==", teacherID),
        where("feedbackStatus", "==", "pending"),
        
       
        
    );
    
    const feedbackQuerySnapshot = await getDocs(feedbackQuery);
    const feedbackTickets: FeedbackTicket[] = [];
    
    feedbackQuerySnapshot.forEach(doc => {
        const feedbackData = doc.data();
        console.log("feedbackData", feedbackData)
        // Assuming db_to_feedback is a function to convert Firestore document data to FeedbackTicket object
        const feedbackTicket = db_to_feedback(feedbackData);
        feedbackTickets.push(feedbackTicket);
    });

    return feedbackTickets;
}


export const getFeedbackTicketWithID = async (feedbackID: string): Promise<FeedbackTicket> => {
    const feedbackQuery = query(collection(db, "employeeFeedback"), where("id", "==", feedbackID));
    const feedbackQuerySnapshot = await getDocs(feedbackQuery);

    if (feedbackQuerySnapshot.empty) {
        throw new Error("Feedback ticket not found");
    }

    const feedbackData = feedbackQuerySnapshot.docs[0].data();
    const feedbackTicket = db_to_feedback(feedbackData);

    return feedbackTicket;
}



export const writeResponseToTicket = async (feedbackID: string, response: any): Promise<void> => {
    console.log("feedbackID", feedbackID);
    const feedbackQuery = query(collection(db, "employeeFeedback"), where("id", "==", feedbackID));
    const feedbackQuerySnapshot = await getDocs(feedbackQuery);

    if (feedbackQuerySnapshot.empty) {
        throw new Error("Feedback ticket not found");
    }

    // Assuming there's only one document for each unique feedback ID
    const feedbackDocRef = feedbackQuerySnapshot.docs[0].ref;

    // Prepare the response document reference in the "responses" subcollection
    const responseCollectionRef = collection(feedbackDocRef, "responses");
    const responseDocRef = doc(responseCollectionRef);

    // Write the response to the "responses" subcollection
    await setDoc(responseDocRef, {
        ...response,
        createdAt: new Date()  // Capture the creation date of the response
    });

    // Update the feedback ticket status to 'complete'
    await updateDoc(feedbackDocRef, {
        feedbackStatus: 'complete',
        lastUpdated: new Date() // Optionally, update the last updated date
    });

    console.log(`Response written and feedback ticket status updated to complete for ID: ${feedbackID}`);
};