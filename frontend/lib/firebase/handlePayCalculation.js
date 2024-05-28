
/*
NO LONGER USED.

*/



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

export const getEmployeeInfo = async (id) => {
    var employee = null;
    const querySnapshot = await getDocs(query(collection(db, "employees"), where("id", "==", id)));
    
    querySnapshot.forEach((doc) => {
      
      employee = doc.data();
    });
    
    
    return employee;
  }

const calculateSessionPay = async (session, employeeID) => {
  const teacherIDs = session.teacherIDs
  
  var teachersPay = NaN;
  var teachersPayRate = NaN;

  for (const teacherID of teacherIDs) {
    if (teacherID == employeeID){
      const teacher = await getEmployeeInfo(teacherID)
      const payRate = teacher.standardPayRate
      const hours = (session.endTimeTimestamp - session.startTimeTimestamp)  / (1000 * 60 * 60) // converts timestamp to hours
      const pay = hours * payRate
      teachersPay = pay
      teachersPayRate = payRate
     
    }
  }
  return {teachersPay, teachersPayRate}
}



export const getSessionsAfterTimeForEmployee = async (startTimeStamp, endTimeStamp, id ) => {
  

    if (startTimeStamp == undefined || endTimeStamp == undefined) {
        return NaN
    }

    var sessions = []
    const querySnapshot = await getDocs(query(collection(db, "sessions"), where("startTimeTimestamp", ">=", startTimeStamp)));
    querySnapshot.forEach((doc) => {
        const data = doc.data()

        if(data.startTimeTimestamp < endTimeStamp && data.teacherIDs.includes(id)){
            sessions.push(data)
        }
        
    });

    return sessions
}

const getAllTicketsForEmployeeForWeek = async (employeeID, startTimeStamp) => {
  console.log("GETTING TICEKTS")
  const weekData = formatTimestamp(startTimeStamp)
  const currentWeekData = formatTimestamp(moment().valueOf())

  var tickets = []
 
  const querySnapshot = await getDocs(query(collection(db, "tickets"), where("employeeID", "==", employeeID)));
  querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log("data", data)
      if(weekData.weekNumber == currentWeekData.weekNumber && weekData.year == currentWeekData.year){
        //current week
        //This means show tickets that haven't been payed yet
        if(data.rejected == false && data.accepted == false){
          if(data.payed == false || data.payed == undefined){
            tickets.push(data)
          }
        } else{
          console.log(data)
          console.log(weekData)
          if(data.payedWeek == weekData.weekNumber && data.payYear == weekData.year && data.payed == true){
            tickets.push(data)
        }
        }

      }

      
      
  });
  console.log("tickets",tickets)
  return tickets
}


const calculateTicketPay = async (tickets) => {
  for (const ticket of tickets) {
      // Assuming each ticket has an employee ID
      const employeeId = ticket.employeeID;
      const employee = await getEmployeeInfo(employeeId);

      if (employee && employee.standardPayRate) {
          // Assuming numMinutes is a field in each ticket
          const numMinutes = ticket.numMinutes;
          // Convert minutes to hours for pay calculation
          const hours = numMinutes / 60;
          // Calculate pay
          const pay = hours * employee.standardPayRate;
          ticket.pay = pay;
      } else {
          console.log(`Employee data not found for ID: ${employeeId}`);
          ticket.pay = 0; // Or handle this scenario as appropriate
      }
  }

  return tickets;
};


export const calculateTotalPayForEmployeeID = () => {

}
export const getPayConfig = async () => {
    try {
          const configRef = doc(db, "configurations", "paySettings");
          const paySettingsSnap = await getDoc(configRef);
          if (paySettingsSnap.exists()) {
              return paySettingsSnap.data();
          } else {
              console.log("No paySettings data found!");
          }
    } catch (error) {
        console.error("Error fetching pay configuration:", error);
        throw error;
    }
};


const shiftsSessionHours = (shift) => {
  let totalHours = 0;
  for (const session of shift) {
      const hours = (session.endTimeTimestamp - session.startTimeTimestamp) / (1000 * 60 * 60);
      totalHours += hours;
  }
  return totalHours;
};



