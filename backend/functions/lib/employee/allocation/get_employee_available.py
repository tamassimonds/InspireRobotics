




from lib.employee.services.employees_fetch_service import EmployeesFetchService

from lib.employee.employee import Employee

from lib.locations.region import Region


class GetEmployeeAvailability():


    @staticmethod
    def get_all_employees_in_region_available_in_period_func(start_time: str, end_time:str, region:Region) -> list[Employee]:
        """
        Get all employees who are available in the specified period.
        """
        employees = EmployeesFetchService.get_all_employees()
        available_employees = []

        for employee in employees:
            if employee.is_available_in_range(start_time, end_time):
                available_employees.append(employee)

        return available_employees
    