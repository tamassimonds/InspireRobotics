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
    getDoc
} from "firebase/firestore";



export const dbref = db;


export const getAllHolidayPrograms = async () => {
    const holidayPrograms = [];
    const programCollectionRef = collection(db, "programs");
    const programQuerySnapshot = await getDocs(query(programCollectionRef, where("isHolidayProgram", "==", true)));

    for (const programDoc of programQuerySnapshot.docs) {
        const programData = programDoc.data();
      
        // Fetch enrolled parents and students
        const parentData = await fetchPeopleData(programData.enrolledParents, "parents");
        const studentData = await fetchPeopleData(programData.enrolledStudents, "students");

        holidayPrograms.push({
            ...programData,
            enrolledParents: parentData,
            enrolledStudents: studentData
        });
    }

    return holidayPrograms;
};

export const getHolidayProgramById = async (programId) => {
    if (!programId) {
        throw new Error("Program ID is required");
    }

    // Fetch the program
    const programCollectionRef = collection(db, "programs");
    const programQuery = query(programCollectionRef, where("id", "==", programId), where("isHolidayProgram", "==", true));
    const programQuerySnapshot = await getDocs(programQuery);

    if (programQuerySnapshot.empty) {
        throw new Error("Holiday program not found");
    }

    const programDoc = programQuerySnapshot.docs[0];
    const programData = programDoc.data();

    // Fetch enrolled parents and students
    const parentData = await fetchPeopleData(programData.enrolledParents, "parents");
    const studentData = await fetchPeopleData(programData.enrolledStudents, "students");

    // Fetch holiday program modulep
    const holidayProgramModuleRef = collection(db, "holidayProgramModules");
    const moduleQuery = query(holidayProgramModuleRef, where("id", "==", programData.holidayProgramModuleID));
    const moduleQuerySnapshot = await getDocs(moduleQuery);

    // if (moduleQuerySnapshot.empty) {
    //     throw new Error("Holiday program module not found");
    // }

    if(moduleQuerySnapshot.empty){
        return {
            ...programData,
            enrolledParents: parentData,
            enrolledStudents: studentData,
            holidayProgramModule: {}
        };
    }

    const moduleDoc = moduleQuerySnapshot.docs[0];
    const moduleData = moduleDoc.data();

    return {
        ...programData,
        enrolledParents: parentData,
        enrolledStudents: studentData,
        holidayProgramModule: moduleData
    };
};

const fetchPeopleData = async (ids, collectionName) => {
    const peopleData = [];

    if (!ids){
        return [];
    }

    for (const id of ids) {
        const peopleCollectionRef = collection(db, collectionName);
        const peopleQuerySnapshot = await getDocs(query(peopleCollectionRef, where("id", "==", id)));

        peopleQuerySnapshot.forEach((doc) => {
            peopleData.push(doc.data());
        });
    }

    return peopleData;
};