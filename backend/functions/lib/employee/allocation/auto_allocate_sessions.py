from concurrent.futures import ThreadPoolExecutor, as_completed
from lib.employee.employee import Employee
from lib.locations.region import Region
from lib.sessions.services.session_fetch_service import SessionFetchService
from lib.employee.allocation.get_employee_available import GetEmployeeAvailability

class AutoAllocateSessions():

    @staticmethod
    def get_all_sessions_and_employees_available(start_time_time_stamp: int, end_time_time_stamp:int, region:Region = None) -> dict:
        """
        Get all employees who are available in the specified period, fetching data concurrently for efficiency.
        
        Args:
            start_time_time_stamp (int): The start time of the specified period in timestamp millisecond format.
            end_time_time_stamp (int): The end time of the specified period in timestamp millisecond format.
            region (Region, optional): The region to filter employees by. Defaults to None.
        
        Returns:
            dict: A dictionary containing session IDs as keys and a tuple of available employees and session details as values.
        """
        # Fetch all sessions within the specified time period
        sessions = SessionFetchService.get_all_session_within_time_period(start_time_time_stamp, end_time_time_stamp)
        
        for session in sessions:
            print(session.program.locationAddress)
        
        sessionEmployeesAvailable = {}
        
        # Create a ThreadPoolExecutor to manage a pool of threads
        with ThreadPoolExecutor() as executor:
            # Dictionary to hold Future objects, with session ID as key for easy retrieval
            future_to_session = {executor.submit(GetEmployeeAvailability.get_all_employees_in_region_available_in_period_func, session.startTimeTimestamp, session.endTimeTimestamp, region): session for session in sessions}
            
            # Collect results as they complete
            for future in as_completed(future_to_session):
                session = future_to_session[future]
                try:
                    employeesAvailable = future.result()
                except Exception as exc:
                    print(f'Session {session.sessionID} generated an exception: {exc}')
                else:
                    sessionEmployeesAvailable[session.sessionID] = (employeesAvailable, session)

        return sessionEmployeesAvailable





    @staticmethod
    def auto_allocate_sessions(start_time_time_stamp: int, end_time_time_stamp:int, region:Region = None) -> dict:
        if not isinstance(start_time_time_stamp, int) or not isinstance(end_time_time_stamp, int):
            raise TypeError("start_time and end_time must be ints representing the timestamp")
        

        sessionsTeachers = AutoAllocateSessions.get_all_sessions_and_employees_available(start_time_time_stamp, end_time_time_stamp, region)

        print(sessionsTeachers)
        # Implement the allocation logic here

