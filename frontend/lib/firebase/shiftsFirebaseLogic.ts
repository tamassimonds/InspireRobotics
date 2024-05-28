import {
    db,
    auth
} from './initFirebase'
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
    setDoc,
    addDoc,
    getDoc
} from "firebase/firestore";


import {
    getAllTeachers
} from './library'
import { removeEmojis } from '../../library/utils/strings/parseEmoji';
export const dbref = db;


export async function getEmployeeIdByName(employeeName) {
    const employeesRef = collection(db, "employees");
    const q = query(employeesRef, where("name", "==", employeeName));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log('No matching employee found.');
            return null;
        }

        // Assuming there is only one employee with this name.
        // If there could be multiple, you would need to modify this logic.
        const employeeDoc = querySnapshot.docs[0];
        return employeeDoc.id;
    } catch (error) {
        console.error("Error fetching employee: ", error);
        return null;
    }
}


export async function updateSessionTeachers(sessionID, teacherNames) {
    const sessionsRef = collection(db, "sessions");
    const sessionsQuery = query(sessionsRef, where("sessionID", "==", sessionID));

    // Step 1: Find the session document with the matching sessionID.
    const querySnapshot = await getDocs(sessionsQuery);
    if (querySnapshot.empty) {
        console.log('No matching session found.');
        return;
    }

    // Assuming that there is only one session with this sessionID.
    const sessionDoc = querySnapshot.docs[0];

    // Step 2: Get teacher IDs for the given teacher names, maintaining order.
    const teacherIdsPromises = teacherNames.map(teacherName => {
        const name = removeEmojis(teacherName)
        console.log("name", name)
        if (name && name !== "---" && name !== "None") {
            const teacherQuery = query(collection(db, "employees"), where("name", "==", name));
            return getDocs(teacherQuery).then(teacherQuerySnapshot => {
                if (!teacherQuerySnapshot.empty) {
                    // Accessing the 'id' field from the document's data
                    return teacherQuerySnapshot.docs[0].data().id;
                }
                return "None"; // If teacher is not found, return "None".
            });
        }
        return Promise.resolve("None"); // If the name is empty or a placeholder, return "None".
    });

    const teacherIds = await Promise.all(teacherIdsPromises);

    // Update the session document with new teacher names and IDs.
    try {
        await updateDoc(sessionDoc.ref, {
            teacherNames: teacherNames.map(name => name || "None"), // Replace empty or undefined names with "None"
            teacherIDs: teacherIds, // This array now contains the ordered teacher IDs or "None"
            teachersToBeNotified: teacherIds
        });
        console.log('Session teachers updated successfully.', sessionID);
    } catch (error) {
        console.error("Error updating session teachers: ", error);
    }
}


const checkIfCarAssignedToShift = (shift, teachers)=> {
    // Check if a car is assigned to this shift
    let carAssigned = false
    console.log("teachers", teachers)
    shift.forEach((session) => {
        console.log("Checking for warnings on", session)
        const teacherIDs = session.teacherIDs
        teacherIDs.forEach((teacherID) => {
            const teacher = teachers.find((teacher) => teacher.id === teacherID)
            console.log("Checking for warnings on teacher", teacher)
            if(!teacher){return null}
            if(teacher.accessToCar){
                carAssigned = true
            }
        })
    })

    if(carAssigned){
        return true
    } else{
        return false
    }
}
let teachers = null

export const checkForShiftWarnings = async  (shift) => {
    if(!teachers){
        teachers = await getAllTeachers()
    }

    let warnings = []

    const carError = checkIfCarAssignedToShift(shift, teachers)
    if(!carError){
        warnings.push("No car assigned to this shift")
    }
    
    const warningMessage = warnings.join("\n")
    return warningMessage

}
