



from lib.programs.services.fetch_program import FetchPrograms
from lib.sessions.services.session_fetch_service import SessionFetchService

from utils.dates.getDay import GetDates 



def handle_generating_holiday_program_feedback():
    pass


def handle_generating_peer_feedback_ticket():
    """
    Handles generating a peer feedback ticket for each employee in a shift

    Doesn't do every shift just every 1 in 4 shifts -- to cumbersome to do every shift

    
    """
    1712793972
    

    upcomingPrograms = FetchPrograms.get_programs_in_time_range(GetDates.get_current_timestamp(), GetDates.get_tomorrow_timestamp()*5)
    upcomingSessions = SessionFetchService.get_all_session_within_time_period(GetDates.get_current_timestamp(), GetDates.get_tomorrow_timestamp()*5)
    



    

    pass




def handle_generating_feedback_ticket():
    """
    Day before the shift should generate a feedback ticket
    
    
    Gets all sessions in the next 24 hours
    Groups them into shifts
    For each shift, generate a feedback ticket for each employee

    """

    pass


