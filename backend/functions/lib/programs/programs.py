from abc import ABC, abstractmethod

from dataclasses import dataclass, field
from typing import List

from lib.programs.holiday_programs.holiday_program import HolidayProgram

from lib.programs.school_programs.school_programs import SchoolProgram




@dataclass
class Program:
    id: str
    

    num_kits_needed = None
    # num_students is not in the provided image; it needs to be in the data to be set
    @property
    @abstractmethod
    def locationAddress(self):
        pass

 

    @staticmethod
    def db_to_obj(data: dict) -> "Program":
        

        # Convert strings to their appropriate types
        year_level = data.get('yearLevel', [])
        # Ensure year_level is a list of strings
        if not isinstance(year_level, list):
            year_level = [year_level]


        
        if data.get("isHolidayProgram", False):
            return HolidayProgram.db_to_obj(data)
        elif data.get("isAfterSchoolProgram", False):
            print("data", data)
            return HolidayProgram.db_to_obj(data)
            
        else:
            return SchoolProgram.db_to_obj(data)