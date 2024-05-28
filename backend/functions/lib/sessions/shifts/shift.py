

from typing import List, Dict
from datetime import datetime
from dataclasses import dataclass, field

from lib.sessions.sessions import Session
from lib.employee.teacher.teacher import Teacher

@dataclass
class Shift:
    shiftID: str
    date: str
    startTimeTimeStamp: datetime
    endTimeTimestamp: datetime
    programID: str
    sessions: List[Session] = field(default_factory=list)
    teachersIDs: List[str] = field(default_factory=list)
    teachers: List[Teacher] = field(default_factory=list)
    sessions: List[Session]


    def update_times_based_on_session(self, session: Session):
        if not self.startTimeTimeStamp or session.startTimeTimestamp < self.startTimeTimeStamp:
            self.startTimeTimestamp = session.startTimeTimestamp
        if not self.endTimeTimestamp or session.endTimeTimestamp > self.startTimeTimeStamp:
            self.endTimeTimestamp = session.endTimeTimestamp


    @property
    def totalSessionDurationHours(self):
        """
        Returns the total duration of all sessions in this shift in hours
        """
        total = 0
        for session in self.sessions:
            total += session.endTimeTimestamp - session.startTimeTimestamp
        return total/1000 / 3600 # Convert milliseconds to hours


    def add_session(self, session: Session):
        self.sessions.append(session)
        self.update_times_based_on_session(session)

    def add_teacher(self, teacher: Teacher):
        if teacher not in self.teachers:
            self.teachers.append(teacher)

    def __str__(self):
        return f"Shift {self.shiftID} on {self.date} from {self.startTimeTimeStamp} to {self.endTimeTimestamp} with {len(self.sessions)} sessions and {len(self.teachersIDs)} teachers"
