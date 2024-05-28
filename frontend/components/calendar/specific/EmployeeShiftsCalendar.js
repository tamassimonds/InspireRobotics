import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Calendar from "/components/calendar/PlainCalendar.js"; // Adjust the import path as needed
import Card from '@mui/joy/Card';
import { getAllSessionsForTeacher } from "/lib/firebase/employeeFirebaseLogic"; // Adjust the import path as needed
import { getColorFromProgramID } from "/lib/utils"; // Adjust the import path as needed

const EmployeeCalendar = ({ employeeID }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  function transformShiftsToCalendarEvents(shifts, allClasses, allPrograms) {
    let calendarEvents = [];
    const programMap = allPrograms.reduce((map, program) => {
        map[program.id] = { programName: program.name };
        return map;
    }, {});
  
    for (const [date, shiftDetails] of Object.entries(shifts)) {
      const programColors = {}; // Object to store programID-color mapping
      const programInfo = shiftDetails.programData;
      const sessionIDs = []

      shiftDetails.forEach(shift => {
        const classInfo = allClasses.find(c => c.classID === shift.classID);
  
        if (classInfo && classInfo.programID) {
          
          if (programInfo) { // Check if programInfo exists
            // If programColors for this programID has not been set, set it now
            if (!programColors[classInfo.programID]) {
              programColors[classInfo.programID] = getColorFromProgramID(classInfo.programID);
            }
            if(sessionIDs.includes(shift.sessionID)){return}
            sessionIDs.push(shift.sessionID)

            calendarEvents.push({
              title: programInfo.name,
              start: moment(shift.startTimeTimestamp).toISOString(),
              end: moment(shift.endTimeTimestamp).toISOString(),
              color: programColors[classInfo.programID],
            });
          } else {
            // Handle the case where programInfo is not found
            // You can either skip this entry or add it with default/placeholder data
            console.log(`Program info not found for programID: ${classInfo.programID}`);
            // Optional: Add with placeholder data
            // calendarEvents.push({ /* ... placeholder data ... */ });
          }
        }
      });
    }
  
    return calendarEvents;
  }

  useEffect(() => {
    if (employeeID) {
      setLoading(true);
      getAllSessionsForTeacher(employeeID).then((data) => {
        const calendarFormattedData = transformShiftsToCalendarEvents(data.shifts, data.allClasses, data.allPrograms);
        setCalendarEvents(calendarFormattedData);
        setLoading(false);
      });
    }
  }, [employeeID]);

  return (
    <Card>
      {loading ? <p>Loading...</p> : <Calendar events={calendarEvents} />}
    </Card>
  );
};

EmployeeCalendar.propTypes = {
  employeeID: PropTypes.string.isRequired
};

export default EmployeeCalendar;