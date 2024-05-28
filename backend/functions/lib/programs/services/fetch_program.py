

from datetime import datetime

from utils.firebase_config import db




from lib.programs.programs import Program


from lib.programs.holiday_programs.holiday_program import HolidayProgram

from lib.programs.school_programs.school_programs import SchoolProgram



class FetchPrograms:

    @staticmethod
    def fetch_all_programs() -> list[Program]:
        query = db.collection("programs")
        results = query.get()
        programs = []
        for program_doc in results:
            data = program_doc.to_dict()
            program = Program.db_to_obj(data)
            if program:
                programs.append(program)
        
        return programs

    @staticmethod
    def fetch_program_with_id(id) -> Program:
        query = db.collection("programs").where('id', '==', id)
        results = query.get()
        for program_doc in results:
            data = program_doc.to_dict()
            program:Program = Program.db_to_obj(data)
            return program
        
        return None

    @staticmethod

    def get_all_upcoming_programs() -> list[Program]:
        current_timestamp_ms = int(datetime.now().timestamp() * 1000)
        query = db.collection("programs").where('startDateTimeStamp', '>=', current_timestamp_ms)
        results = query.get()
        programs = []
        for program_doc in results:
            data = program_doc.to_dict()
            program:Program = Program.db_to_obj(data)
            if program:
                programs.append(program)
        
        return programs


    @staticmethod
    def get_programs_in_time_range(startTimeTimeStamp: int, endTimeTimeStamp: int) -> list[HolidayProgram, SchoolProgram]:

        query = db.collection("programs").where('startDateTimeStamp', '>=', startTimeTimeStamp)
        results = query.get()
        programs = []
        for program_doc in results:
            data = program_doc.to_dict()
            print(data)
            if data['startDateTimeStamp'] <= endTimeTimeStamp:
                program:Program = Program.db_to_obj(data)
                if program:
                    programs.append(program)
            
        return programs
