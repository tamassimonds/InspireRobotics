



import json

from firebase_functions import https_fn

import logging

from lib.parents import ParentService
from lib.holidayProgram import HolidayProgramService
from flask import Flask

from services.notification import NotificationService
@https_fn.on_call()
def bookingConfirmedNotification(req: https_fn.CallableRequest):
    # Access the request data through req.data
    data = req.data  # This line was missing in your original code

    # Ensure data is a dictionary (This check is redundant if data is always from req.data and can be removed)
    if not isinstance(data, dict):
        print("Invalid data type provided.")
        return {"error": "Invalid data type"}

    # Data validation
    if not data:
        print("No data provided.")
        return {"error": "No data provided."}

    program_ids = data.get("programIDs")
    parent_id = data.get("parentID")

    if not program_ids or not parent_id:
        print("Missing data: programIDs or parentID")
        return {"error": "Required data missing"}

    print("Program IDs:", program_ids) 
    print("Parent ID:", parent_id)

    try:
        # Assuming ParentService and HolidayProgramService are correctly set up
        parent = ParentService.getParentWithID(parent_id)
        print("GOT TO HERE")
        programs = [HolidayProgramService.getProgramWithID(program_id) for program_id in program_ids]
        
        print(parent, programs)
        print("Sending email to parent")
        for program in programs:
            print(f"Sending email to parent for program: {program}")

            # Assuming NotificationService is correctly set up
            NotificationService.send_parent_program_details_email(parent, program)
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": "An error occurred during processing"}

    print("Message sent successfully.")
    return {"message": "Message sent successfully."}



# def bookingConfirmedTest(data: dict) -> None:
#     # First, check if there's any data provided
#     if not data:
#         print("No data provided.")
#         # Instead of returning an HTTP response, you might log the error or handle it appropriately
#         return {"error": "No data provided"}, 400

#     # Since data is already a dictionary, we don't need to decode or parse from JSON
#     try:
#         programIDs = data["programIDs"]
#         parentID = data["parentID"]
#     except KeyError as e:
#         # Log or handle missing data errors
#         print(f"Missing data: {e}")
#         return {"error": "Required data missing"}, 400

#     print("Program IDs:", programIDs)
#     print("Parent ID:", parentID)

#     try:
#         parent = ParentService.getParentWithID(parentID)
#         programs = [HolidayProgramService.getProgramWithID(programID) for programID in programIDs]
        
#         print(parent, programs)
#         print("Sending email to parent")
#         for program in programs:
#             NotificationService.send_parent_program_details_email(parent, program)
#     except Exception as e:
#         # Log the exception or handle it as needed
#         print(f"An error occurred: {e}")
#         # Indicate there was an error in processing
#         return {"error": "An error occurred while processing your request"}, 500
    
#     # Indicate success
#     return {"success": True}, 200

# test_data = {"programIDs": ["1546d28f-883c-4ed8-aa69-87dc54edc75b", "1546d28f-883c-4ed8-aa69-87dc54edc75b"], "parentID": "91ead792-3b86-484b-a410-ffaf88939ea2"}
# result = bookingConfirmedTest(test_data)
# print(result)

