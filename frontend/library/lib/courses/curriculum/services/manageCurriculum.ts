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
    updateDoc
} from "firebase/firestore";


import { Curriculum, TutorialCurriculum } from "../curriculum";

export const getCourseCurricula = async (courseID: string): Promise<Curriculum[]> => {
    const courseRef = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseRef);

    if (courseQuerySnapshot.empty) {
        throw new Error("Course not found");
    }

    const courseDocRef = courseQuerySnapshot.docs[0].ref;
    const curriculaRef = collection(courseDocRef, "curricula");
    const curriculaSnapshot = await getDocs(curriculaRef);
    const curricula = curriculaSnapshot.docs.map(doc => doc.data() as Curriculum);

    return curricula;
};

function cleanTutorials(tutorials) {
    if (!Array.isArray(tutorials)) {
        return [];
    }
    return tutorials.filter(tutorial => tutorial !== undefined);
}


export const addCourseCurriculum = async (courseID: string, curriculum: Curriculum): Promise<void> => {
    const courseRef = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseRef);

    if (courseQuerySnapshot.empty) {
        throw new Error("Course not found");
    }

    const courseDocRef = courseQuerySnapshot.docs[0].ref;
    const curriculumRef = doc(collection(courseDocRef, "curricula"));
    curriculum.tutorials = cleanTutorials(curriculum.tutorials);

    try {
        await setDoc(curriculumRef, curriculum);
        console.log("Curriculum added successfully to the course");
    } catch (error) {
        console.error("Error adding curriculum: ", error);
        throw new Error("Failed to add curriculum to the course");
    }
};



export const deleteCourseCurriculum = async (courseID: string, curriculumID: string): Promise<void> => {
    const courseRef = query(collection(db, "courses"), where("id", "==", courseID));
    const courseQuerySnapshot = await getDocs(courseRef);

    if (courseQuerySnapshot.empty) {
        throw new Error("Course not found");
    }

    const courseDocRef = courseQuerySnapshot.docs[0].ref;
    const curriculaRef = collection(courseDocRef, "curricula");
    const curriculumQuery = query(curriculaRef, where("id", "==", curriculumID));
    const curriculumQuerySnapshot = await getDocs(curriculumQuery);

    if (curriculumQuerySnapshot.empty) {
        throw new Error("Curriculum not found");
    }

    const curriculumDocRef = curriculumQuerySnapshot.docs[0].ref;

    try {
        await deleteDoc(curriculumDocRef);
        console.log("Curriculum removed successfully from the course");
    } catch (error) {
        console.error("Error removing curriculum: ", error);
        throw new Error("Failed to remove curriculum from the course");
    }
};

export const updateCourseCurriculum = async (courseID: string, curriculumID: string, curriculum: Curriculum): Promise<void> => {
    // Find the course first
    const coursesRef = collection(db, "courses");
    const courseQuery = query(coursesRef, where("id", "==", courseID));
    const courseSnapshot = await getDocs(courseQuery);

    if (courseSnapshot.empty) {
        throw new Error("Course not found");
    }

    // Get the course document reference
    const courseDocRef = courseSnapshot.docs[0].ref;

    // Find the specific curriculum within the course
    const curriculaRef = collection(courseDocRef, "curricula");
    const curriculumQuery = query(curriculaRef, where("id", "==", curriculumID));
    const curriculumSnapshot = await getDocs(curriculumQuery);
    curriculum.tutorials = cleanTutorials(curriculum.tutorials);

    if (curriculumSnapshot.empty) {
        throw new Error("Curriculum not found");
    }

    // Update the found curriculum
    const curriculumDocRef = curriculumSnapshot.docs[0].ref;

    try {
        await updateDoc(curriculumDocRef, curriculum);
        console.log("Curriculum updated successfully in the course");
    } catch (error) {
        console.error("Error updating curriculum:", error);
        throw new Error("Failed to update curriculum in the course");
    }
};