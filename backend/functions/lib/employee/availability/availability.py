
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
import pytz  # For timezone handling

from utils.dates.daysOfWeek import DaysOfWeek

from utils.dates.timeComparison import TimeComparison
from utils.dates.timestampParse import TimestampParser

@dataclass
class Availability:
    """
    This object stores each availability given by an employee.
    """
    id: str
    day: DaysOfWeek
    start_time: str
    end_time: str
   

   
    timezone = pytz.timezone('Australia/Melbourne')
    
    @staticmethod
    def db_to_obj(data: dict) -> "Availability":

        return Availability(
            id=data['id'],
            day=DaysOfWeek(data['day']),
            start_time=data['startTime'],
            end_time=data['endTime'],
  
           
        )
    

    @property
    def start_datetime(self) -> datetime:
        return datetime.fromtimestamp(self.start_timestamp / 1000)

    @property
    def end_datetime(self) -> datetime:
        return datetime.fromtimestamp(self.end_timestamp / 1000)

    def is_timestamp_within_availability(self, timestamp: int) -> bool:
        """
        Check if a Unix timestamp falls within the availability.
        """
        # Convert timestamp to a naive datetime assuming it's in UTC
        dt_object = datetime.fromtimestamp(int(timestamp/1000), tz=self.timezone)
        time_str = dt_object.strftime('%I:%M %p')

        if TimeComparison.is_time_after_time(time_str, self.start_time):
            if not TimeComparison.is_time_after_time(time_str, self.end_time):
                return True
            

        return False

    def is_within_availability_in_range(self, start_timestamp: int, end_timestamp: int) -> bool:
        """
        Checks if a given time range falls within the availability.

        Checks 100 increments between time ranges to make sure no breaks in between are missed.
        """
        if not all(isinstance(value, int) for value in [start_timestamp, end_timestamp]):
            raise ValueError("Start Time Stamp and End Time stamp passed not ints")

        #First checks it's the correct day of week
        day: DaysOfWeek = TimestampParser.get_day_from_timestamp(start_timestamp, self.timezone)
        if (day != self.day):
            return False

        for i in range(100):
            check_datetime = start_timestamp + (end_timestamp - start_timestamp) * (i / 100)
            if not self.is_timestamp_within_availability(check_datetime):
                return False
        
        return True
        

    def __str__(self):
        return f"Available: {self.day} from {self.start_time} to {self.end_time}"