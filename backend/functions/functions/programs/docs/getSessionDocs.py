





from lib.programs.docs.curriculum.services.fetch_curriculum import CurriculumFetcher






def getSessionDocs(programID:str, sessionID:str ):
    """
    This function returns the session documentation.
    """
    return CurriculumFetcher.fetch_program_curriculum(programID, sessionID)