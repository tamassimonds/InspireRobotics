
class HolidayProgramModuleService:
    @staticmethod
    def getModuleByID(moduleID):

        if not moduleID:
            raise ValueError('Invalid moduleID passed: missing moduleID field')

        query = db.collection("holidayProgramModules").where('id', '==', moduleID)
        results = query.stream()

      

        # Iterate over the generator to get documents
        for doc in results:
            # Assuming each ID is unique, there should only be one result
            if doc.exists:
                return HolidayProgramModule(doc.to_dict())  # Return the document's data as a dictionary
            
            print("No module found with ID", moduleID)
        else:
            return None

    # Add other static methods as needed for interacting with the Program data in your database