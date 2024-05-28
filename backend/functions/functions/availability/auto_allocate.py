



from lib.employee.services.employees_fetch_service import EmployeesFetchService
from lib.employee.services.employee_service import EmployeeService

from lib.sessions.shifts.service.shift_organiser import ShiftOrganizer
from lib.sessions.services.session_fetch_service import SessionFetchService

from utils.dates.dates import DateHandler

""""
THIS IS A FIREBASE FUNC
"""
def auto_allocate_sessions_in_period(startTimeTimestamp: int, endTimeTimestamp: int):
    
    employees = EmployeesFetchService.get_all_employees()

    # for employee in employees:
    #     print(EmployeeService.get_route_for_employee(employee, "15 station rd williamstown 3016 Vic Australia"))


    sessions = SessionFetchService.get_all_session_within_time_period(startTimeTimestamp, endTimeTimestamp)
    shifts = ShiftOrganizer.group_sessions_into_shifts(sessions)

    print(DateHandler.string_datetime_to_timestamp("9:00am 2/3/2023"))

    print(shifts)