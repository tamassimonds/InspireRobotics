from datetime import datetime, timedelta
import time

class GetDates:

    @staticmethod
    def get_tomorrow_timestamp():
        """
        Returns the timestamp of tomorrow at midnight.
        """
        now = datetime.now()
        # Calculate tomorrow's date by adding 1 day to the current date
        tomorrow = now + timedelta(days=1)
        # Replace hours, minutes, seconds, and microseconds with 0 to get midnight
        midnight_tomorrow = datetime(tomorrow.year, tomorrow.month, tomorrow.day, 0, 0, 0)
        # Convert datetime object to timestamp
        return int(time.mktime(midnight_tomorrow.timetuple())) * 1000
    
    @staticmethod
    def get_day_in_week_timestamp():
        """
        Returns the timestamp of tomorrow at midnight.
        """
        now = datetime.now()
        # Calculate tomorrow's date by adding 7 day to the current date
        tomorrow = now + timedelta(days=7)
        # Replace hours, minutes, seconds, and microseconds with 0 to get midnight
        midnight_tomorrow = datetime(tomorrow.year, tomorrow.month, tomorrow.day, 0, 0, 0)
        # Convert datetime object to timestamp
        return int(time.mktime(midnight_tomorrow.timetuple())) * 1000
    
    @staticmethod
    def get_current_timestamp():
        """
        Returns the current timestamp.
        """
        # Get the current time and convert it to a timestamp
        now = datetime.now()
        return int(time.mktime(now.timetuple()))* 1000