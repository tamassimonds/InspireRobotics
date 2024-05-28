



from lib.sessions.sessions import Session
from lib.sessions.services.session_fetch_service import SessionFetchService

from lib.programs.programs import Program
from lib.programs.services.fetch_program import FetchPrograms

from lib.programs.services.program_sessions_services import ProgramSessionService

from lib.sessions.services.session_service import SessionService


class CurriculumFetcher:

    @staticmethod
    def calculate_curriculum(programID):
        """
        Calculate which curriculum is appropriate for a program based on the program's ID.

        if private program check if has one for holiday module 
        duplication issue around holiday program 
        holiday program vs afte4r school 
        """
        program:Program = FetchPrograms.fetch_program_with_id(programID)
        num_tutorials_in_program = ProgramSessionService.get_num_tutorials_in_program(programID)
        
        print(program)
        

    @staticmethod
    def fetch_program_curriculum(programID, sessionID):
        CurriculumFetcher.calculate_curriculum(programID)
        sessionIndex = SessionService.calculate_session_index(sessionID)
        tutorialIndex = SessionService.calculate_session_tute_index(sessionID)
        """
        Need to calculate which curriculum is appropriate for a program based on the program's ID.
        Need to then check if that curriculum exists
        If not 
        """
        pass
        