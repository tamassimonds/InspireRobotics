import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { getAllProgramClassesSessions } from '/lib/firebase/library';
import ProgramSearch from '/components/search/ProgramSearch';
import { useRouter } from 'next/navigation';

export default function AllProgramCalendar({ programID }) {
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (programID) {
            getAllProgramClassesSessions(programID).then((data) => {
                console.log(data)
                setLoading(false);
                const { classes } = data;
                const programColor = getColorFromProgramID(programID);
                const programName = data.program.name
                const calendarEvents = [];

                classes.forEach(classData => {
                    classData.sessions.forEach(session => {
                        calendarEvents.push({
                            title: programName,
                            start: session.startTimeTimestamp,
                            end: session.endTimeTimestamp,
                            color: programColor,
                            extendedProps: {
                                programID: programID
                            }
                        });
                    });
                });
                console.log(calendarEvents)
                setEvents(calendarEvents);
            });
        }
    }, [programID]);

    const handleEventClick = (clickInfo) => {
        router.push(`/admin/programs/overview/programDetails?programID=${clickInfo.event.extendedProps.programID}`);  
    };

    return (
        <div>
            <h1>{loading ? "Loading..." : ""}</h1>
            
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

function getColorFromProgramID(programID) {
  let hash = 0;
  for (let i = 0; i < programID.length; i++) {
      const char = programID.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 255;
      color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}