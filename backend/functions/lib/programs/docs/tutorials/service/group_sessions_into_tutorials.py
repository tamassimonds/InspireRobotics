from lib.sessions.sessions import Session

class GroupSessionsIntoTutorials:

    @staticmethod
    def calculate_num_tutes_in_session(session: Session) -> int:
        """
        Calculate the number of complete 1.75-hour tutorials in a session.

        Args:
        session (Session): The session for which to calculate the number of tutorials.

        Returns:
        int: The number of complete tutorials that can fit within the session duration.
        """
        duration = session.duration_hrs
        tutorial_length = 1.75  # each tutorial is 1.5 hours long

        # Calculate the number of complete tutorials that can fit in the duration
        num_tutorials = 1 + int(duration // tutorial_length)
        
        return num_tutorials