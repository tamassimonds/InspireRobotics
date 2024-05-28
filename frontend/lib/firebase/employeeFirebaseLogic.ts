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
    setDoc,
    Firestore
} from "firebase/firestore";



export const dbref = db;




import {
    getAllProgramClassesSessions,
    groupSessionsIntoShifts

} from '../firebase/library'



export const getEmployeeWithID = async (id) => {
    if (id == undefined) {
        return NaN
    }
    var school = []
    const querySnapshot = await getDocs(query(collection(db, "employees"), where("id", "==", id)));
    querySnapshot.forEach((doc) => {

        school.push(doc.data())
        school[0]["docID"] = doc.id
    });
    if(school.length == 0){
        return NaN
    }
    return school[0]
}


export const getProgramsTeacherAssigned = async (teacherID) => {
    const sessionsRef = collection(db, "sessions");
    const programsRef = collection(db, "programs");
    const classesRef = collection(db, "classes");

    const programIds = new Set();

    const sessionsSnapshot = await getDocs(sessionsRef);
    sessionsSnapshot.forEach((doc) => {
        const session = doc.data();
        if (session.teacherIDs.includes(teacherID)) {
            programIds.add(session.classID);
        }
    });

    const programs = [];

    for (let classId of programIds) {
        const classSnapshot = await getDocs(query(classesRef, where("classID", "==", classId)));

        for (let classDoc of classSnapshot.docs) {
            const classData = classDoc.data();
            const programId = classData.programID;

            const programAlreadyAdded = programs.some(p => p.id === programId);
            if (!programAlreadyAdded) {
                const programSnapshot = await getDocs(query(programsRef, where("id", "==", programId)));
                programSnapshot.forEach((programDoc) => {
                    programs.push(programDoc.data());
                });
            }
        }
    }
    console.log("programs", programs);
    return programs;
};


export const updateEmployeeAvailability = async (employeeID, newAvailability) => {
    // References to the necessary collections and documents
    const availabilityRef = collection(db, "availability");
    const employeeDocRef = doc(availabilityRef, employeeID);
    const weeklyRef = collection(employeeDocRef, "weekly");

    try {
        // First, delete all existing documents in the 'weekly' sub-collection
        const querySnapshot = await getDocs(weeklyRef);
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        // Then, add each new availability entry to the 'weekly' sub-collection
        for (let entry of newAvailability) {
            await setDoc(doc(weeklyRef), entry);
        }
        console.log(`Availability for employee ${employeeID} updated successfully.`);
    } catch (error) {
        console.error("Error updating availability: ", error);
    }
};

