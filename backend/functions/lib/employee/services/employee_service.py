
from utils.firebase_config import db

from lib.employee.employee import Employee

from lib.sessions.sessions import Session


from utils.transportation.route import Route
from utils.transportation.get_distance_between_locations import calculate_route

class EmployeeService:
    
    def __init__(self, employee: Employee) -> None:        
        self.employee = employee


    @staticmethod
    def get_session_in_time_period(employee:Employee, startTimestamp: int, endTimestamp: int) -> float:
        sessions: list[Session] = []

        db_query = db.collection("sessions").where('teacherIDs', 'array_contains', employee.id)
        results = db_query.get()

        for session_doc in results:
            data = session_doc.to_dict()
            if data['startTimeTimestamp'] >= startTimestamp and data['endTimeTimestamp'] <= endTimestamp:
                session:Session = Session.db_to_obj(data)
                print(data)
             
                if session:
                    sessions.append(session)

        return sessions

    @staticmethod
    def get_all_session_assigned(employee:Employee) -> float:
        sessions: list[Session] = []

        db_query = db.collection("sessions").where('teacherIDs', 'array_contains', employee.id)
        results = db_query.get()

        for session_doc in results:
            data = session_doc.to_dict()
            session:Session = Session.db_to_obj(data)
            print(data)
            
            if session:
                sessions.append(session)

        return sessions
    

    @staticmethod
    def get_route_for_employee(employee:Employee, address: str) -> Route:
        print("getting route", employee.address)
        return calculate_route(employee.address, address)