


from firebase_functions import firestore_fn, https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore

from datetime import datetime, timedelta

from lib.programs.holiday_programs.holiday_program_module import HolidayProgramModule
from lib.programs.holiday_programs.services.holiday_program_module_service import HolidayProgramModuleService



from utils.dates.dates import DateHandler
from utils.firebase_config import db, app


class AfterSchoolProgram():
    def __init__(self, **kwargs) -> None:

        if 'id' not in kwargs:
            raise ValueError('Invalid Programs data passed: missing id field')

        self.programID = kwargs.get('id', None)
        self.courseID = kwargs.get('courseID', None)
        self.courseName = kwargs.get('courseName', None)
        self.dates = kwargs.get('dates', [])
        self.enrolledParents = kwargs.get('enrolledParents', [])
        self.enrolledStudents = kwargs.get('enrolledStudents', [])
        self.holidayProgramModuleID = kwargs.get('holidayProgramModuleID', None)
        self.isAfterSchoolProgram = kwargs.get('isAfterSchoolProgram', False)
        self.isHolidayProgram = kwargs.get('isHolidayProgram', False)
        self.isSchoolProgram = kwargs.get('isSchoolProgram', False)
        self.lastUpdated = kwargs.get('lastUpdated', None)
        self.locationAddress = kwargs.get('locationAddress', None)
        self.locationName = kwargs.get('locationName', None)
        self.maxCapacity = kwargs.get('maxCapacity', None)
        self.openToPublic = kwargs.get('openToPublic', False)
        self.otherNotes = kwargs.get('otherNotes', '')
        self.publishToWebsite = kwargs.get('publishToWebsite', False)
        self.deviceRequired = kwargs.get('deviceRequired', False)

        self.name = kwargs.get('name', '')  # Assuming 'name' is a direct field and not nested


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