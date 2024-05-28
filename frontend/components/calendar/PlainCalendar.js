import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function Calendar({ events }) {
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState(null);

  // Function to update the view based on screen width
  const updateViewForScreenSize = () => {
    const isMobile = window.innerWidth < 768;
    console.log(isMobile)
    setCurrentView(isMobile ? 'timeGridDay' : 'dayGridMonth');
  };

  useEffect(() => {
    updateViewForScreenSize();
    // Add event listener for window resize
    window.addEventListener('resize', updateViewForScreenSize);
    
    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('resize', updateViewForScreenSize);
  }, []);

  const handleDateClick = (arg) => {
    // Get a reference to the FullCalendar API
    const calendarApi = calendarRef.current.getApi();
    // Change to the day view and go to the clicked date
    calendarApi.changeView('timeGridDay', arg.date);
  };

  return (
    <div>
    {currentView && (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin]}
      ref={calendarRef}
      initialView={currentView}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      slotMinTime="06:00:00"
      slotMaxTime="21:00:00"
      events={events}
      contentHeight="auto"
      dateClick={handleDateClick}
      eventContent={renderEventContent}
    />
    )}
    </div>
  );

  function renderEventContent(eventInfo) {
    return (
      <div>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  }
}