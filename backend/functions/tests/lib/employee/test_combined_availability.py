# test_combined_availability.py
#import pytest
from dataclasses import dataclass

from lib.employee.availability.combined_availability import CombinedAvailability
from lib.employee.availability.availability import Availability
from lib.employee.availability.exception import Exception
from utils.dates.daysOfWeek import DaysOfWeek  # Assuming this is correctly defined elsewhere
from lib.sessions.sessions import Session


# Here are some pytest unit tests:
def test_availability_within_one_range():
    availabilities = [Availability(id="1", day=DaysOfWeek.MONDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = []
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert combined_availability.is_available_in_time(2000, 3000)

def test_availability_outside_range():
    availabilities = [Availability(id="2", day=DaysOfWeek.TUESDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = []
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert not combined_availability.is_available_in_time(500, 999)

def test_exception_within_availability():
    availabilities = [Availability(id="3", day=DaysOfWeek.WEDNESDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = [Exception(id="ex1", start_time="10:00", start_timestamp=2000, day=DaysOfWeek.WEDNESDAY, end_time="11:00", end_timestamp=3000)]
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert not combined_availability.is_available_in_time(2500, 2600)

def test_availability_with_multiple_ranges():
    availabilities = [
        Availability(id="4", day=DaysOfWeek.THURSDAY, start_time="08:00", end_time="09:00", start_timestamp=1000, end_timestamp=2000),
        Availability(id="5", day=DaysOfWeek.FRIDAY, start_time="09:00", end_time="10:00", start_timestamp=3000, end_timestamp=4000)
    ]
    exceptions = []
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert combined_availability.is_available_in_time(3500, 3600)
    assert not combined_availability.is_available_in_time(2500, 2600)

def test_no_availabilities():
    availabilities = []
    exceptions = []
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert not combined_availability.is_available_in_time(2000, 3000)

def test_overlapping_exceptions():
    availabilities = [Availability(id="6", day=DaysOfWeek.MONDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = [
        Exception(id="ex2", start_time="09:00", start_timestamp=1500, day=DaysOfWeek.MONDAY, end_time="10:00", end_timestamp=2500),
        Exception(id="ex3", start_time="09:30", start_timestamp=2000, day=DaysOfWeek.MONDAY, end_time="11:00", end_timestamp=3000)
    ]
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert not combined_availability.is_available_in_time(2000, 2200)

def test_exact_match_availability():
    availabilities = [Availability(id="7", day=DaysOfWeek.TUESDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = []
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert combined_availability.is_available_in_time(1000, 5000)

def test_exact_match_exception():
    availabilities = [Availability(id="8", day=DaysOfWeek.WEDNESDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = [Exception(id="ex4", start_time="10:00", start_timestamp=2000, day=DaysOfWeek.WEDNESDAY, end_time="11:00", end_timestamp=3000)]
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert not combined_availability.is_available_in_time(2000, 3000)

def test_range_starts_before_availability():
    availabilities = [Availability(id="9", day=DaysOfWeek.THURSDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = []
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert not combined_availability.is_available_in_time(500, 1500)

def test_range_ends_after_availability():
    availabilities = [Availability(id="10", day=DaysOfWeek.FRIDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = []
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert not combined_availability.is_available_in_time(4500, 5500)

def test_exception_covers_entire_availability():
    availabilities = [Availability(id="11", day=DaysOfWeek.SATURDAY, start_time="08:00", end_time="12:00", start_timestamp=1000, end_timestamp=4000)]
    exceptions = [Exception(id="ex5", start_time="08:00", start_timestamp=1000, day=DaysOfWeek.SATURDAY, end_time="12:00", end_timestamp=4000)]
    combined_availability = CombinedAvailability(availabilities, exceptions)
    assert not combined_availability.is_available_in_time(1000, 4000)



def test_session_during_availability():
    availabilities = [Availability(id="12", day=DaysOfWeek.MONDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = []
    sessions = [Session(start_timestamp=2000, end_timestamp=3000)]
    combined_availability = CombinedAvailability(availabilities, exceptions, sessions)
    assert not combined_availability.is_available_in_time(2500, 2600)

def test_session_outside_availability():
    availabilities = [Availability(id="13", day=DaysOfWeek.TUESDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = []
    sessions = [Session(start_timestamp=6000, end_timestamp=7000)]
    combined_availability = CombinedAvailability(availabilities, exceptions, sessions)
    assert combined_availability.is_available_in_time(3500, 3600)

def test_session_overlapping_start_of_availability():
    availabilities = [Availability(id="14", day=DaysOfWeek.WEDNESDAY, start_time="08:00", end_time="12:00", start_timestamp=1000, end_timestamp=4000)]
    exceptions = []
    sessions = [Session(start_timestamp=500, end_timestamp=1500)]
    combined_availability = CombinedAvailability(availabilities, exceptions, sessions)
    assert not combined_availability.is_available_in_time(1000, 2000)

def test_session_overlapping_end_of_availability():
    availabilities = [Availability(id="15", day=DaysOfWeek.THURSDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = []
    sessions = [Session(start_timestamp=4000, end_timestamp=5500)]
    combined_availability = CombinedAvailability(availabilities, exceptions, sessions)
    assert not combined_availability.is_available_in_time(4500, 5000)

def test_multiple_sessions_with_breaks_in_availability():
    availabilities = [Availability(id="16", day=DaysOfWeek.FRIDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = []
    sessions = [
        Session(start_timestamp=1500, end_timestamp=2000),
        Session(start_timestamp=3000, end_timestamp=3500)
    ]
    combined_availability = CombinedAvailability(availabilities, exceptions, sessions)
    assert not combined_availability.is_available_in_time(1800, 3200)
    assert combined_availability.is_available_in_time(1000, 1400)
    assert combined_availability.is_available_in_time(3600, 4500)

def test_no_sessions():
    availabilities = [Availability(id="17", day=DaysOfWeek.SATURDAY, start_time="08:00", end_time="12:00", start_timestamp=1000, end_timestamp=4000)]
    exceptions = []
    sessions = []
    combined_availability = CombinedAvailability(availabilities, exceptions, sessions)
    assert combined_availability.is_available_in_time(2000, 3000)

def test_session_and_exception_overlap():
    availabilities = [Availability(id="18", day=DaysOfWeek.SUNDAY, start_time="08:00", end_time="17:00", start_timestamp=1000, end_timestamp=5000)]
    exceptions = [Exception(id="ex6", start_time="09:00", start_timestamp=2000, day=DaysOfWeek.SUNDAY, end_time="10:00", end_timestamp=2500)]
    sessions = [Session(start_timestamp=2400, end_timestamp=2600)]
    combined_availability = CombinedAvailability(availabilities, exceptions, sessions)
    assert not combined_availability.is_available_in_time(2400, 2600)
    assert not combined_availability.is_available_in_time(2000, 2200)