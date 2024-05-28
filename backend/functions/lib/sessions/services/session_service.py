


from typing import List, Optional

from utils.firebase_config import db

from lib.sessions.sessions import Session

from datetime import datetime


from lib.sessions.services.session_fetch_service import SessionFetchService

from lib.programs.docs.tutorials.service.group_sessions_into_tutorials import GroupSessionsIntoTutorials

class SessionService:

    @staticmethod
    def calculate_session_index(session_id: str) -> int:
        """
        Returns the index of the session specified by session_id within its class,
        ordered by the session start times.

        RETURNS zero for first session
        """
        # Retrieve the session by session_id to get the classID
        session = SessionFetchService.fetch_session_with_id(session_id)
        if not session:
            raise ValueError("Session not found")

        # Query all sessions with the same classID
        query = db.collection("sessions").where('classID', '==', session.classID)
        results = query.get()

        # Convert query results to Session objects and sort them by startTimeStamp
        sessions = [Session.db_to_obj(doc.to_dict()) for doc in results if doc.exists]
        sessions_sorted = sorted(sessions, key=lambda s: s.startTimeTimestamp)

        # Find the index of the session with the given session_id
        for index, sess in enumerate(sessions_sorted):
            if sess.sessionID == session_id:
                return index

        raise ValueError("Session ID not found in the sorted list")
    
    @staticmethod
    def calculate_session_tute_index(session_id: str) -> List[int]:
        """
        Calculates the indices of tutorials within a specified session, accounting for all previous tutorials
        in the same class. Assumes each session can have multiple tutorials.

        Parameters:
        - session_id (str): The unique identifier for the session.

        Returns:
        - List[int]: A list of zero-based indices where each tutorial in the session starts, relative to the total count of tutorials.
        """
        # Retrieve the session by session_id
        session = SessionFetchService.fetch_session_with_id(session_id)
        if not session:
            raise ValueError("Session not found")

        # Fetch all sessions of the same classID, ordered by startTimeStamp
        query = db.collection("sessions").where('classID', '==', session.classID)
        results = query.get()
        sessions_sorted = sorted(
            [Session.db_to_obj(doc.to_dict()) for doc in results if doc.exists],
            key=lambda s: s.startTimeTimestamp
        )

        # Calculate the starting index for tutorials in the specified session
        tutorial_count = 0
        for sess in sessions_sorted:
            if sess.sessionID == session_id:
                break
            tutorial_count += GroupSessionsIntoTutorials.calculate_num_tutes_in_session(sess)

        # Number of tutorials in the current session
        num_tutes_in_current_session = GroupSessionsIntoTutorials.calculate_num_tutes_in_session(session)

        # Generate the indices for tutorials in the current session
        return [tutorial_count + i for i in range(num_tutes_in_current_session)]
