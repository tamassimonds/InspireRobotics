from typing import List, Dict
from datetime import datetime
from dataclasses import dataclass, field

from lib.sessions.sessions import Session
from lib.sessions.shifts.shift import Shift




class ShiftOrganizer:
    
    @staticmethod
    def group_sessions_into_shifts(sessions) -> List[Shift]:
        shifts_dict: Dict[str, Shift] = {}
        test2 =sessions[1]
        for session in sessions:
            test = session
            print(test)
            print(session.date)


        for session in sessions:
            print(str(session))
            shift_id = f"{session.date}_{session.programID}"

            if shift_id not in shifts_dict:
                # Create a new Shift object if this shift_id is not already present
                shifts_dict[shift_id] = Shift(
                    shiftID=shift_id,
                    date=session.date,
                    startTimeTimeStamp=session.startTimeTimestamp,
                    endTimeTimestamp=session.endTimeTimestamp,
                    programID=session.programID,
                    sessions=[session],  # Initialize with the current session
                    teachers=session.teachersObjects,  # Assuming this initializes correctly
                    teachersIDs=session.teacherIDs,
                )
            else:
                # Update an existing Shift object
                shift = shifts_dict[shift_id]
                shift.add_session(session)
                shift.update_times_based_on_session(session)


                for teacher in session.teachersObjects:
                    if teacher not in shift.teachers:
                        shift.teachers.append(teacher)
                
                

        # Convert the shifts dictionary to a list before returning
        return list(shifts_dict.values())