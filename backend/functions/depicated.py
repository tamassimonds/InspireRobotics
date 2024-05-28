# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore


from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


app = initialize_app()


SENDGRID_API_KEY  = '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'


TEMPLATE_ID = 'd-16d5ece256214800bd68e17e15f7ba12'

# @firestore_fn.on_document_created(document="parents/{pushId}")
# def bookingConfirmedEmail(event: firestore_fn.Event[firestore_fn.DocumentSnapshot | None]) -> None:
#     """Listens for new documents to be added to /messages. If the document has
#     an "original" field, creates an "uppercase" field containg the contents of
#     "original" in upper case."""
#     print("testing loggin")
#     email = event.data.get("email")
#     if not email:
#         return
#     message = Mail(
#         from_email='contactus@inspirerobotics.com.au',
#         to_emails=email,
#         subject='Inspire Robotics: Booking Confirmation',
#         )
#     message.template_id = TEMPLATE_ID
#     try:
#         sg = SendGridAPIClient(SENDGRID_API_KEY)
#         response = sg.send(message)
#         print(response.status_code)
#         print(response.body)
#         print(response.headers)
#     except Exception as e:
#         print(e)





@https_fn.on_call()
def bookingConfirmedEmail(req: https_fn.CallableRequest) -> Any:
    parentInfo = req.data["parentInfo"]
    programIDs = req.data["programIDs"]
    
    


