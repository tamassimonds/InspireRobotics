


from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


SENDGRID_API_KEY  = cd f


TEMPLATE_ID = 'd-3694855ff59a422cb7bb39b316b40a04'


class NotificationService:
    
    @staticmethod
    def send_parent_program_details_email(parent, program):
        message = Mail(
            from_email='contactus@inspirerobotics.com.au',
            to_emails=parent.email,
            subject='Inspire Robotics: Booking Details',
            )
        message.template_id = TEMPLATE_ID
        message.dynamic_template_data = {
            'programName': program.name,  # The key must match the placeholder in your SendGrid template
            'location': program.locationName,
            'address': program.locationAddress,
            'date': program.dateString,
            'dropOffTimes': program.dropOffString,
            'pickUpTimes': program.pickUpString,
            'deviceNeededMessage': "Students Laptop/ipad" if program.deviceRequired else "",
            "programDescription": program.holidayModule.course.longDescription,
            "ageRange": program.holidayModule.ageRangeString,

        
        }

        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
                print(e)
