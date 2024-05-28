import {
    db,
    auth,
    storage
} from '../firebase/initFirebase'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    getCountFromServer,
    where,
    query,
    QuerySnapshot,
    setDoc
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const dbref = db;




/*
TEAM MEMBERS
*/

//Get All Teachers

/*
GET ALLs
*/
export const getAllTeachers = async (id: string): Promise<any[]> => { 
    
    const teachers: any[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(query(collection(db, "employees"), where("activeTeacher", "==", true)));
    querySnapshot.forEach((doc) => {
        teachers.push(doc.data());
    });
    
    
    return teachers;
};

export const getAllPrograms = async (): Promise<any[]> => { // Replace `any` with the actual type of program data if known
    const programs: any[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, "programs"));
    
    querySnapshot.forEach((doc) => {
        programs.push(doc.data());
    });
    
    return programs;
};

export const getAllSchools = async (): Promise<any[]> => { // Replace `any` with the actual type of school data if known
    const schools: any[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, "schools"));
    
    querySnapshot.forEach((doc) => {
        schools.push(doc.data());
    });
   
    
    return schools;
};

export const schoolsRunningPrograms = async (): Promise<any> => { // Replace `any` with the actual type of school data if known
    const programs = await getAllPrograms();
    const schoolIDs = programs.map(program => program.schoolID);

    // Use Promise.all to wait for all the promises to resolve
    const schools = await Promise.all(schoolIDs.map(schoolID =>
        getSchoolWithID(schoolID).then(school => school ? school[0] : null)
    ));

    // Filter out any nulls if there were schools not found
    return schools.filter(school => school !== null && school !== undefined);
};
export const getAllCourses = async (): Promise<any[]> => { // Replace `any` with the actual type of course data if known
    const courses: any[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, "courses"));
    
    querySnapshot.forEach((doc) => {
        courses.push(doc.data());
    });
    
    return courses;
};

export const getAllSessions = async (): Promise<any[]> => { // Replace `any` with the actual type of session data if known
    const sessions: any[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, "sessions"));
    
    querySnapshot.forEach((doc) => {
        const sessionData = doc.data();
        sessionData["docID"] = doc.id;
        sessions.push(sessionData);
    });
    
    return sessions;
};

export const getAllSchoolProgram = async (): Promise<any[]> => {
    const programs: any[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, "programs")); // Assuming "schoolProgramModules" is the correct collection name

    querySnapshot.forEach((doc) => {
        const programData = doc.data();
        // Check if `isHolidayProgram` is not true (including undefined, null, or false)
        if (programData.isHolidayProgram !== true) {
            programs.push(programData);
        }
    });

    return programs;
};

export const getAllHolidayProgramModules = async (): Promise<any[]> => { // Replace `any` with the actual type of program data if known
    const programs: any[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, "holidayProgramModules"));
    
    querySnapshot.forEach((doc) => {
        programs.push(doc.data());
    });
    
    return programs;
};

export const getAllSessionsWithClassID = async (classID) => {
    if (!classID) {
        throw new Error("Class ID is required");
    }

    const sessions = [];
    const sessionsRef = collection(db, "sessions"); // Replace "sessions" with your actual collection name
    const q = query(sessionsRef, where("classID", "==", classID));

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // You might want to include the document ID as well
            sessions.push({ id: doc.id, ...doc.data() });
        });

        return sessions;
    } catch (error) {
        console.error("Error getting sessions with class ID:", error);
        throw error; // Or handle the error as needed
    }
};



/*
Schools
*/


export async function getSchoolWithID(id) {

    if (id == undefined) {
        return NaN
    }
    var school = []
    const querySnapshot = await getDocs(query(collection(db, "schools"), where("id", "==", id)));
    querySnapshot.forEach((doc) => {

        // doc.data() is never undefined for query doc snapshots
        //   console.log(doc.id, " => ", doc.data());

        school.push(doc.data())
        school[0]["docID"] = doc.id
    });

    return school
}


