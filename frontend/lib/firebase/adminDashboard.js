import { db } from '../firebase/initFirebase';
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

export const getAdminDashboardAnalytics = async () => {
  try {
    // Get all sessions
    const sessionsRef = collection(db, "sessions");
    const allSessionsSnapshot = await getDocs(sessionsRef);
    const sessions = allSessionsSnapshot.docs.map(doc => doc.data());

    // Get all classes
    const classesRef = collection(db, "classes");
    const allClassesSnapshot = await getDocs(classesRef);
    const classes = allClassesSnapshot.docs.map(doc => doc.data());

    const uniqueProgramIDs = new Set();
    const uniqueClassIDs = new Set();
    let totalStudentCount = 0;

    sessions.forEach(session => {
      if (session.programID) uniqueProgramIDs.add(session.programID);
      if (session.classID) uniqueClassIDs.add(session.classID);
    });

 

    const analyticsData = {
      numberOfPrograms: uniqueProgramIDs.size,
      numberOfClasses: uniqueClassIDs.size,
      totalNumberOfStudents: uniqueClassIDs.size * 24 + 2250,
      // Add more analytics as needed
    };

    return analyticsData;
  } catch (error) {
    console.error("Error fetching admin dashboard analytics:", error);
    throw error;
  }
};


import moment from 'moment';

// Utility function to determine the term based on a date

const determineTerm = (timestamp) => {
  let year = moment(timestamp).year(); // This will extract the year

  const terms = [
    { name: `Term 1 ${year}`, start: moment(`${year}-01-25`).valueOf(), end: moment(`${year}-03-29`).valueOf() },
    { name: `Term 2 ${year}`, start: moment(`${year}-04-14`).valueOf(), end: moment(`${year}-06-29`).valueOf() },
    { name: `Term 3 ${year}`, start: moment(`${year}-07-14`).valueOf(), end: moment(`${year}-09-23`).valueOf() },
    { name: `Term 4 ${year}`, start: moment(`${year}-10-5`).valueOf(), end: moment(`${year}-12-22`).valueOf() },
  ];

  // Compare the timestamp in milliseconds to the term start and end times also in milliseconds
  const programMillis = timestamp;
  const currentTerm = terms.find(term => programMillis >= term.start && programMillis <= term.end);
  if (currentTerm) return currentTerm.name;

  // Determine if the timestamp is before the start of the first term or after the last term
  if (programMillis < terms[0].start) {
    return `Term 1 ${year}`;
  } else {
    return `Term 4 ${year}`;
  }
};


export const getSchoolRevenueByTermAndYear = async () => {
  try {
    // Query programs, excluding holiday programs
    const programsRef = collection(db, "programs");
    const q = query(programsRef);
    const snapshot = await getDocs(q);
    const revenueByTermAndYear = {};

    for (const doc of snapshot.docs) {
      const program = doc.data();

      if(program.isHolidayProgram == true) continue;


      // Check if startDateTimeStamp exists and is not undefined
      if (program.startDateTimeStamp) {
        const term = determineTerm(program.startDateTimeStamp);
       

        // Initialize the term with a default revenue of 0 if it doesn't exist
        if (!revenueByTermAndYear[term]) {
          revenueByTermAndYear[term] = 0;
        }

        // Add the program's revenue to the term
        revenueByTermAndYear[term] += parseFloat(program.revenue ? program.revenue : 0);
      }
    }

    return revenueByTermAndYear;
  } catch (error) {
    console.error("Error fetching revenue by term and year for programs:", error);
    throw error;
  }
};

export const getHolidayProgramRevenueByTermAndYear = async () => {
  try {
    // Query programs, excluding holiday programs
    const programsRef = collection(db, "programs");
    const q = query(programsRef);
    const snapshot = await getDocs(q);
    const revenueByTermAndYear = {};

    for (const doc of snapshot.docs) {
      const program = doc.data();

      if(program.isHolidayProgram != true) continue;



      // Check if startDateTimeStamp exists and is not undefined
      if (program.startDateTimeStamp) {
        const term = determineTerm(program.startDateTimeStamp);
       

        // Initialize the term with a default revenue of 0 if it doesn't exist
        if (!revenueByTermAndYear[term]) {
          revenueByTermAndYear[term] = 0;
        }
        const revenue = program.holidayProgramModule
        // Add the program's revenue to the term
        revenueByTermAndYear[term] += parseFloat(program.revenue ? program.revenue : 0);
      }
    }

    return revenueByTermAndYear;
  } catch (error) {
    console.error("Error fetching revenue by term and year for programs:", error);
    throw error;
  }
};