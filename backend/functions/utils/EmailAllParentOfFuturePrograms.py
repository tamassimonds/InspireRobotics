
from firebase_functions import firestore_fn, https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore


from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from utils.dates import DateHandler

from lib.holiday_program.holiday_program import HolidayProgram

from lib.parents import Parent, ParentService

from utils.firebase_config import db, app



query = db.collection("programs").where('isHolidayProgram', '==', True)

upcomingHolidayPrograms = []


# Execute the query
documents = query.stream()
parentPrograms = []

# Iterate over the query results and do something with each document


#Filters out documents in past
for doc in documents:
    doc_dict = doc.to_dict()
    # Convert Firestore Timestamp to datetime
    
    start_date = doc_dict['dates'][0]["startDayTimeStamp"]
    print(start_date)
    # Check if the start date is after the current date and time
    if DateHandler.isDateTimeStampAfterCurrentDateTimeStamp(start_date):
        print("True")
        upcomingHolidayPrograms.append(doc_dict)


        enrolledParents = doc_dict.get('enrolledParents', [])
        if enrolledParents:
            for parent in enrolledParents:
                parentPrograms.append({'parent': ParentService.getParentWithID(parent), 'program': HolidayProgram(**doc_dict)})





SENDGRID_API_KEY  = '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'


TEMPLATE_ID = 'd-3694855ff59a422cb7bb39b316b40a04'


alreadySent = []

for data in parentPrograms:
   
    program = data['program']
    parent = data['parent']
    
    if parent.email:

        if (parent.email + program.name) not in alreadySent:
            
            print(parent.email, program.name)
            alreadySent.append(parent.email + program.name)

            # message = Mail(
            #     from_email='contactus@inspirerobotics.com.au',
            #     to_emails=parent.email,
            #     subject='Inspire Robotics: Booking Details',
            #     )
            # message.template_id = TEMPLATE_ID
            # message.dynamic_template_data = {
            #     'programName': program.name,  # The key must match the placeholder in your SendGrid template
            #     'location': program.locationName,
            #     'address': program.locationAddress,
            #     'date': program.dateString,
            #     'dropOffTimes': program.dropOffString,
            #     'pickUpTimes': program.pickUpString,
            #     'deviceNeededMessage': "Students Laptop/ipad" if program.deviceRequired else "",
            #     "programDescription": program.holidayModule.course.longDescription,
            #     "ageRange": program.holidayModule.ageRangeString,

            
            # }

            # try:
            #     sg = SendGridAPIClient(SENDGRID_API_KEY)
            #     response = sg.send(message)
            #     print(response.status_code)
            #     print(response.body)
            #     print(response.headers)
            # except Exception as e:
            #         print(e)