export const calculateTotalPayForAllEmployeesID = async (employeeID, startTimeStamp, endTimeStamp) => {
  //Get all session that occured in pay week
  const sessionsAfterPayPeriodStart = await getSessionsAfterTimeForEmployee(startTimeStamp, endTimeStamp, employeeID)

  if(sessionsAfterPayPeriodStart == NaN ){
    return NaN
  }
  //add Pay for each session
  for( const session of sessionsAfterPayPeriodStart){
   
    session.pay = await calculateSessionPay(session, employeeID)
  }

  
  //Group sessions into shifts
  const shifts = await groupSessionsIntoShifts(sessionsAfterPayPeriodStart)
  console.log("shifts", employeeID,  shifts)
  //Add extra time to shift
  const paySettings = await getPayConfig()

  const additionalTimeHours = paySettings["timeInMinutesAddedToEachShift"] / 60;

  let totalHours = 0; // Initialize total hours
  let totalShiftHours = 0; // Initialize total hours
  let inClassHours = 0
  let ticketInClassTime = 0
  let transportHours = 0
  Object.keys(shifts).forEach(shiftKey => {
      // Parse start and end times using moment with the appropriate format
      const startOfShift = moment(shifts[shiftKey].shiftStartTime, 'h:mm A');
      const endOfShift = moment(shifts[shiftKey].shiftEndTime, 'h:mm A');
  
      // Ensure the end time is always after the start time
      // if (endOfShift.isBefore(startOfShift)) {
      //     endOfShift.add(1, 'day'); // This accounts for shifts that end after midnight
      // }
  
      // Calculate duration in hours, including fractions of an hour
      let durationHours = shiftsSessionHours(shifts[shiftKey])
      durationHours += additionalTimeHours;
      
      shifts[shiftKey]["hours"] = Number(durationHours.toFixed(2)); // Set duration in hours for the shift
      totalShiftHours += Number(durationHours.toFixed(2)); // Add to total hours
      shifts[shiftKey]["additionalTimeHours"] = additionalTimeHours;
      console.log(shifts[shiftKey])
      const inClassPay =  shifts[shiftKey].reduce((acc, session) => {
        console.log(acc, session)
        return acc + session.pay.teachersPay
      } , 0);

      shifts[shiftKey]["totalShiftPay"] = durationHours * shifts[shiftKey][0].pay.teachersPayRate;
  });


  const shiftInClassPay = Object.values(shifts).reduce((acc, shift) => acc + shift.totalShiftPay, 0);
  const shiftInClassPayRounded = Math.round(shiftInClassPay * 100) / 100;
  shifts["totalShiftPay"] = shiftInClassPayRounded;
  
  // Get Tickets
  const tickets = await getAllTicketsForEmployeeForWeek(employeeID, startTimeStamp);

  // Filter out tickets that have already been paid
  // const unpaidTickets = tickets.filter(ticket => ticket.payed === false || ticket.payed === undefined);

  // Calculate pay for unpaid tickets
  const ticketsToBePaidAmounts = await calculateTicketPay(tickets);


  ticketsToBePaidAmounts.forEach(ticket => {
    if(ticket.ticketType == "commute"){
      transportHours += ticket.numMinutes / 60
    } else {
      inClassHours += ticket.numMinutes / 60
    }
  })

  // Calculate total ticket pay
  const totalTicketPay = ticketsToBePaidAmounts.reduce((acc, ticket) => acc + ticket.pay, 0);

  // Round total ticket pay to 2 decimal places
  ticketsToBePaidAmounts["totalTicketPay"] = Math.round(totalTicketPay * 100) / 100;

  // Calculate total pay
  const totalPay = shiftInClassPayRounded + totalTicketPay;

  inClassHours += totalShiftHours + ticketInClassTime 

  const totalHoursRounded = Math.round(totalHours * 100) / 100;
  shifts["totalHours"] = totalHoursRounded;
  
  // Combine data
  const combinedData = { shifts: shifts, tickets: ticketsToBePaidAmounts, totalPay: totalPay, totalHours: totalHoursRounded, inClassHours: inClassHours, transportHours: transportHours };
 
  return combinedData;

}

export const getAllTeachers = async (id) => { 
    
  const teachers = [];
  const querySnapshot  = await getDocs(query(collection(db, "employees"), where("activeTeacher", "==", true)));
  
  querySnapshot.forEach((doc) => {
    
      teachers.push(doc.data());
  });
  
  
  return teachers;
};

export const calculateTotalPayForAllEmployees = async (startTimeStamp, endTimeStamp) => {
  const teachers = await getAllTeachers();

  // Create an array of promises, each promise represents the asynchronous operation
  // of calculating the total pay for an individual teacher
  const payCalculationPromises = teachers.map(teacher => {
      return calculateTotalPayForAllEmployeesID(teacher.id, startTimeStamp, endTimeStamp)
          .then(data => {
              return { id: teacher.id, name: teacher.name, data: data };
          });
  });

  // Wait for all the promises to resolve
  const results = await Promise.all(payCalculationPromises);

  // Convert the array of results into a more convenient object format
  const teacherData = {};
  results.forEach(result => {
      teacherData[result.id] = {
          name: result.name,
          payData: result.data
      };
  });

  return teacherData;
};


function formatTimestamp(timestamp) {
  const date = moment(timestamp);
  return {
    weekNumber: date.isoWeek(),
    year: date.year()
  };
}


//ticketIDs Array
//startTimeStamp timestamp in week
export const markAsPayed = async (startTimeStamp, endTimeStamp, ticketIDs, payData) => {
  const formattedStartTimeStamp = formatTimestamp(startTimeStamp);

  const paymentData = {
    weekInfo: formattedStartTimeStamp,
    startTimeStamp: startTimeStamp,
    endTimeStamp: endTimeStamp,
    ticketIDs: ticketIDs,
    payData: payData,
    payed: true,
  };

  try {
    // Create a new document in the weeklyPayment collection
    const docRef = await addDoc(collection(db, "weeklyPayment"), paymentData);
    console.log("Document written with ID: ", docRef.id);

    // Update each ticket in the tickets collection
    for (const ticketID of ticketIDs) {
      const ticketsQuery = query(collection(db, "tickets"), where("id", "==", ticketID));
      const querySnapshot = await getDocs(ticketsQuery);
      querySnapshot.forEach(async (doc) => {
        const ticketRef = doc.ref;
        await updateDoc(ticketRef, {
          payedWeek: formattedStartTimeStamp.weekNumber,
          payYear: formattedStartTimeStamp.year,
          payed: true,
         
        });
      });
    }

    return docRef.id;  // Optionally return the document ID
  } catch (e) {
    console.error("Error adding document or updating tickets: ", e);
    throw e;  // Rethrow the error for further handling
  }
};