





from lib.feedback.service.fetch_feedback_tickets import FetchFeedbackTickets








class HandleTicketReminderService():
    
    def execute(self):
        uncompletedTickets = FetchFeedbackTickets.fetch_all_uncompleted()

        for ticket in uncompletedTickets:
            ticket.send_reminder()









