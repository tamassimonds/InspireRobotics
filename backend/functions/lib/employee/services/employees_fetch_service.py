

from utils.firebase_config import db

from lib.employee.employee import Employee
from datetime import datetime

class EmployeesFetchService:

    @staticmethod
    def db_to_obj(data):
        return Employee(
                name=data.get('name', ''),
                id=data.get('id', ''),
                email=data.get('email', ''),
                address=data.get('address', ''),
                date_of_birth=data.get('dateOfBirth', None) , 
                last_updated=data.get('lastUpdated', None),
                                              
                profile_image=data.get('profileImage', None),
                access_to_car=data.get('accessToCar', False),
                account_disabled=data.get('accountDisabled', False),
                active_teacher=data.get('activeTeacher', False),
                rnd_pay_rate=float(data.get('rndPayRate', None)),
                standard_pay_rate=float(data.get('standardPayRate', None)),
                transportation_pay_start=float(data.get('transportationPayStart', None))
             
            )




    @staticmethod
    def get_all_employees() -> list[Employee]:
        query = db.collection("employees").where('activeTeacher', '==', True)
        results = query.get()
        employees = []
        for employee_doc in results:
            data = employee_doc.to_dict()
            employee:Employee = EmployeesFetchService.db_to_obj(data)
            if employee:
                employees.append(employee)
            
        return employees

    @staticmethod
    def get_employee_with_id(employee_id) -> Employee:
        query = db.collection("employees").where('id', '==', employee_id)
        results = query.get()
        employees = []
        for employee_doc in results:
            data = employee_doc.to_dict()
            employee:Employee = EmployeesFetchService.db_to_obj(data)
            if employee:
                return employee
            else:
                return None

