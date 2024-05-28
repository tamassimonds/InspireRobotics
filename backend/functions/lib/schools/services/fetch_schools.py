


from lib.schools.schools import School

from utils.firebase_config import db

class SchoolFetcher:

    
    @staticmethod
    def get_all_schools() -> list[School]:
        pass

    @staticmethod
    def get_school_by_id(id:str) -> School:
        if not id:
            raise ValueError('Invalid programID passed: missing programID field')
     
        query = db.collection("schools").where('id', '==', id)
        documents = query.stream()

        if documents is None:
            print("No school found with the given ID")

            return None
        for doc in documents:
            
            doc_dict = doc.to_dict()

            return School.db_to_obj(doc_dict)

    