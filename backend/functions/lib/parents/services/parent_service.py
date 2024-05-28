from firebase_functions import firestore_fn, https_fn
from google.cloud.firestore import DocumentSnapshot

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore



from utils.firebase_config import db, app

from ..parents import Parent

class ParentService:

    @staticmethod
    def getParentWithID(parentID):
        print("PARENT SERVICE CALLED", parentID)
        if not parentID:
            raise ValueError('Invalid parentID passed: missing parentID field')
        
        query = db.collection("parents").where('id', '==', parentID)
        results = query.get()
        print("RESULTS", results)
        for parent_doc in results:
            print("PARENT DOC", parent_doc)
            if isinstance(parent_doc, DocumentSnapshot):
                parent_data = parent_doc.to_dict()
                parent = Parent(
                    firstName=parent_data.get('firstName'),
                    lastName=parent_data.get('lastName'),
                    email=parent_data.get('email'),
                    postCode=parent_data.get('postCode'),
                    address=parent_data.get('address'),
                    phoneNumber=parent_data.get('phoneNumber'),
                    id=parent_data.get('id', parent_doc.id)  # Use provided 'id' or Firestore document ID
                )
                return parent
        print("PARENT NOT FOUND")
        return None
    


