# firebase_config.py

from firebase_admin import initialize_app, firestore,credentials

# Path to your service account JSON file
service_account_info = {
 
}


cred = credentials.Certificate(service_account_info)


# Initialize Firebase Admin SDK
app = initialize_app(cred)

# Initialize Cloud Firestore
db = firestore.client()