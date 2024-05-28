



from firebase_functions import https_fn



from lib.employee.services.employees_fetch_service import EmployeesFetchService

from lib.sessions.shifts.service.shift_organiser import ShiftOrganizer
from lib.sessions.services.session_fetch_service import SessionFetchService


"""
Returns if the employee is available in a time frame 

PARAMS:
startTimeTimestamp: int
endTimeTimestamp: int
employeeID: str

Returns:
{
    "isAvailable": bool
}
"""
@https_fn.on_call()
def isEmployeeAvailableInRange(req: https_fn.CallableRequest) -> any:
    # Extract the required fields from the authentication token
    employee_id = req.auth.token.get("employeeID", "")
    start_time_timestamp = req.auth.token.get("startTimeTimestamp", "")
    end_time_timestamp = req.auth.token.get("endTimeTimestamp", "")

    # Check if any of the required inputs is missing or empty
    if not employee_id or not start_time_timestamp or not end_time_timestamp:
        raise https_fn.HttpsError("invalid-argument", "Missing required fields. Ensure 'employeeID', 'startTimeTimestamp', and 'endTimeTimestamp' are provided.")

    # Fetch the employee record
    employee = EmployeesFetchService.get_employee_with_id(employee_id)
    if not employee:
        raise https_fn.HttpsError("not-found", f"No employee found with ID {employee_id}")

    # Check availability in the provided time range
    try:
        is_available = employee.is_available_in_range(start_time_timestamp, end_time_timestamp)
    except ValueError:  # Assuming ValueError for an invalid timestamp for simplicity
        raise https_fn.HttpsError("invalid-argument", "Invalid timestamps provided. Please provide valid timestamps.")

    # Return the availability status if no exceptions were raised
    return {"isAvailable": is_available}

