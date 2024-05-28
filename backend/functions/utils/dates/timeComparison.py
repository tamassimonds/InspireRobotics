



from datetime import datetime



class TimeComparison:


    @staticmethod
    def is_time_after_time(start_time: str, end_time: str) -> bool:
        """
        Compare two time strings to determine if the second time (end_time) is after the first time (start_time).

        Args:
        start_time (str): The start time in the format 'hh:mm AM/PM'.
        end_time (str): The end time in the format 'hh:mm AM/PM'.

        Returns:
        bool: True if end_time is after start_time, otherwise False.
        """
        # Parse the time strings into datetime.time objects
        start_time_obj = datetime.strptime(start_time, '%I:%M %p').time()
        end_time_obj = datetime.strptime(end_time, '%I:%M %p').time()

        # Compare the time objects
        return start_time_obj > end_time_obj