import time
from datetime import datetime, timedelta


class DateHandler():



    @staticmethod
    def isDateTimeStampAfterCurrentDateTimeStamp(dateTimestamp) -> bool:
        return dateTimestamp > time.time() * 1000
    @staticmethod
    def get_time_range(time_stamp, time_str, buffer_minutes=15) -> tuple:
        """
        Returns the drop-off or pick-up range based on the specified time string.
        
        Args:
        - time_stamp: Ignored in this updated implementation, kept for compatibility.
        - time_str: The string representation of the appointment time (e.g., "12:30 PM").
        - buffer_minutes: The number of minutes before or after the appointment to calculate the range.

        Returns:
        - A tuple of strings representing the start and end times of the range.
        """
        # Parse the time string to datetime object considering the AM/PM part
        appointment_time = datetime.strptime(time_str, '%I:%M %p')

        # Adjust the time by the specified buffer_minutes
        range_start = appointment_time - timedelta(minutes=buffer_minutes)
        range_end = appointment_time + timedelta(minutes=buffer_minutes)

        # Format the datetime objects to strings in the same format as time_str
        range_start_str = range_start.strftime('%I:%M %p')
        range_end_str = range_end.strftime('%I:%M %p')

        return range_start_str, range_end_str
    
    @staticmethod
    def string_datetime_to_timestamp(datetime_str: str) -> int:
        """
        Converts a string representation of a datetime to a timestamp.
        Assumes datetime string is of the format "9:0am 22/4/2024".
        
        Args:
        datetime_str (str): The datetime string to convert.
        
        Returns:
        int: The Unix timestamp corresponding to the given datetime string.
        """
        # Parse the datetime string into a datetime object
        dt = datetime.strptime(datetime_str, "%I:%M%p %d/%m/%Y")
        
        # Convert the datetime object to a timestamp (seconds since the Unix epoch)
        timestamp = int(time.mktime(dt.timetuple()))
        
        return timestamp

