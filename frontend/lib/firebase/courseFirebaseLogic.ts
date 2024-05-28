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




import {
    getAllProgramClassesSessions,
    groupSessionsIntoShifts

} from '../firebase/library'



export const getCourseAndKitDetails = async (courseID) => {
    if (!courseID) {
        throw new Error("Course ID is required");
    }

    // Retrieve course details
    const courseQuery = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseQuery);
    
    // Assuming there will only be one course with a given courseID
    const courseDetails = courseQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];

    if (!courseDetails) {
        throw new Error("No course found with the given ID");
    }

    // Retrieve kit details if a kit exists for this course
    const kitQuery = query(collection(db, "kits"), where("coursesIDs", "array-contains", courseID));
    const kitQuerySnapshot = await getDocs(kitQuery);
    const kitDetails = kitQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Combine course details with kit details (if any)
    const courseAndKitDetails = {
        course: courseDetails,
        kit: kitDetails.length > 0 ? kitDetails[0] : null // Assuming one kit per course
    };

    return courseAndKitDetails;
};

export const getCourseDetailsWithID = async (courseID) => {
    if (!courseID) {
        throw new Error("Course ID is required");
    }

    // Retrieve course details
    const courseQuery = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseQuery);
    
    // Assuming there will only be one course with a given courseID
    const courseDetails = courseQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];

    if (!courseDetails) {
        throw new Error("No course found with the given ID");
    }

    return courseDetails;
};