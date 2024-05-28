


from lib.holiday_program.holiday_program import HolidayProgram







class HolidayProgramService:

    @staticmethod
    def getProgramWithID(programID):
        if not programID:
            raise ValueError('Invalid programID passed: missing programID field')
     
        query = db.collection("programs").where('id', '==', programID)
        documents = query.stream()

        if documents is None:
            print("No program found with the given ID")

            return None
        for doc in documents:
            print("got program data")
            doc_dict = doc.to_dict()

            return HolidayProgram(**doc_dict)