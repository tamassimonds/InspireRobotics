from lib.employee.employee import Employee
from lib.employee.services.employees_fetch_service import EmployeesFetchService


from lib.sessions.services.session_fetch_service import SessionFetchService




class AutoAllocateSessions:
    def __init__(self):
        employees = EmployeesFetchService.get_all_employees()
        sessions = SessionFetchService.get_all_session_within_time_period(1714518000000, 9999999999999)
        print("got to ehre")
        for session in sessions:
            print(session)
     
    

    def allocate_sessions(self):
        # Logic to allocate sessions to employees
        pass



AutoAllocateSessions().allocate_sessions()
