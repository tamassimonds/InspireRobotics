import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useState } from 'react';
import { getEmployeeAvailabilityAndExceptions } from "lib/firebase/employeeFirebaseLogic"
import moment from 'moment'; // Import moment

export default function EmployeeCalendar({ employeeID, update }) {
  const [events, setEvents] = useState([]);
  const numberOfWeeksToShow = 52; // Define how many weeks to show

  const mapDayToMultipleWeeks = (day, time) => {
    const dayMapping = { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };
    let dates = [];
    for (let weekOffset = 0; weekOffset < numberOfWeeksToShow; weekOffset++) {
        const weekStart = moment().startOf('week').add(dayMapping[day] + (weekOffset * 7), 'days');

        // Use match to find time components and handle null case
        const timeMatch = time.match(/(\d+):(\d+) (AM|PM)/);
        if (timeMatch === null) {
            console.error('Invalid time format');
            return []; // Or handle the error in a way that suits your application
        }
        const [hours, minutes, modifier] = timeMatch.slice(1);

        const hourOffset = modifier === 'PM' && hours !== '12' ? 12 : 0;
        const dateTime = weekStart.clone().add(parseInt(hours) % 12 + hourOffset, 'hours').add(parseInt(minutes), 'minutes');
        dates.push(dateTime.toISOString());
    }
    return dates;
};


  useEffect(() => {
    if (!employeeID) return;

    getEmployeeAvailabilityAndExceptions(employeeID).then((data) => {
      const availabilityEvents = data.weekly.flatMap((availability) => {
        return mapDayToMultipleWeeks(availability.day, availability.startTime)
          .map(startDateTime => {
            const startMoment = moment(startDateTime);
            const endMoment = startMoment.clone().add(moment(availability.endTime, 'hh:mm A').diff(moment(availability.startTime, 'hh:mm A')));
            return {
              title: "Available",
              start: startMoment.toISOString(),
              end: endMoment.toISOString(),
              color: "green"
            };
          });
      });

      const exceptionEvents = data.exceptions.map((exception) => {
        return {
          title: "Exception",
          start: moment(exception.startDateTimestamp).toISOString(),
          end: moment(exception.endDateTimestamp).toISOString(),
          color: "red"
        };
      });

      setEvents([...availabilityEvents, ...exceptionEvents]);
    });
  }, [employeeID, update]);

  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        center: 'title', // Removes navigation buttons
      }}
      fixedWeekCount={false} // Ensures the calendar doesn't stretch to fill 6 weeks
      events={events}
      slotMinTime="06:00:00"
      slotMaxTime="21:00:00"
      weekends={true}
    />
  );
}