"use client"
import React, { useEffect, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { getAllProgramsClassesSessionsForAllPrograms } from '/lib/firebase/library';
import ProgramSearch from '/components/search/ProgramSearch';

import { useRouter } from 'next/navigation';
import {getColorFromProgramID} from "/lib/utils"
export default function AllProgramCalendar() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      getAllProgramsClassesSessionsForAllPrograms().then((data) => {
          setLoading(false);
          const { allClasses } = data;
          const programColors = {}; // Object to store programID-color mapping
          const programName = {};
          const calendarEvents = [];
          const sessionIDs = []

          allClasses.forEach(programClass => {
              const programID = programClass.programID;
              
              if (!programColors[programID]) {
                  programColors[programID] = getColorFromProgramID(programID);
                  programName[programID] = programClass.name;
              }

              programClass.classes.forEach(classData => {
                  classData.sessions.forEach(session => {
                        if(sessionIDs.includes(session.sessionID)){return}
                        sessionIDs.push(session.sessionID)
                      calendarEvents.push({
                          title: programName[programID],
                          start: session.startTimeTimestamp,
                          end: session.endTimeTimestamp,
                          color: programColors[programID],
                          extendedProps: {
                              programID: programID
                          }
                      });
                  });
              });
          });

          setEvents(calendarEvents);
      });
  }, []);

  const handleEventClick = (clickInfo) => {
      const programID = clickInfo.event.extendedProps.programID;
      // Call your function with programID
      router.push(`/admin/programs/overview/programDetails?programID=${programID}`);  
  };

  return (
      <div>
          <h1>{loading ? "Loading..." : ""}</h1>
          <ProgramSearch />
          <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                  left: 'prev,next',
                  center: 'title',
                  right: 'timeGridWeek,timeGridDay'
              }}
              slotMinTime="06:00:00"
              slotMaxTime="21:00:00"
              events={events}
              eventClick={handleEventClick}
          />
      </div>
  );
}

