from dataclasses import dataclass, field
from typing import List, Optional

from lib.schools.services.fetch_schools import SchoolFetcher



@dataclass
class SchoolProgram():
    course_id: str
    course_name: str
    end_date: str
    end_date_time_stamp: int
    id: str
    in_school_classroom_name: str
    in_school_equipment_location: str
    is_holiday_program: bool
    is_school_program: bool
    last_updated: str
    name: str
    other_notes: str
    program_confirmed: bool
    revenue: float
    school_id: str
    school_name: str
    start_date: str
    start_date_time_stamp: int
    year_level: List[str]
    num_kits_needed: Optional[int] = None
    num_students: Optional[int] = None
    _school: Optional[any] = None 
    # num_students is not in the provided image; it needs to be in the data to be set

    @staticmethod
    def db_to_obj(data: dict) -> "SchoolProgram":
        return SchoolProgram(
            course_id=data['courseID'],
            course_name=data['courseName'],
            end_date=data['endDate'],
            end_date_time_stamp=int(data['endDateTimeStamp']),
            id=data['id'],
            in_school_classroom_name=data.get('inSchoolClassroomName'),
            in_school_equipment_location=data.get('inSchoolEquipmentLocation'),
            is_holiday_program=bool(data.get('isHolidayProgram', False)),  # Ensuring boolean type
            is_school_program=bool(data.get('isSchoolProgram', False)),  # Ensuring boolean type
            last_updated=data.get('lastUpdated'),
            name=data['name'],
            other_notes=data['otherNotes'],
            program_confirmed=bool(data.get('programConfirmed', False)),  # Ensuring boolean type
            revenue=float(data['revenue']) if data.get('revenue') is not None else None,  # Safeguard for None
            school_id=data['schoolID'],
            school_name=data['schoolName'],
            start_date=data['startDate'],
            start_date_time_stamp=int(data['startDateTimeStamp']),
            year_level=data.get('yearLevel', []),
            num_students=data.get('numStudents')  # Assuming this is sometimes included in the data
        )

    @property
    def school(self):
        if self._school:
            return self._school
        else:
            return SchoolFetcher.get_school_by_id(self.school_id)

    @property
    def locationAddress(self) -> str:
        return self.school.address

    def __str__(self) -> str:
        return f"School Program {self.id}: {self.name} at {self.school_name} from {self.start_date} to {self.end_date} "