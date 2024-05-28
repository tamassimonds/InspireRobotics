




from typing import List
from dataclasses import dataclass

from lib.employee.availability.availability import Availability
from lib.employee.availability.exception import Exception

from lib.sessions.sessions import Session

from typing import List
import logging

class CombinedAvailability:
    def __init__(self, availabilities: List[Availability], exceptions: List[Exception], assigned_sessions: List[Session] = []):
        self.availabilities = availabilities
        self.exceptions = exceptions
        self.assigned_sessions = assigned_sessions



    def is_available_in_time(self, startTimestamp: int, endTimestamp: int) -> bool:
        isAvailable = False

        # Check if the time range is within any availability periods
        
        for availability in self.availabilities:
            if availability.is_within_availability_in_range(startTimestamp, endTimestamp):
                logging.info("Checking availability for the given time range: Available.")
                print(startTimestamp, endTimestamp, availability.day)
                isAvailable =  True
        logging.info("Checking availability for the given time range.")

        # If available, check against exceptions for any overlap
        if isAvailable:
            for exception in self.exceptions:
                # Directly check for overlap with the exception.
                # There's an overlap if the start is before the exception ends AND the end is after the exception starts.
                if not (endTimestamp <= exception.start_timestamp or startTimestamp >= exception.end_timestamp):
                    isAvailable = False
                    break  # Found an overlap with an exception, so mark as not available
        
        if isAvailable:
            for session in self.assigned_sessions:
                # Directly check for overlap with the exception.
                # There's an overlap if the start is before the exception ends AND the end is after the exception starts.
                if not (endTimestamp <= session.startTimeTimestamp or startTimestamp >= session.endTimeTimestamp):
                    isAvailable = False
                    break  # Found an overlap with an exception, so mark as not available

        return isAvailable


    def __str__(self):
        totalString = ""
        for availability in self.availabilities:
            totalString += str(availability) + "\n"
     
        for exception in self.exceptions:
            totalString += str(exception) + "\n"
        return totalString
