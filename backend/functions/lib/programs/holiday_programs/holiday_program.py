


from dataclasses import dataclass, field
from typing import List

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore

from datetime import datetime, timedelta

from lib.programs.holiday_programs.holiday_program_module import HolidayProgramModule
from lib.programs.holiday_programs.services.holiday_program_module_service import HolidayProgramModuleService



from utils.dates.dates import DateHandler
from utils.firebase_config import db, app


@dataclass
class HolidayProgram:
    programID: int = None
    courseID: int = None
    courseName: str = None
    dates: List[str] = field(default_factory=list)
    enrolledParents: List[int] = field(default_factory=list)
    enrolledStudents: List[int] = field(default_factory=list)
    holidayProgramModuleID: int = None
    isAfterSchoolProgram: bool = False
    isHolidayProgram: bool = False
    isSchoolProgram: bool = False
    lastUpdated: str = None
    locationAddress: str = None
    locationName: str = None
    maxCapacity: int = None
    openToPublic: bool = False
    otherNotes: str = ''
    publishToWebsite: bool = False
    deviceRequired: bool = False
    name: str = ''

    @staticmethod
    def db_to_obj(data: dict) -> "HolidayProgram":
        if 'id' not in data:
            raise ValueError('Invalid Programs data passed: missing id field')

        # Initialize the dataclass with data dictionary, properly handling defaults and type conversions
        return HolidayProgram(
            programID=data['id'],
            courseID=data.get('courseID'),
            courseName=data.get('courseName'),
            dates=data.get('dates', []),
            enrolledParents=data.get('enrolledParents', []),
            enrolledStudents=data.get('enrolledStudents', []),
            holidayProgramModuleID=data.get('holidayProgramModuleID'),
            isAfterSchoolProgram=bool(data.get('isAfterSchoolProgram', False)),
            isHolidayProgram=bool(data.get('isHolidayProgram', False)),
            isSchoolProgram=bool(data.get('isSchoolProgram', False)),
            lastUpdated=data.get('lastUpdated'),
            locationAddress=data.get('locationAddress'),
            locationName=data.get('locationName'),
            maxCapacity=data.get('maxCapacity'),
            openToPublic=bool(data.get('openToPublic', False)),
            otherNotes=data.get('otherNotes', ''),
            publishToWebsite=bool(data.get('publishToWebsite', False)),
            deviceRequired=bool(data.get('deviceRequired', False)),
            name=data.get('name', '')
        )
    
    @property
    def dateString(self):
        return self.dates[0]['startDate']

    @property
    def dropOffString(self):
        return self._get_drop_off_pick_up_ranges()["drop_off"]
    
    @property
    def pickUpString(self):
        return self._get_drop_off_pick_up_ranges()["pick_up"]
    
    @property
    def holidayModule(self):
        print("self.holidayProgramModuleID", self.holidayProgramModuleID)
        if not self.holidayProgramModuleID:
            return None
        
        if not hasattr(self, '_holidayModule'):
            self._holidayModule = HolidayProgramModuleService.getModuleByID(self.holidayProgramModuleID)
        return self._holidayModule
       
        

    def format_dates(self):
        self.startDateString = self.dates[0]['startDate']
        

    def _get_drop_off_pick_up_ranges(self):
        """
        Returns the drop-off and pick-up ranges for the program dates.
        """
        if not self.dates:
            return "No dates available"

        # Assuming 'dates' is a list with at least one entry, and each entry is a dict like the one you provided
        date_info = self.dates[0]  # For simplicity, using the first date entry

        # Calculate the drop-off range (15 minutes before startTime to startTime)
        drop_off_start = DateHandler.get_time_range(date_info['startTimeTimeStamp'], date_info['startTime'], buffer_minutes=15)[0]
        drop_off_end = date_info['startTime']
        # Calculate the pick-up range (endTime to 15 minutes after endTime)
        pick_up_end = DateHandler.get_time_range(date_info['endTimeTimeStamp'], date_info['endTime'], buffer_minutes=15)[1]
        pick_up_start = date_info['endTime']
  
        return {
            'drop_off': f"{drop_off_start} - {drop_off_end}",
            'pick_up': f"{pick_up_start} - {pick_up_end}"
        }
        
    def __str__(self) -> str:
        return f"Holiday Program {self.programID}: {self.name} at {self.locationName} on {self.dateString}"