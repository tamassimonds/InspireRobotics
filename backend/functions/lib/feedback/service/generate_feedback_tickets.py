from utils.firebase_config import db
from lib.sessions.shifts.service.shift_organiser import ShiftOrganizer
from lib.sessions.services.session_fetch_service import SessionFetchService
from typing import List

from lib.feedback.config.questions_config import CLASS_FEEDBACK_QUESTION_TYPES

from lib.programs.services.fetch_program import FetchPrograms

class FeedbackTicket:
    def __init__(self, teacherID: str, teachersIDs: List[str], shiftID: str, programID: str, dateTimeStamp: int, questions: List[str], inputTypes: List[str], id: str, type:str, courseID: str = None):
        self.teacherID = teacherID
        self.teachersIDs = teachersIDs
        self.shiftID = shiftID
        self.programID = programID
        self.dateTimeStamp = dateTimeStamp
        self.questions = questions
        self.inputTypes = inputTypes
        self.id = id
        self.type = type
        self.feedbackStatus = 'pending'
        self.courseID = courseID

class GenerateFeedbackTickets:
    def create_feedback_ticket(self, ticket: FeedbackTicket):
        # Convert the FeedbackTicket object into a dictionary for Firebase
        feedback_ticket = vars(ticket)
        
        # Add the feedback ticket to Firestore database
        _, doc_ref = db.collection('employeeFeedback').add(feedback_ticket)
        
        # Add questions as a subcollection under the created feedback ticket
        questions_collection = db.collection('employeeFeedback').document(doc_ref.id).collection('questions')
        for question, inputType in zip(ticket.questions, ticket.inputTypes):
            question_doc = {
                'question': question,
                'inputType': inputType
            }
            questions_collection.add(question_doc)

    def generate_id(self, teacherID: str, programID: str, dateTimeStamp: int) -> str:
        return f"{teacherID}_{programID}_{dateTimeStamp}"

    def check_if_feedback_ticket_already_exists(self, id: str) -> bool:
        feedback_tickets_collection = db.collection('employeeFeedback')
        query = feedback_tickets_collection.where('id', '==', id)
        documents = query.get()
        return len(documents) > 0
    
    def get_questions_for_type(self, type: str) -> List[str]:
        if type == 'class':
            return CLASS_FEEDBACK_QUESTION_TYPES
        return []


    def generate_feedback_tickets_for_shift(self, shift):
        
        type = 'class'
        questionType = self.get_questions_for_type(type)
        questions = [question for question, _ in questionType]
        inputTypes = [inputType for _, inputType in questionType]
         
        for teacherID in shift.teachersIDs:
            if teacherID:
                id = self.generate_id(teacherID, shift.programID, shift.date)
                #Checks if ticket already exists
                if not self.check_if_feedback_ticket_already_exists(id):
                    program = FetchPrograms.fetch_program_with_id(shift.programID)
                    ticket = FeedbackTicket(teacherID, shift.teachersIDs, shift.shiftID, shift.programID, shift.startTimeTimeStamp, questions, inputTypes, id, type, program.course_id)
                    self.create_feedback_ticket(ticket)
    

    def generate_feedback_tickets_for_all_shifts_in_period(self, startTimestamp: int, endTimestamp: int):
        sessions = SessionFetchService.get_all_session_within_time_period(startTimestamp, endTimestamp)
        shifts = ShiftOrganizer.group_sessions_into_shifts(sessions)
        for shift in shifts:
            self.generate_feedback_tickets_for_shift(shift)

    def generate_employee_peer_feedback_tickets(self, startTimestamp: int, endTimestamp: int):
        pass

