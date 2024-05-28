

import { NextResponse } from 'next/server';

// Firebase Admin SDK
const admin = require('firebase-admin');

import axios from "axios";

const moment = require('moment-timezone');



function isAppInitialized(appName) {
  return admin.apps.some(app => app.name === appName);
}

const myAppName = "allocateShifts"; 
var serviceAccount = require("../../inspirerobotics-35626-firebase-adminsdk-pjkc9-59a8dc928c.json");

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://inspirerobotics-35626-default-rtdb.firebaseio.com"
  });
} else {
  
}
// Get Firestore instance from Admin SDK
const db = admin.firestore();

// HERE API key
 const getShiftsWithinTimePeriod = async (startDateTimestamp, endDateTimestamp) => {
    if (startDateTimestamp === undefined || endDateTimestamp === undefined) {
        return NaN;
    }

    const allSessions = [];
    const sessionsQuerySnapshot = await db.collection("sessions").where("startTimeTimestamp", ">=", Number(startDateTimestamp)).get();
  
    sessionsQuerySnapshot.forEach((doc) => {
        const session = doc.data();
        const sessionStartTimestamp = session.startTimeTimestamp;
        const sessionEndTimestamp = session.endTimeTimestamp;

        if (sessionStartTimestamp >= startDateTimestamp && sessionEndTimestamp <= endDateTimestamp) {
           
            allSessions.push(session);
        }
    });

    //@ts-ignore
    const allShifts = await groupSessionsIntoShifts(allSessions);
   
    return allShifts;
};

async function getClassInfo(classID) {

  if (!classID) {
      return null;
  }

  try {
      const classRef = db.collection("classes").where("classID", "==", classID);
      const querySnapshot = await classRef.get();

      if (querySnapshot.empty) {
          

        
          return null;
      } else {
          
        
          return querySnapshot.docs[0].data();
      }
  } catch (error) {
      console.error("Error getting class info:", error);
      return null;
  }
}

async function getProgramInfo(programID) {
  if (!programID) {
      
      return null;
  }

  try {
      const programRef = db.collection("programs").where("id", "==", programID);
      const querySnapshot = await programRef.get();

      if (querySnapshot.empty) {
          
          return null;
      } else {
          return querySnapshot.docs[0].data();
      }
  } catch (error) {
      console.error("Error getting program info:", error);
      return null;
  }
}


// Helper function to group sessions into shifts
async function groupSessionsIntoShifts(sessions) {
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
          shifts[shiftID] = []
          shifts[shiftID].shiftStartTime = session.startTime;
          shifts[shiftID].shiftEndTime = session.endTime;
          shifts[shiftID].programData = programData;
          shifts[shiftID].date = session.date;
          shifts[shiftID].shiftID = shiftID;
      }
      shifts[shiftID].push(session);
    


      if (session.startTime < shifts[shiftID].shiftStartTime) {
          shifts[shiftID].shiftStartTime = session.startTime;
      }
      if (session.endTime > shifts[shiftID].shiftEndTime) {
          shifts[shiftID].shiftEndTime = session.endTime;
      }

      
      
  }
  
  return shifts;
}

const getAllTeachers = async () => {
  const teachers = [];
  const querySnapshot = await db.collection("employees").where("activeTeacher", "==", true).get();

  querySnapshot.forEach((doc) => {
    teachers.push(doc.data());
  });

  return teachers;
};

