







from lib.employee.services.employee_service import EmployeeService

from lib.sessions.shifts.service.shift_organiser import ShiftOrganizer

from lib.employee.employee import Employee

from lib.sessions.shifts.shift import Shift

from lib.configurations.paySettings import PaySettings

class CalculateEmployeePay():



    def calculate_all_employee_pay_in_period(self, startTimestamp: int, endTimestamp: int) -> float:
        pass


    @staticmethod
    def calculate_shift_duration(shifts:list[Shift]) -> float:
        """
        This function calculates the total duration of all shifts applying min shift time and 15 minute added
        """
        total:float = 0
        for shift in shifts:
            shiftDuration = shift.totalSessionDurationHours

            #ADD extra MINUTES
            shiftDuration += PaySettings.time_in_minutes_added_to_each_shift/60

            #MIN SHIFT DURATION
            if shiftDuration < 2:
                shiftDuration = 2
            
            total += shiftDuration
        
        return total


    @staticmethod
    def calculate_employee_pay_in_period(employee:Employee, startTimestamp: int, endTimestamp: int) -> float:
        """
        This function calculates the pay for an employee in a given period of time.
        
        First get all the sessions they assigned in that period.
        Then group those sessions into shifts
        Then calculate the pay for each shift
        Then sum the pay for each shift 
        """

        
        assignedSesssions = EmployeeService.get_session_in_time_period(employee, startTimestamp, endTimestamp)
        shifts = ShiftOrganizer.group_sessions_into_shifts(assignedSesssions)

        hoursInShifts = CalculateEmployeePay.calculate_shift_duration(shifts)
        
        shiftPay = hoursInShifts * employee.standard_pay_rate

        




