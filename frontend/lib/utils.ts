export function UUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r: number = Math.random() * 16 | 0;
      const v: number = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  interface WeekStartAndEnd {
    weekStartDate: Date;
    weekEndDate: Date;
  }
  
  function getWeekStartAndEnd(timestamp: number): WeekStartAndEnd {
    // Given timestamp will return the start and end date of the week that the timestamp is in.
    const date: Date = new Date(timestamp);
    
    // Calculate the number of days to subtract to get to the previous Monday.
    const daysToMonday: number = (date.getDay() + 6) % 7;
    
    // Calculate the Monday start date.
    const weekStartDate: Date = new Date(date);
    weekStartDate.setDate(date.getDate() - daysToMonday);
    weekStartDate.setHours(0, 0, 0, 0);
  
    // Calculate the Sunday end date.
    const weekEndDate: Date = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);
    weekEndDate.setHours(23, 59, 59, 999);
  
    return {
      weekStartDate,
      weekEndDate,
    };
  }

  export function getColorFromProgramID(programID) {
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