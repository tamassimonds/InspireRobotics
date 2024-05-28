from dataclasses import dataclass
from typing import List, Optional


@dataclass
class Class:
    id: str
    programID: str
    numStudents: int = 25
    yearLevel: Optional[List[str]] = None
    
    @staticmethod
    def db_to_obj(data: dict):
        if data.get("classID") is None:
            return ValueError("classID is required")
        
        id = data.get("classID")
        programID = data.get("programID")
        numStudents = data.get("numStudents", 25)  # Default to 25 if not provided
        yearLevel = data.get("yearLevel")
        
        return Class(id, programID, numStudents, yearLevel)


   
    