function getTeacherById(teachers, id) {
  return teachers.find(teacher => teacher.id === id);
}




 const getAllTeachersAvailabilityAndExceptions = async () => {
  const teachersRef = db.collection("employees");
  const availabilityRef = db.collection("availability");

  let allTeachersData = {};

  try {
      // Fetch all teachers
      const teachersSnapshot = await teachersRef.get();
      for (const teacherDoc of teachersSnapshot.docs) {
          const teacherData = teacherDoc.data();

          // Only process active teachers
          if (teacherData.activeTeacher) {
              const teacherID = teacherData.id; // Adjusted to use the 'id' field

              // Reference to the specific document for each teacher in the 'availability' collection
              const employeeDocRef = availabilityRef.doc(teacherID);

              // References to 'weekly' and 'exceptions' sub-collections for each teacher
              const weeklyRef = employeeDocRef.collection("weekly");
              const exceptionsRef = employeeDocRef.collection("exceptions");

              let availabilityData = {
                  name: teacherData.name, // Assuming the name field exists
                  weekly: [],
                  exceptions: []
              };

              // Fetch weekly availability for each teacher
              const weeklySnapshot = await weeklyRef.get();
              weeklySnapshot.forEach((doc) => {
                  availabilityData.weekly.push({ id: doc.id, ...doc.data() });
              });

              // Fetch exceptions for each teacher
              const exceptionsSnapshot = await exceptionsRef.get();
              exceptionsSnapshot.forEach((doc) => {
                  availabilityData.exceptions.push({ id: doc.id, ...doc.data() });
              });

              allTeachersData[teacherID] = availabilityData;
          }
      }

      
      return allTeachersData;

  } catch (error) {
      console.error("Error fetching all active teachers' availability and exceptions: ", error);
      throw error;
  }
};
function getDayOfWeekFromTimestamp(timestamp) {
  return moment(timestamp).format('dddd'); // Returns day of the week, e.g., 'Monday', 'Tuesday', etc.
}

function isTimeInRange(startTime, endTime, shiftStartTime, shiftEndTime) {

  const format = 'hh:mm A';
  const shiftStartMoment = moment(shiftStartTime, format);
  const shiftEndMoment = moment(shiftEndTime, format);
  const startMoment = moment(startTime, format);
  const endMoment = moment(endTime, format);
 
  return shiftStartMoment.isSameOrAfter(startMoment) && shiftEndMoment.isSameOrBefore(endMoment);
}

function isTeacherAvailableForShift(teacherAvailability, shiftStartTime, shiftStartTimeTimeStamp, shiftEndTime, shiftEndTimeTimeStamp) {
  const shiftDayOfWeek = getDayOfWeekFromTimestamp(shiftStartTimeTimeStamp);

  // Check exceptions first
  for (const exception of teacherAvailability.exceptions) {
    if (exception.startDateTimestamp <= shiftStartTimeTimeStamp && exception.endDateTimestamp >= shiftEndTimeTimeStamp) {
      
      return false;
    }
  }

  // Check weekly availability
  for (const weekly of teacherAvailability.weekly) {
    if (weekly.day === shiftDayOfWeek) {
      
      if (isTimeInRange(weekly.startTime, weekly.endTime, shiftStartTime, shiftEndTime)) {
        
        return true;
      }
    }
  }

  return false;
}

function findAvailableTeachersForShifts(shifts, availabilityData) {
  let availableTeachersForShifts = {};
  
  for (const shiftKey in shifts) {
      if (shifts.hasOwnProperty(shiftKey)) {
          const shiftsArray = shifts[shiftKey];
          availableTeachersForShifts[shiftKey] = [];

          for (const shift of shiftsArray) {
              const shiftStartTime = shift.startTimeTimestamp;
              const shiftEndTime = shift.endTimeTimestamp;
              let availableTeachers = [];

              for (const teacherId in availabilityData) {
                 
                  if (availabilityData.hasOwnProperty(teacherId)) {
                      
                      const teacherAvailability = availabilityData[teacherId];

                      if (isTeacherAvailableForShift(teacherAvailability, shift.startTime, shiftStartTime, shift.endTime, shiftEndTime )) {
                          availableTeachers.push(teacherId);
                      }
                  }
              }

              availableTeachersForShifts[shiftKey].push({
                  shift: shift,
                  availableTeachers: availableTeachers
              });
          }
      }
  }

  return availableTeachersForShifts;
}
function addTeacherDataToShifts(availableTeachersForShifts, allTeachers) {
  let copyavailableTeachersForShifts = availableTeachersForShifts;

  for (const shiftKey in copyavailableTeachersForShifts) {
    if (copyavailableTeachersForShifts.hasOwnProperty(shiftKey)) {
      const shiftsArray = copyavailableTeachersForShifts[shiftKey];

      for (const shiftInfo of shiftsArray) {
        const availableTeachers = shiftInfo.availableTeachers;
        shiftInfo.teacherData = [];

        for (const teacherId of availableTeachers) {
          const teacherData = getTeacherById(allTeachers, teacherId);

          if (teacherData) {
            shiftInfo.teacherData.push(teacherData);
          }
        }
      }
    }
  }

  return copyavailableTeachersForShifts;
}

