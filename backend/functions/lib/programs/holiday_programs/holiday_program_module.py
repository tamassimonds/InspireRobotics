# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore

from lib.courses.course import Course

from utils.firebase_config import db, app


class HolidayProgramModule:
    def __init__(self, program_data) -> None:
        self.iconImageURL = program_data.get('iconImageURL', '')
        self.largeImageURL = program_data.get('largeImageURL', '')
        self.longDescription = program_data.get('longDescription', '')
        self.name = program_data.get('name', '')  # This is the detailed name, e.g. "2HR Battle Bots (8-14)"
        self.shortDescription = program_data.get('shortDescription', '')
        self.dateResolved = program_data.get('dateResolved')
        self.dateSubmitted = program_data.get('dateSubmitted')
        self.employeeID = program_data.get('employeeID', '')
        self.employeeName = program_data.get('employeeName', '')
        self.hours = program_data.get('hours', '')
        self.programID = program_data.get('id', '')  # Using 'id' as programID
        self.lastUpdated = program_data.get('lastUpdated')
        self.maxAge = program_data.get('maxAge', '')
        self.minAge = program_data.get('minAge', '')
        self.status = program_data.get('status', '')
        self.costPerStudent = program_data.get('costPerStudent', '')
        course = program_data.get('course', '')

        self.course = Course(**course) if course else None


    @property
    def ageRangeString(self):
        return f"{self.minAge} - {self.maxAge}"
    



    # Other methods for Program