export const getEmployeeAvailabilityAndExceptions = async (employeeID) => {
    // Reference to the 'availability' collection
    const availabilityRef = collection(db, "availability");

    // Reference to the specific document for the employee
    const employeeDocRef = doc(availabilityRef, employeeID);

    // References to 'weekly' and 'exceptions' sub-collections
    const weeklyRef = collection(employeeDocRef, "weekly");
    const exceptionsRef = collection(employeeDocRef, "exceptions");

    let availabilityData = {
        weekly: [],
        exceptions: []
    };


    // Fetch weekly availability
    const weeklySnapshot = await getDocs(weeklyRef);
    weeklySnapshot.forEach((doc) => {
        availabilityData.weekly.push({ id: doc.id, ...doc.data() });
    });

    // Fetch exceptions
    const exceptionsSnapshot = await getDocs(exceptionsRef);
    exceptionsSnapshot.forEach((doc) => {
        availabilityData.exceptions.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Availability and exceptions for employee ${employeeID} fetched successfully.`);
    return availabilityData;

   
};

export const updateEmployeeExceptions = async (employeeID, newExceptions) => {
    // References to the necessary collection and document
    const availabilityRef = collection(db, "availability");
    const employeeDocRef = doc(availabilityRef, employeeID);
    const exceptionsRef = collection(employeeDocRef, "exceptions");

    try {
        // First, delete all existing documents in the 'exceptions' sub-collection
        const querySnapshot = await getDocs(exceptionsRef);
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        // Then, add each new exception entry to the 'exceptions' sub-collection
        for (let entry of newExceptions) {
            await setDoc(doc(exceptionsRef), entry);
        }
        console.log(`Exceptions for employee ${employeeID} updated successfully.`);
    } catch (error) {
        console.error("Error updating exceptions: ", error);
    }
};



export const getAllSessionsForTeacher = async (teacherId: string): Promise<any> => {
    if (teacherId === undefined) {
      return NaN;
    }
  
    const allProgramsData: any[] = [];
    let allSessionsData: any[] = [];
    let allClassesData: any[] = [];
  
    const allProgramsQuerySnapshot = await getDocs(collection(db, "programs"));
  
    const programPromises = allProgramsQuerySnapshot.docs.map(async (programDoc) => {
       
      const programData = { ...programDoc.data() };
      const classesQuerySnapshot = await getDocs(query(collection(db, "classes"), where("programID", "==", programData.id)));
      const classesData: any[] = [];
  
      const classPromises = classesQuerySnapshot.docs.map(async (classDoc) => {
        const classData = { ...classDoc.data() };
        const sessionsQuerySnapshot = await getDocs(query(collection(db, "sessions"), where("classID", "==", classData.classID)));
        const sessionsData: any[] = [];
  
        sessionsQuerySnapshot.docs.forEach((sessionDoc) => {
          const sessionInfo = { ...sessionDoc.data() };
  
          if (sessionInfo.teacherIDs && sessionInfo.teacherIDs.includes(teacherId)) {
            allSessionsData.push(sessionInfo);
            sessionsData.push(sessionInfo);
          }
        });
  
        if (sessionsData.length > 0) {
          classesData.push(classData);
        }
      });
  
      await Promise.all(classPromises);
  
      if (classesData.length > 0) {
        allProgramsData.push(programData);
        allClassesData = [...allClassesData, ...classesData];
      }
    });
  
    await Promise.all(programPromises);
  
    const shifts = await groupSessionsIntoShifts(allSessionsData);
  
    return {
      allPrograms: allProgramsData,
      allClasses: allClassesData,
      allSessions: allSessionsData,
      shifts: shifts
    };
  };

export const getAllShiftsForTeacher = async (teacherID) => {
    if (!teacherID) {
        throw new Error("Teacher ID is required");
    }

    const allShifts = [];

    // Assuming sessions are linked to teachers directly
    const sessionsRef = collection(db, "sessions");
    const sessionsQuery = query(sessionsRef, where("teacherID", "==", teacherID));

    try {
        const sessionsSnapshot = await getDocs(sessionsQuery);
        sessionsSnapshot.forEach((doc) => {
            const sessionData = doc.data();
            sessionData["docID"] = doc.id;
            // Optionally, you can filter out sessions that are not part of the desired program here
            allShifts.push(sessionData);
        });

        // Optionally, format the shifts or group them as needed
        // ...

        return allShifts;
    } catch (error) {
        console.error("Error fetching shifts for teacher:", error);
        throw error;
    }
};

export const getTicketsByEmployeeID = async (employeeID) => {
    if (!employeeID) {
        throw new Error("Employee ID is required");
    }

    const ticketsRef = collection(db, "tickets"); // Assuming the collection is named "tickets"
    const q = query(ticketsRef, where("employeeID", "==", employeeID));

    try {
        const querySnapshot = await getDocs(q);
        const tickets = [];
        querySnapshot.forEach((doc) => {
            tickets.push({ id: doc.id, ...doc.data() });
        });

        return tickets;
    } catch (error) {
        console.error("Error fetching tickets for employee ID:", error);
        throw error;
    }
};



export async function getEmployeeByID(id) {

    if (id == undefined) {
        return NaN
    }
    var school = []
    const querySnapshot = await getDocs(query(collection(db, "employees"), where("id", "==", id)));
    querySnapshot.forEach((doc) => {

        // doc.data() is never undefined for query doc snapshots
        //   console.log(doc.id, " => ", doc.data());

        school.push(doc.data())
        school[0]["docID"] = doc.id
    });
    if(school.length == 0){
        return NaN
    }
    return school[0]
}


export async function getAllTickets() {
    
    const teachers: any[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(query(collection(db, "tickets")));

    querySnapshot.forEach((doc) => {
        console.log(doc.data())
        teachers.push(doc.data());
    });
    
    
    return teachers;
};

export async function getTicketByID(id) {
    
    const teachers: any[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(query(collection(db, "tickets"), where("id", "==", id)));

    querySnapshot.forEach((doc) => {
        console.log(doc.data())
        teachers.push(doc.data());
    });
    
    if(teachers.length == 0){
        return NaN
    }
    return teachers[0];
};

export async function calculateEmployeeWage(id){

}

export async function updateTicketStatus(ticketId, field, status) {
    if (!ticketId) {
        throw new Error("Ticket ID is required");
    }
    if (field !== 'accepted' && field !== 'rejected') {
        throw new Error("Status must be 'accepted' or 'rejected'");
    }

    // Reference to the 'tickets' collection
    const ticketsRef = collection(db, "tickets");

    // Create a query against the collection for the ticket with the matching ID
    const q = query(ticketsRef, where("id", "==", ticketId));

    try {
        // Get the snapshot
        const querySnapshot = await getDocs(q);
        const ticketDocs = querySnapshot.docs;

        // Check if ticket exists
        if (ticketDocs.length === 0) {
            console.error("No matching ticket found.");
            return;
        }

        var updatedStatus = "pending"
        if( field == 'accepted' && status == true){
            updatedStatus = "Accepted"
        }
        else if(field == 'rejected' && status == true){
            updatedStatus = "Rejected"
        }
        else{
            updatedStatus = "Pending"
        }
       

        // Update the found ticket document
        // Note: If there are multiple tickets with the same ID, this will update all of them.
        // You may need to handle this according to your application's requirements.
        ticketDocs.forEach(async (ticketDoc) => {
            const ticketRef = doc(db, "tickets", ticketDoc.id);
            await updateDoc(ticketRef, {
                [field]: status,
                status: updatedStatus,
                lastUpdated: new Date(),
                // If you need to set the other status to false, uncomment the next line
                // [status === 'accepted' ? 'rejected' : 'accepted']: false
            });
        });

        console.log("Ticket status updated successfully.");
    } catch (error) {
        console.error("Error updating ticket status:", error);
        throw error;
    }
}