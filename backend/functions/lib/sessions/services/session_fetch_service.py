
from typing import List, Optional

from utils.firebase_config import db

from lib.sessions.sessions import Session

from datetime import datetime







class SessionFetchService():

    @staticmethod
    def fetch_session_with_id(id) -> Session:
        query = db.collection("sessions").where('sessionID', '==', id)
        results = query.get()
        for session_doc in results:
            data = session_doc.to_dict()
            session:Session = Session.db_to_obj(data)
            return session
        
        return None
    
    @staticmethod
    def get_all_session_within_time_period(startTimeStamp: int, endTimeStamp: Optional[int] = None) -> list[Session]:
        query = db.collection("sessions").where('startTimeTimestamp', '>=', startTimeStamp)
        results = query.get()
        sessions = []
        for session_doc in results:
            data = session_doc.to_dict()
            print(data)
            if data.get("endTimeTimestamp") is not None:
                
                if data["endTimeTimestamp"] <= endTimeStamp:
                    session:Session = Session.db_to_obj(data)
                    if session:
                        sessions.append(session)
            
        return sessions
    
    @staticmethod
    def fetch_all_session_in_program(programID: str) -> List[Session]:
        query = db.collection("sessions").where('programID', '==', programID)
        results = query.get()
        sessions = []
        for session_doc in results:
            data = session_doc.to_dict()
            session:Session = Session.db_to_obj(data)
            if session:
                sessions.append(session)
        return sessions
    
    @staticmethod
    def fetch_all_sessions_in_class(classID: str) -> List[Session]:
        query = db.collection("sessions").where('classID', '==', classID)
        results = query.get()
        sessions = []
        for session_doc in results:
            data = session_doc.to_dict()
            session:Session = Session.db_to_obj(data)
            if session:
                sessions.append(session)
        return sessions