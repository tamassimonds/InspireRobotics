



# from lib.employee.allocation.auto_allocate_sessions import AutoAllocateSessions


# AutoAllocateSessions.auto_allocate_sessions(1713133071000, 1713565071000)


# from functions.programs.docs.getSessionDocs import getSessionDocs


# getSessionDocs("edd9a319-8f6c-4317-acb5-99190468763a", "a90db17f-abde-47df-b63c-1b7cc330b916")


from lib.feedback.service.generate_feedback_tickets import GenerateFeedbackTickets


GenerateFeedbackTickets().generate_feedback_tickets_for_all_shifts_in_period(1713133071000, 1713565071000)