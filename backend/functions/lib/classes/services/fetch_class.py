

from typing import List

from utils.firebase_config import db
from lib.classes.classes import Class




class ClassFetcher:
    @staticmethod
    def fetch_all_classes_in_program(programID: str) -> List[Class]:
        query = db.collection("classes").where('programID', '==', programID)
        results = query.get()
        classes = []
        for class_doc in results:
            data = class_doc.to_dict()
            class_:Class = Class.db_to_obj(data)
            if class_:
                classes.append(class_)
        return classes