/*
Courses
*/

// Replace `any` with the actual type of course, program, and other data if known
type CourseType = any;
type ProgramType = any;
type CountType = any;

export const getCourseWithID = async (id: string): Promise<CourseType[] | number> => {
    if (id === undefined) {
        return NaN;
    }
    const course: CourseType[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(query(collection(db, "courses"), where("id", "==", id)));
    
    querySnapshot.forEach((doc) => {
        const courseData = doc.data();
        courseData["docID"] = doc.id;
        course.push(courseData);
    });
    
    return course;
};

export const getProgramWithID = async (id: string): Promise<ProgramType[] | number> => {
    if (id === undefined) {
        return NaN;
    }
    const program: ProgramType[] = [];
    const querySnapshot: QuerySnapshot = await getDocs(query(collection(db, "programs"), where("id", "==", id)));
    
    querySnapshot.forEach((doc) => {
        const programData = doc.data();
        programData["docID"] = doc.id;
        program.push(programData);
    });
    
    return program;
};

export const getClassWithID = async (classID) => {
    if (classID === undefined) {
        return NaN;  // Or throw an error
    }

    const classRef = collection(db, "classes");
    const classQuery = query(classRef, where("classID", "==", classID));

    try {
        const querySnapshot = await getDocs(classQuery);
        const classData = [];
        
        querySnapshot.forEach((doc) => {
            // You might want to include the document ID as well
            classData.push({ id: doc.id, ...doc.data() });
        });

        // Assuming there should only be one class with a given ID
        // If multiple, consider how you want to handle this scenario
        return classData.length > 0 ? classData[0] : null;
    } catch (error) {
        console.error("Error getting class with ID:", error);
        throw error;
    }
};

export const getClassWithProgramID = async (programID) => {
    if (programID === undefined) {
        return NaN;  // Or throw an error
    }

    const classRef = collection(db, "classes");
    const classQuery = query(classRef, where("programID", "==", programID));

    try {
        const querySnapshot = await getDocs(classQuery);
        const classData = [];
        
        querySnapshot.forEach((doc) => {
            // You might want to include the document ID as well
            classData.push({ id: doc.id, ...doc.data() });
        });

        // Assuming there should only be one class with a given ID
        // If multiple, consider how you want to handle this scenario
        return classData.length > 0 ? classData[0] : null;
    } catch (error) {
        console.error("Error getting class with ID:", error);
        throw error;
    }
};


export const getAllProgramClassesSessions = async (programId: string): Promise<any> => {
    if (programId === undefined) {
        return NaN;
    }
    

    // Fetch the Program
    let programData = null;
    const programQuerySnapshot = await getDocs(query(collection(db, "programs"), where("id", "==", programId)));
    programQuerySnapshot.forEach((doc) => {
        programData = { ...doc.data(), docID: doc.id };
    });

    if (!programData) return {}; // Handle the absence of program data

    // Fetch Classes for the Program
    const classesQuerySnapshot = await getDocs(query(collection(db, "classes"), where("programID", "==", programId)));
    const classesData = [];
    let allSessions = []; // Array to store all sessions

    for (const classDoc of classesQuerySnapshot.docs) {
        const classData = classDoc.data();

        // Check if the class with this ID already exists in the array
        if (!classesData.some(existingClass => existingClass.classID === classData.classID)) {
            // Fetch Sessions for each Class
            const sessionsQuerySnapshot = await getDocs(query(collection(db, "sessions"), where("classID", "==", classData.classID)));
            const sessionsData = sessionsQuerySnapshot.docs.map(sessionDoc => {
                const sessionInfo = { ...sessionDoc.data(), docID: sessionDoc.id };
                allSessions.push(sessionInfo); // Add to allSessions array
                return sessionInfo;
            });

            // Combine Class Data with its Sessions
            classesData.push({ ...classData, sessions: sessionsData });
        }
    }

    // Group sessions into shifts
    const shifts = await groupSessionsIntoShifts(allSessions);

    // Combine everything into a single structured format
    const result = {
        program: programData,
        classes: classesData,
        allSessions: allSessions, // Include the array of all sessions
        shifts: shifts // Include the grouped shifts
    };

    return result;
};

export const getAllProgramsClassesSessionsForAllPrograms = async (): Promise<any> => {
    // Assume db is typed as any
    ;

    // Fetch all Programs
    const allProgramsQuerySnapshot = await getDocs(collection(db, "programs"));
    const allProgramsData: any[] = allProgramsQuerySnapshot.docs.map((doc: any) => ({ ...doc.data(), docID: doc.id }));

    const allClassesData: any[] = [];
    let allSessionsData: any[] = []; // Array to store all sessions data

    // Iterate over each program to fetch its classes and sessions
    for (const program of allProgramsData) {
        // Fetch Classes for the Program
        const classesQuerySnapshot = await getDocs(query(collection(db, "classes"), where("programID", "==", program.id)));
        const classesData: any[] = [];

        for (const classDoc of classesQuerySnapshot.docs) {
            const classData: any = { ...classDoc.data(), docID: classDoc.id };

            // Fetch Sessions for each Class
            const sessionsQuerySnapshot = await getDocs(query(collection(db, "sessions"), where("classID", "==", classData.classID)));
            const sessionsData: any[] = sessionsQuerySnapshot.docs.map((sessionDoc: any) => ({ ...sessionDoc.data(), docID: sessionDoc.id }));

            // Combine Class Data with its Sessions
            classesData.push({ ...classData, sessions: sessionsData });
            allSessionsData = allSessionsData.concat(sessionsData); // Collect all sessions data
        }

        allClassesData.push({ name: program.name, programID: program.id, classes: classesData });
    }

    // Group sessions into shifts (assuming groupSessionsIntoShifts is typed as any)
    const groupSessionsIntoShifts: any = (sessions: any[]) => { /* ... */ };
    const shifts = await groupSessionsIntoShifts(allSessionsData);

    // Combine everything into a single structured format
    const result: any = {
        allPrograms: allProgramsData,
        allClasses: allClassesData, // Include the array of all classes grouped by program IDs
        allSessions: allSessionsData, // Include the array of all sessions
        shifts: shifts // Include the grouped shifts
    };

    return result;
};


const getAllSessionsTeachersAssignedInPeriod = async (startDateTimestamp, endDateTimestamp) => {
    const sessionsRef = collection(db, "sessions");
    const queryRef = query(sessionsRef);
    const querySnapshot = await getDocs(queryRef);
    
    // Object to hold the mapping of teacherID to sessions
    const teacherSessions = {};
    
    querySnapshot.forEach((doc) => {
        let sessionData = doc.data();
        if (sessionData.startTimeTimestamp >= startDateTimestamp && sessionData.endTimeTimestamp <= endDateTimestamp) {
            // Ensure the session has the teacherIDs field and it's an array
            if (sessionData.teacherIDs && Array.isArray(sessionData.teacherIDs)) {
                sessionData.teacherIDs.forEach(id => {
                    // Initialize the array for the teacherID if it doesn't already exist
                    if (!teacherSessions[id]) {
                        teacherSessions[id] = [];
                    }
                    // Add the session data to the array for this teacherID
                    teacherSessions[id].push({ id: doc.id, ...sessionData });
                });
            }
        }
    });

    // Return the complete dictionary of teacherIDs to their associated sessions
    return teacherSessions;
}
var sessionsAssigned = {};
export const getAllTeachersAvailabilityAndExceptions = async () => {
    const teachersRef = collection(db, "employees");
    const availabilityRef = collection(db, "availability");

    // Check if sessionsAssigned is empty (using Object.keys)
    if (Object.keys(sessionsAssigned).length === 0) {
        console.log("Fetching sessions assigned...");
        sessionsAssigned = await getAllSessionsTeachersAssignedInPeriod(Date.now(), Date.now() + 40 * 24 * 60 * 60 * 1000);
    }
    console.log("sessionsAssigned", sessionsAssigned);

    let allTeachersData = {};
    try {
        // Fetch all teachers
        const teachersSnapshot = await getDocs(teachersRef);
        for (const teacherDoc of teachersSnapshot.docs) {
            const teacherData = teacherDoc.data();

            // Only process active teachers
            if (teacherData.activeTeacher) {
                // Use the teacher's 'id' field instead of the document ID
                const teacherID = teacherData.id; // Adjusted to use the 'id' field

                // Reference to the specific document for each teacher in the 'availability' collection
                const employeeDocRef = doc(availabilityRef, teacherID); // Reference by teacherData.id

                // References to 'weekly' and 'exceptions' sub-collections for each teacher
                const weeklyRef = collection(employeeDocRef, "weekly");
                const exceptionsRef = collection(employeeDocRef, "exceptions");

                let availabilityData = {
                    name: teacherData.name, // Assuming the name field exists
                    weekly: [],
                    exceptions: []
                };

                // Fetch weekly availability for each teacher
                const weeklySnapshot = await getDocs(weeklyRef);
                weeklySnapshot.forEach((doc) => {
                    availabilityData.weekly.push({ id: doc.id, ...doc.data() });
                });

                // Fetch exceptions for each teacher
                const exceptionsSnapshot = await getDocs(exceptionsRef);
                exceptionsSnapshot.forEach((doc) => {
                    availabilityData.exceptions.push({ id: doc.id, ...doc.data() });
                });

                //Now we fetch the assigned shifts
                
                availabilityData.sessionsAssigned = sessionsAssigned[teacherID];
                allTeachersData[teacherID] = availabilityData;
            }



        }

        console.log("All active teachers' availability and exceptions fetched successfully.");
        console.log(allTeachersData)
        return allTeachersData;

    } catch (error) {
        console.error("Error fetching all active teachers' availability and exceptions: ", error);
        throw error; // Rethrow to let the caller handle the error
    }
};




// Function to get all shifts within a given time period
export const getShiftsWithinTimePeriod = async (startDateTimestamp, endDateTimestamp) => {
    // Parse the start and end dates to Unix timestamps

    if (startDateTimestamp === undefined || endDateTimestamp === undefined) {
        return NaN;
    }
   
    const allSessions = [];
    const sessionsQuerySnapshot = await getDocs(query(collection(db, "sessions"), where("startTimeTimestamp", ">=", startDateTimestamp)));
    
    sessionsQuerySnapshot.forEach((doc) => {
        const session = doc.data();
        
        const sessionStartTimestamp = session.startTimeTimestamp;
        const sessionEndTimestamp = session.endTimeTimestamp;

        // Check if the session time falls within the specified range
        if (sessionStartTimestamp >= startDateTimestamp && sessionEndTimestamp <= endDateTimestamp) {
            
            allSessions.push(session);
        }
    });

    // Optional: Group by date or other criteria if necessary
    // ...

    const allShifts = await groupSessionsIntoShifts(allSessions);
    console.log(allSessions)
    console.log(allShifts)
    return allShifts;
};


// Helper function to group sessions into shifts
export async function groupSessionsIntoShifts(sessions) {
    const shifts = {};
    const classInfoCache = {};
    const programInfoCache = {};

    for (const session of sessions) {
        const classID = session.classID;

        // Check cache for class info
        if (!classInfoCache[classID]) {
            classInfoCache[classID] = await getClassInfo(classID); // Fetch and cache
        }
        const classInfo = classInfoCache[classID];

        if (!classInfo) {
            console.error("No class with classID exists");
            continue; // Skip this session if class info is missing
        }

        const programID = classInfo.programID;

        // Check cache for program info
        if (!programInfoCache[programID]) {
            programInfoCache[programID] = await getProgramInfo(programID); // Fetch and cache
        }
        const programData = programInfoCache[programID];

        if (!programData) {
            console.error("No program with programID exists");
            continue; // Skip this session if program info is missing
        }

        const shiftID = session.date + "_" + programID;
        if (!shifts[shiftID]) {
            shifts[shiftID] = [];
            shifts[shiftID].shiftStartTime = session.startTime;
            shifts[shiftID].shiftEndTime = session.endTime;
            shifts[shiftID].programData = programData;
            shifts[shiftID].date = session.date;
            shifts[shiftID].shiftID = shiftID;
        } else {
            // Update shift start and end time for each session
            if (moment(session.startTime, 'h:mma').isBefore(moment(shifts[shiftID].shiftStartTime, 'h:mma'))) {
                shifts[shiftID].shiftStartTime = session.startTime;
            }
            if (moment(session.endTime, 'h:mma').isAfter(moment(shifts[shiftID].shiftEndTime, 'h:mma'))) {
                shifts[shiftID].shiftEndTime = session.endTime;
            }
        }
        shifts[shiftID].push(session);
    }

    return shifts;
}

async function getClassInfo(classID) {
    if (!classID) {
        return null;
    }

    try {
        const classQuery = query(collection(db, "classes"), where("classID", "==", classID));
        const querySnapshot = await getDocs(classQuery);
        return querySnapshot.empty ? null : querySnapshot.docs[0].data();
    } catch (error) {
        console.error("Error getting class info:", error);
        return null;
    }
}

// Function to fetch program information by id field
async function getProgramInfo(programID) {
    
    if (!programID) {
        console.log('Program ID is not provided.');
        return null;
    }

    try {
        // Create a query to find the program by its ID
        const programQuery = query(collection(db, "programs"), where("id", "==", programID));
        // Execute the query
        const querySnapshot = await getDocs(programQuery);

        // Check if any documents were found
        if (querySnapshot.empty) {
            console.log(`No program found for ID: ${programID}`);
            return null;
        } else {
            // Return the first document's data
            return querySnapshot.docs[0].data();
        }
    } catch (error) {
        console.error("Error getting program info:", error);
        return null;
    }
}

const moment = require('moment');

const parseTime = (timeString) => {
  // Define the possible formats
  const formats = ["HH:mm", "HH:mm A", "HH:mmA"];

  // Parse the timeString with the given formats
  const parsedTime = moment(timeString, formats);

  // Check if the time is valid
  if (!parsedTime.isValid()) {
    throw new Error('Invalid time format');
  }

  // Convert to JavaScript Date object
  return parsedTime.toDate();
};

export const timestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export const timestampToTime = (timestamp) => {
   
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);

    // Get hours and minutes from the date
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Format the hours for AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to always be two digits
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Combine the hours and minutes with AM/PM
    return hours + ':' + formattedMinutes + ' ' + ampm;
    
}