async function addProgramInfoToShifts(shifts) {
  // Assuming programInfoCache is used to avoid fetching the same program info multiple times
  const programInfoCache = {};

  for (const shiftKey in shifts) {
      if (shifts.hasOwnProperty(shiftKey)) {
          const shiftsArray = shifts[shiftKey];

          for (const shiftInfo of shiftsArray) {
              const programID = shiftInfo.shift.programID;

              // Check if program info is already fetched and cached
              if (!programInfoCache[programID]) {
                  programInfoCache[programID] = await getProgramInfo(programID);
              }

              // Add program info to the shift
              shiftInfo.programInfo = programInfoCache[programID];
          }
      }
  }

  return shifts;
}

async function getSchoolInfo(schoolID) {
  if (!schoolID) {
    
    return null;
  }

  try {
    // Query for documents where 'id' field matches the schoolID
    const schoolQuery = db.collection("schools").where("id", "==", schoolID);
    const querySnapshot = await schoolQuery.get();

    if (querySnapshot.empty) {
      
      return null;
    } else {
      // Assuming there's only one school with this ID
      return querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error("Error getting school info:", error);
    return null;
  }
}

async function addSchoolInfoToShifts(availableShiftsWithProgramInfo) {
  // Assuming schoolInfoCache to avoid fetching the same school info multiple times
  const schoolInfoCache = {};

  for (const shiftKey in availableShiftsWithProgramInfo) {
      if (availableShiftsWithProgramInfo.hasOwnProperty(shiftKey)) {
          const shiftsArray = availableShiftsWithProgramInfo[shiftKey];

          for (const shiftInfo of shiftsArray) {
              const programInfo = shiftInfo.programInfo;
              const schoolID = programInfo.schoolID;

              // Check if school info is already fetched and cached
              if (!schoolInfoCache[schoolID]) {
                  schoolInfoCache[schoolID] = await getSchoolInfo(schoolID); // Fetch and cache
              }

              // Add school info to the shift's programInfo
              shiftInfo.programInfo.schoolInfo = schoolInfoCache[schoolID];
          }
      }
  }

  return availableShiftsWithProgramInfo;
}


async function fetchAndAddRouteInfo(shiftsData) {
  for (const shiftKey in shiftsData) {
    if (shiftsData.hasOwnProperty(shiftKey)) {
      const shiftsArray = shiftsData[shiftKey];

      for (const shiftInfo of shiftsArray) {
        let schoolAddress = shiftInfo.programInfo.schoolInfo.address;
        if (!schoolAddress) {
          
          schoolAddress = shiftInfo.programInfo.schoolInfo.name + "Victoria Australia";
        }

        shiftInfo.routeInfo = []; // Initialize routeInfo as an array

        // Prepare promises for all route information fetches
        const routePromises = shiftInfo.availableTeachers.map(async (teacherId) => {
          const teacherData = shiftInfo.teacherData.find(teacher => teacher.id === teacherId);
          if (!teacherData || !teacherData.address) {
            console.error(`No valid data or address found for teacher ID: ${teacherId}`);
            return null;
          }

          try {
            const routeInfo = await postRouteInformation(teacherData.address, schoolAddress);
            return { teacherId, route: routeInfo };
          } catch (error) {
            console.error(`Error fetching route info for teacher ${teacherId} in shift ${shiftKey}:`, error);
            return null;
          }
        });

        // Execute all promises concurrently and filter out any null results
        const results = await Promise.all(routePromises);
        shiftInfo.routeInfo = results.filter(result => result !== null);
      }
    }
  }

  return shiftsData;
}


async function getGeocodeFromAddress(address) {
  if (!address) {
    throw new Error("Address is required");
  }

  // Encode the address to be URL-safe
  const encodedAddress = encodeURIComponent(address);
 

  // Construct the URL for the HERE Discover API
  const url = `https://discover.search.hereapi.com/v1/discover?at=37.8136,144.9631&limit=2&q=${encodedAddress}&apiKey=${HERE_API_KEY}`;

  try {
    
    const response = await axios.get(url);
    
    return response.data.items[0].position;
  } catch (error) {
    console.error('Error fetching geocode information:', error);
    throw error; // Rethrow the error for the caller to handle
  }
}

async function postRouteInformation(originAddress, destinationAddress) {
  try {
    // Start both geocode requests concurrently
    const [originCoords, destinationCoords] = await Promise.all([
      getGeocodeFromAddress(originAddress),
      getGeocodeFromAddress(destinationAddress)
    ]);

    const origin = `${originCoords.lat},${originCoords.lng}`;
    const destination = `${destinationCoords.lat},${destinationCoords.lng}`;

    const url = `https://router.hereapi.com/v8/routes?origin=${origin}&destination=${destination}&return=summary,typicalDuration&transportMode=car&apikey=${HERE_API_KEY}`;

    const routeResponse = await axios.get(url);
    if (!routeResponse.data.routes[0] || !routeResponse.data.routes[0].sections) {
      throw new Error("Unable to find a route between the specified addresses");
    }
    
    return routeResponse.data.routes[0].sections[0].summary;
  } catch (error) {
    console.error("Error fetching route information:", error);
    return null; // Or handle the error as needed
  }
}




function simplifyShiftData(shiftsData) {
  const simplifiedData = {};

  for (const key in shiftsData) {
    if (shiftsData.hasOwnProperty(key)) {
      const shiftsArray = shiftsData[key];

      for (const shift of shiftsArray) {
        const shiftDate = shift.shift.date;
        const shiftID = key;
        const teacherData = shift.teacherData;
        const classID = shift.shift.classID;
        const programID = shift.shift.programID;
        const availableEmployees = shift.availableTeachers;
        const routeInfo = shift.routeInfo;
        const startTimeTimestamp = shift.shift.startTimeTimestamp;

        if (!simplifiedData[shiftDate]) {
          simplifiedData[shiftDate] = [];
        }

        simplifiedData[shiftDate].push({
          
          shiftID,
          classID,
          programID,
          startTimeTimestamp,
          availableEmployees,
          routeInfo,
          teacherData
        });
      }
    }
  }

  return simplifiedData;
}


 const getAllSessionsWithClassID = async (classID) => {
  if (!classID) {
      throw new Error("Class ID is required");
  }

  const sessions = [];
  const db = admin.firestore(); // Get the Firestore database reference
  const sessionsRef = db.collection("sessions"); // Replace "sessions" with your actual collection name
  const q = sessionsRef.where("classID", "==", classID);

  try {
      const querySnapshot = await q.get();
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

 const getAllSessionsWithProgramID = async (programID) => {
  if (!programID) {
      throw new Error("Class ID is required");
  }

  const sessions = [];
  const db = admin.firestore(); // Get the Firestore database reference
  const sessionsRef = db.collection("sessions"); // Replace "sessions" with your actual collection name
  const q = sessionsRef.where("programID", "==", programID);

  try {
      const querySnapshot = await q.get();
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


async function getPreviousWeekSessions(shift) {
  const shiftStartTimeStamp = shift.startTimeTimestamp;
  const sessionsData = await getAllSessionsWithProgramID(shift.programID);

  // Convert the timestamp to a moment object in Australia time zone
  const shiftDate = moment.tz(shiftStartTimeStamp, 'Australia/Sydney');
  
  // Define the start and end of the last week
  const startOfLastWeek = shiftDate.clone().subtract(NUM_SESSION_WEEKS_BONUS, 'week').startOf('week');

  const endOfLastWeek = shiftDate.clone().subtract(1, 'day').endOf('week');

 
  // Search for sessions that occurred last week
  const lastWeekSessions = sessionsData.filter(session => {
      const sessionDate = moment.tz(session.startTimeTimestamp, 'Australia/Sydney'); // Ensure correct field name
     
      return sessionDate.isBetween(startOfLastWeek, endOfLastWeek, 'day', '[]'); // Check if in last week
  });

  return lastWeekSessions; // Return the found sessions or an empty array if none found
}






const DURATION_WEIGHT = 0.5
const DISTANCE_WEIGHT = 2

/*
Shift bonus
looks at the last NUM_SESSION_WEEKS_BONUS week and if the teacher was assigned any shifts
The bonus is only applied once
*/
const PREVIOUS_SESSION_BONUS = 7; // Bonus points for teachers assigned last week
const NUM_SESSION_WEEKS_BONUS = 3; //how many weeks back do we give the shift bonus for

async function scoreTeacherForShift(simplifiedShifts) {
  const scoredShifts = {};

  for (const date in simplifiedShifts) {
    const shiftsArray = simplifiedShifts[date];

    for (const shift of shiftsArray) {
      const shiftID = shift.shiftID;
      const routeInfo = shift.routeInfo;

      // Get last week's sessions for this shift
      const lastWeekShiftData = await getPreviousWeekSessions(shift);
     
      // Initialize the shift in the scoredShifts with an empty object
      scoredShifts[shiftID] = {};

      for (const availableTeacher of shift.availableEmployees) {
        // Initialize score
        let score = 0;

        // LAST WEEK BONUS
        const assignedLastWeek = lastWeekShiftData.some(session => session.teacherIDs.includes(availableTeacher));
        
        if (assignedLastWeek) {
         
          score += PREVIOUS_SESSION_BONUS; // Add bonus only once
        }

        // DISTANCE BONUS
        const teacherRoute = routeInfo.find(route => route.teacherId === availableTeacher);
        if (teacherRoute) {
          // Calculate score based on duration and distance
          const durationScore = -teacherRoute.route.duration / 1000; // Higher duration, lower score
          const distanceScore = -teacherRoute.route.length / 10000; // Lower impact than duration
          
          // Combine scores
          score += (durationScore * DURATION_WEIGHT) + (distanceScore * DISTANCE_WEIGHT);
        } else {
          console.error(`No route info found for teacher ${availableTeacher} in shift ${shiftID}`);
        }

        //SKILLS BONUS
        

        // Assign final score
        scoredShifts[shiftID][availableTeacher] = score;
        
      }
    }
  }
  
  return scoredShifts;
}



function groupShiftsByDate(scoredShifts) {
  const shiftsByDate = {};

  for (const shiftID in scoredShifts) {
    const [date] = shiftID.split('_');
    if (!shiftsByDate[date]) {
      shiftsByDate[date] = {};
    }
    shiftsByDate[date][shiftID] = scoredShifts[shiftID];
  }

  return shiftsByDate;
}



/*
This is the functiopn doing all the logic
Everything else really just preparing data for this function

currently using a random algorithm. Genetic algorithm would be better but because space of solutions so small random
*/

const NUM_RANDOM_SEARCH = 10000

async function assignTeachersToShifts(scoredShifts) {
  
  

  const greedyAssignment = await assignGreedy(scoredShifts);
  const formattedGreedyAssignment = groupAssignmentsByDate(greedyAssignment);
  const greedyAverage = calculateAverageForAllShifts(formattedGreedyAssignment);
  
  

  const randomAssignment = await assignRandom(scoredShifts);
  const randomScore = await calculateAverageForAllShifts(randomAssignment);
  
  

  // return randomAssignment
  return randomScore >= greedyAverage ? randomAssignment : greedyAssignment;

}
function groupAssignmentsByDate(assignments) {
  const groupedByDate = {};

  for (const shiftID in assignments) {
      const [date] = shiftID.split('_');
      if (!groupedByDate[date]) {
          groupedByDate[date] = {};
      }
      groupedByDate[date][shiftID] = assignments[shiftID];
  }

  return groupedByDate;
}

function calculateAverageForAllShifts(randomAssignment) {
  let totalAverageScore = 0;
  let shiftCount = 0;

  for (const date in randomAssignment) {
    const shifts = randomAssignment[date];
    for (const shiftID in shifts) {
      totalAverageScore += shifts[shiftID].averageScore;
      shiftCount++;
    }
  }

  return shiftCount > 0 ? totalAverageScore / shiftCount : 0;
}

function calculateOverallAverage(assignments) {
  let totalAverageScore = 0;
  let shiftCount = 0;

  for (const shiftID in assignments) {
    totalAverageScore += assignments[shiftID].averageScore;
    shiftCount++;
  }

  return shiftCount > 0 ? totalAverageScore / shiftCount : 0;
}

async function assignRandom(scoredShifts){
  const groupedShifts =  groupShiftsByDate(scoredShifts)
  

  const bestConfigurations = {};

  for (const date in groupedShifts) {
      let bestAverage = -Infinity;
      let bestAssignmentForDay = null;

      for (let i = 0; i < NUM_RANDOM_SEARCH; i++) {
          const assignments = performRandomAssignmentForDay(groupedShifts[date]);
          const averageScore = calculateOverallAverage(assignments);

          if (averageScore > bestAverage) {
              bestAverage = averageScore;
              bestAssignmentForDay = assignments;
          }
      }

      bestConfigurations[date] = bestAssignmentForDay;
  }

  return bestConfigurations;
  
}

function performRandomAssignmentForDay(shiftsForDay) {
  const assignments = {};
  const assignedTeachers = new Set();

  // First pass: Assign one teacher to each shift
  Object.keys(shiftsForDay).forEach(shiftID => {
    const teachers = Object.keys(shiftsForDay[shiftID]);
    let randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];

    while (assignedTeachers.has(randomTeacher)) {
      randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
    }

    assignments[shiftID] = { assignedTeachers: [randomTeacher], totalScore: shiftsForDay[shiftID][randomTeacher] };
    assignedTeachers.add(randomTeacher);
  });

  // Second pass: Try to assign a second teacher to each shift
  Object.keys(assignments).forEach(shiftID => {
    const teachers = Object.keys(shiftsForDay[shiftID]).filter(teacher => !assignedTeachers.has(teacher));
    if (teachers.length > 0) {
      let randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
      assignments[shiftID].assignedTeachers.push(randomTeacher);
      assignments[shiftID].totalScore += shiftsForDay[shiftID][randomTeacher];
      assignedTeachers.add(randomTeacher); // Ensure the second teacher is also marked as assigned
    }
    // Calculate average score for this shift
    assignments[shiftID].averageScore = assignments[shiftID].totalScore / assignments[shiftID].assignedTeachers.length;
  });

  return assignments;
}




async function assignGreedy(scoredShifts) {
  

  const allPairs = [];
  for (const shiftID in scoredShifts) {
    for (const teacherID in scoredShifts[shiftID]) {
      allPairs.push({
        shiftID,
        teacherID,
        score: scoredShifts[shiftID][teacherID]
      });
    }
  }
  allPairs.sort((a, b) => b.score - a.score);

  const assignments = {};
  const assignedTeachersByDate = {};

  // First pass: Assign one teacher to each shift
  for (const pair of allPairs) {
    const [date, shift] = pair.shiftID.split('_');
    const alreadyAssigned = assignedTeachersByDate[date] || new Set();

    if (!assignments[pair.shiftID]) {
      assignments[pair.shiftID] = { assignedTeachers: [], totalScore: 0 };
    }

    if (assignments[pair.shiftID].assignedTeachers.length < 1 && !alreadyAssigned.has(pair.teacherID)) {
      assignments[pair.shiftID].assignedTeachers.push(pair.teacherID);
      assignments[pair.shiftID].totalScore += pair.score;
      alreadyAssigned.add(pair.teacherID);
      assignedTeachersByDate[date] = alreadyAssigned;
    }
  }

  // Second pass: Try to assign a second teacher to each shift
  for (const pair of allPairs) {
    const [date, shift] = pair.shiftID.split('_');
    const alreadyAssigned = assignedTeachersByDate[date];

    if (assignments[pair.shiftID].assignedTeachers.length < 2 && !alreadyAssigned.has(pair.teacherID)) {
      assignments[pair.shiftID].assignedTeachers.push(pair.teacherID);
      assignments[pair.shiftID].totalScore += pair.score;
      alreadyAssigned.add(pair.teacherID);
    }
  }

  // Calculate average scores
  for (const shiftID in assignments) {
    if (assignments[shiftID].assignedTeachers.length > 0) {
      assignments[shiftID].averageScore = assignments[shiftID].totalScore / assignments[shiftID].assignedTeachers.length;
    }
  }

  
  return assignments;
}

 async function POST(req, res) {
  const { startDateTimestamp, endDateTimestamp, alreadyAssignedShifts } = await req.json();
  

  try {
      const availabilityData = await getAllTeachersAvailabilityAndExceptions();
      const allTeachers = await getAllTeachers();
      const shifts = await getShiftsWithinTimePeriod(startDateTimestamp, endDateTimestamp);
    
      console.log(shifts)

      //05/01/2024_4e18bdc9-9067-4839-9ac0-b965485adce8: Williamstown High School
      //05/01/2024_326ed462-c157-4102-8e68-0d36d137abbc:  496 Princes Hwy, Narre Warren VIC 3805

      /*
      {
          "name": "Jacob Grant",
          "activeTeacher": true,
          "id": "6989973a-80ce-4375-ab5f-55148f3decc3",
          "UID": [
            ""
          ],
          "address": "Glen Iris Victoria 3146"
        },
        {
          "name": "Benjamin Grant",
          "activeTeacher": true,
          "id": "d7c793bc-2991-4fe1-815c-cf1127fb4359",
          "UID": [
            "7Oo4WX9mtLYfbPGMqm4cjjD8n433"
          ],
          "address": "Kensington Victoria 3031"
        },
        {
          "id": "9296af79-76be-48ee-9b1d-95a8678ccd3f",
          "name": "Toby Simonds",
          "activeTeacher": true,
          "standardPayRate": "34",
          "transportationPayStart": "1",
          "rndPayRate": "27",
          "address": "15 Station Rd Williamstown Melbourne",
          "UID": [
            ""
          ]
        }
        */

      // 

      // Send the shifts data back as a JSON response
      return new NextResponse(JSON.stringify({scoredShifts, assignedTeachers, "shiftAssigningData": simplifiedShifts}, null, 2));
  } catch (error) {
      // Handle any errors that might occur
      console.error("Error fetching shifts:", error);
      return new NextResponse(JSON.stringify({"message": `ERROR`}));
  }
}