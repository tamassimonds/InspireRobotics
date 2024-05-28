
from utils.firebase_config import db
from statistics import mode

from lib.classes.services.fetch_class import ClassFetcher


from lib.sessions.services.session_fetch_service import SessionFetchService

from lib.programs.docs.tutorials.service.group_sessions_into_tutorials import GroupSessionsIntoTutorials

class ProgramSessionService:

    @staticmethod
    def get_num_sessions_in_program(programID: str) -> int:
        query = db.collection("sessions").where('programID', '==', programID)
        results = query.get()
        return len(results)
    
    @staticmethod
    def get_length_of_program_sessions(programID: str) -> int:
        """
        returns the mode of the session lengths of all the classes 
        """
        classes = ClassFetcher.fetch_all_classes_in_program(programID)
        session_lengths = []

        for class_ in classes:
            class_sessions = SessionFetchService.fetch_all_sessions_in_class(class_.id)
            # Assuming each session has a 'length' attribute
       
            session_lengths.append(len(class_sessions))


        #TODO
        """
        If classes sessions aern't all the same raise a warning 
        """

        # Compute the mode of the session lengths
        if session_lengths:
            return mode(session_lengths)
        else:
            raise ValueError("No sessions found for the program.")
           

    @staticmethod
    def get_num_tutorials_in_program(programID: str) -> int:
        classes = ClassFetcher.fetch_all_classes_in_program(programID)
        for class_ in classes:
            class_sessions = SessionFetchService.fetch_all_sessions_in_class(class_.id)

            if(class_sessions == []):
                break

            num_tutorials = 0
            for session in class_sessions:
                num_tutorials += GroupSessionsIntoTutorials.calculate_num_tutes_in_session(session)
            return  num_tutorials