const findShiftTimes = (sessions: any): { shiftStartTime: string; shiftEndTime: string } => {
    let earliestStartTime = Number.MAX_VALUE;
    let latestEndTime = 0;

    sessions.forEach(session => {
        const startTime = parseTime(session.startTime).getTime(); // Ensure parseTime returns a Date object
        const endTime = parseTime(session.endTime).getTime(); // Ensure parseTime returns a Date object

        if (startTime < earliestStartTime) {
            earliestStartTime = startTime;
        }
        if (endTime > latestEndTime) {
            latestEndTime = endTime;
        }
    });

    // Define options for time formatting
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    // Fallback for invalid dates
    const shiftStartTime = earliestStartTime !== Number.MAX_VALUE 
        ? new Date(earliestStartTime).toLocaleTimeString(undefined, timeOptions) 
        : 'Unknown';
    const shiftEndTime = latestEndTime !== 0 
        ? new Date(latestEndTime).toLocaleTimeString(undefined, timeOptions) 
        : 'Unknown';

    return {
        shiftStartTime,
        shiftEndTime
    };
};


export const deleteClassAndSessions = async (classID) => {
    if (!classID) {
      throw new Error("Class ID is required");
    }
  
    // Reference to the sessions collection
    const sessionsRef = collection(db, "sessions");
    // Reference to the classes collection
    const classesRef = collection(db, "classes");
    
    // Create a query against the sessions collection for the classID
    const sessionsQuery = query(sessionsRef, where("classID", "==", classID));
    // Create a query against the classes collection for the classID
    const classesQuery = query(classesRef, where("classID", "==", classID));

    try {
      // Step 1: Fetch and delete all sessions with the given classID
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionDeletes = sessionsSnapshot.docs.map((sessionDoc) => 
        deleteDoc(doc(db, "sessions", sessionDoc.id))
      );
      await Promise.all(sessionDeletes);

      // Step 2: Fetch and delete all classes with the given classID
      const classSnapshot = await getDocs(classesQuery);
      const classDeletes = classSnapshot.docs.map((classDoc) => 
        deleteDoc(doc(db, "classes", classDoc.id))
      );
      await Promise.all(classDeletes);

      console.log(`Class and all associated sessions deleted successfully.`);
    } catch (error) {
      console.error("Error deleting classes and sessions:", error);
      throw error; // Or handle the error as needed
    }
};

