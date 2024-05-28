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
    where
} from "firebase/firestore";

import { Curriculum, TutorialCurriculum } from "../curriculum";

export const getCurriculumWithID = async (courseID: string, curriculumID: string): Promise<Curriculum> => {
    // Query for the course to ensure it exists
    const courseRef = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseRef);

    if (courseQuerySnapshot.empty) {
        throw new Error("Course not found");
    }

    // Get the reference to the specific course document
    const courseDocRef = courseQuerySnapshot.docs[0].ref;

    // Query for the specific curriculum by its ID within the curricula subcollection
    const curriculaRef = collection(courseDocRef, "curricula");
    const curriculumQuery = query(curriculaRef, where("id", "==", curriculumID));
    const curriculumQuerySnapshot = await getDocs(curriculumQuery);

    if (curriculumQuerySnapshot.empty) {
        throw new Error("Curriculum not found");
    }

    // Assuming there is only one curriculum with this ID
    const curriculumData = curriculumQuerySnapshot.docs[0].data() as Curriculum;

    return curriculumData;
};