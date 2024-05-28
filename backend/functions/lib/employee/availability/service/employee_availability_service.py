from lib.employee.availability.combined_availability import CombinedAvailability
from lib.employee.availability.availability import Availability
from lib.employee.availability.exception import Exception



from lib.sessions.sessions import Session

from utils.firebase_config import db

class EmployeeAvailabilityService:

    @staticmethod
    def get_employee_availability(employee_id: str) -> CombinedAvailability:
        # Reference the specific employee's 'weekly' subcollection
        weekly_ref = db.collection("availability").document(employee_id).collection("weekly")
        
        # Stream all documents from the 'weekly' subcollection
        weekly_docs = weekly_ref.stream()

        exceptions = db.collection("availability").document(employee_id).collection("exceptions")
        
        # Stream all documents from the 'weekly' subcollection
        exceptions_docs = exceptions.stream()
        
        db_query = db.collection("sessions").where('teacherIDs', 'array_contains', employee_id)
        results = db_query.get()


        weekly_availabilities = [Availability.db_to_obj(doc.to_dict()) for doc in weekly_docs]
        exceptions_availabilities = [Exception.db_to_obj(doc.to_dict()) for doc in exceptions_docs]
        assigned_sessions = [Session.db_to_obj(doc.to_dict()) for doc in results]


        return CombinedAvailability(weekly_availabilities, exceptions_availabilities, assigned_sessions)
        



    @staticmethod
    def db_to_object(data) -> CombinedAvailability:
        availabilities = []
        exceptions = []

        for availability in data.get('availabilities', []):
            availabilities.append(Availability(
                start_timestamp=availability['startTimestamp'],
                end_timestamp=availability['endTimestamp']
            ))

        for exception in data.get('exceptions', []):
            exceptions.append(Exception(
                start_timestamp=exception['startTimestamp'],
                end_timestamp=exception['endTimestamp']
            ))

        return CombinedAvailability(availabilities, exceptions)

   