export const updateSessionsForClass = async (classID, newSessions) => {

    console.log(newSessions)
    // Step 1: Delete old sessions
    const oldSessionsRef = collection(db, "sessions"); // Replace "sessions" with your collection name
    const oldSessionsQuery = query(oldSessionsRef, where("classID", "==", classID));
    const querySnapshot = await getDocs(oldSessionsQuery);
    querySnapshot.forEach((session) => {
        deleteDoc(doc(db, "sessions", session.id));
    });

    // Step 2: Add new sessions
    newSessions.forEach(async (session) => {
        const newSessionRef = doc(collection(db, "sessions"));
        await setDoc(newSessionRef, { ...session, classID }); // Assuming session contains the necessary data
        console.log("Added new session", newSessionRef.id);
    });
    
};

export const createNewClass = async (classData) => {
    try {
        // Create a new document reference for a class in the "classes" collection
        const classRef = doc(collection(db, "classes"));

        // Set the document with the provided class data
        await setDoc(classRef, classData);

        console.log("Class created with ID:", classRef.id);
    } catch (error) {
        console.error("Error creating class:", error);
        throw error; // Optional: throw the error to handle it in the calling function
    }
};


export const getNumStudents = async (): Promise<number> => {
    const coll = collection(db, "classes");
    const q = query(coll);
    const querySnapshot = await getCountFromServer(q); // replace getCountFromServer with actual import
    
    return querySnapshot.data().count * 25;
};

export const getNumEmployees = async (): Promise<number> => {
    const coll = collection(db, "employees");
    const q = query(coll);
    const querySnapshot = await getCountFromServer(q); // replace getCountFromServer with actual import
    
    return querySnapshot.data().count;
};

export const getTotalRevenue = async (): Promise<number> => {
    let total = 0;
    const programs = await getAllPrograms(); // replace getAllPrograms with actual import
    
    programs.forEach((program: ProgramType) => {
        if (program.revenue !== undefined && program.revenue !== "") {
            total += Number(program.revenue);
        }
    });
    
    return total;
};





/*UPLOAD IMAGES */
function base64ToBlob(base64, mimeType = '') {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
  
  export const uploadImage = async (base64Image, path) => {
   
  
    // Extract MIME type from base64 string
    const mimeTypeMatch = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (!mimeTypeMatch) {
        console.warn('Warning: Invalid base64 image data');
        return ''; // Return an empty string or some default value
    }
    const mimeType = mimeTypeMatch[1];
    const blob = base64ToBlob(base64Image, mimeType);
    
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(downloadURL)
    return downloadURL;
  };




  