import pytest
from datetime import datetime, timedelta
from lib.sessions.shifts.shift import Shift
from lib.sessions.sessions import Session
from lib.employee.teacher.teacher import Teacher
from lib.sessions.shifts.service.shift_organiser import ShiftOrganizer  # Adjust the import path as necessary

# Mock classes or fixtures
@pytest.fixture
def mock_sessions():
    session1_time = datetime.now()
    session2_time = session1_time + timedelta(hours=25)

    teacher1 = Teacher(
        id="T1",
        name="Teacher One",
        email="teacher.one@example.com",
        address="123 Main St, Anytown",
        date_of_birth=datetime(1980, 1, 1)
    )
    teacher2 = Teacher(
        id="T2",
        name="Teacher Two",
        email="teacher.two@example.com",
        address="456 Elm St, Anycity",
        date_of_birth=datetime(1982, 2, 2)
    )
    session1 = Session(
        sessionID="S1",
        date=session1_time.strftime('%Y-%m-%d'),
        startTimeTimestamp=session1_time,
        endTimeTimestamp=session1_time + timedelta(hours=2),
        programID="P1",
        teacherIDs=["T1"],
        teacherNames=["Teacher One"],
        teachersObjects=[teacher1]
    )

    session2 = Session(
        sessionID="S2",
        date=session2_time.strftime('%Y-%m-%d'),
        startTimeTimestamp=session2_time,
        endTimeTimestamp=session2_time + timedelta(hours=2),
        programID="P1",
        teacherIDs=["T2"],
        teacherNames=["Teacher Two"],
        teachersObjects=[teacher2]
    )

    return [session1, session2]

def test_group_sessions_into_shifts(mock_sessions):
    shifts = ShiftOrganizer.group_sessions_into_shifts(mock_sessions)

    # Verify that two shifts have been created
    assert len(shifts) == 2, "Should create two shifts for sessions on different days"

    # Verify that the shifts contain correct sessions and teachers
    for shift in shifts:
        assert len(shift.sessions) == 1, "Each shift should contain one session"
        assert len(shift.teachers) == 1, "Each shift should contain one teacher"

        session = shift.sessions[0]
        teacher = shift.teachers[0]

        assert session in mock_sessions, "The session in the shift should be one of the mock sessions"
        assert teacher.id in session.teacherIDs, "The teacher in the shift should match the session's teacher"

if __name__ == "__main__":
    pytest.main()
