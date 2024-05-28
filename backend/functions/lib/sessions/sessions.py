from typing import List, Optional

from dataclasses import dataclass, field
from datetime import datetime

from lib.employee.teacher.teacher import Teacher

from dataclasses import dataclass

from utils.dates.timestampParse import TimestampParser

from lib.programs.services.fetch_program import FetchPrograms

@dataclass
class Session:
    
    teacherIDs: list[str]
    teacherNames: list[str]
    date: str
    startTimeTimestamp: int
    endTimeTimestamp: int    

    programID: str
    sessionID: str
    classID: str
    teachersObjects: Optional[List[Teacher]] = field(default_factory=list)  # Optional, defaults to an empty list

    @property
    def duration_hrs(self):
        return (self.endTimeTimestamp - self.startTimeTimestamp)/1000/3600
    
    @staticmethod
    def db_to_obj(data: dict) -> "Session":
        return Session(
           
            teacherIDs=data['teacherIDs'],
            teacherNames=data['teacherNames'],
            date=data['date'],
            startTimeTimestamp=data['startTimeTimestamp'],
            endTimeTimestamp=data['endTimeTimestamp'],
            classID=data['classID'],
            
            programID=data['programID'],
            sessionID=data['sessionID']
        )

    # @property
    # def program(self):
    #     return FetchPrograms.fetch_program_with_id(self.programID)
    

    def __str__(self):
        return f"Session {self.sessionID}:{self.date} from {self.startTimeTimestamp} to {self.endTimeTimestamp} with teachers {self.teacherNames}"