import {
    db,
    auth
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
    addDoc,
    setDoc,
    Firestore
  } from "firebase/firestore";
  
  
  
  export const dbref = db;
  
  
  
  
  import {
    getAllProgramClassesSessions,
    groupSessionsIntoShifts
  
  } from '../firebase/library'

  import moment from 'moment';


  export const getEmployeeSessions = async (employeeID) => {
      const sessionsRef = collection(db, "sessions");
      const q = query(sessionsRef, where("teacherIDs", "array-contains", employeeID));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };
  
  export const getEmployeeDashboardAnalytics = async (employeeID) => {
    try {
        const sessions = await getEmployeeSessions(employeeID);
  
        const uniqueProgramIDs = new Set();
        const uniqueClassIDs = new Set();
  
        sessions.forEach(session => {
            if (session.programID) uniqueProgramIDs.add(session.programID);
            if (session.classID) uniqueClassIDs.add(session.classID);
        });
  
        const analyticsData = {
            numberOfProgramsTaught: uniqueProgramIDs.size,
            numberOfClasses: uniqueClassIDs.size,
            numberOfStudents: uniqueClassIDs.size* 25
            // Add more analytics as needed
        };
  
        return analyticsData;
    } catch (error) {
        console.error("Error fetching employee dashboard analytics:", error);
        throw error;
    }
  };