
from dataclasses import dataclass, field
from datetime import datetime


from lib.tickets.ticket import Ticket

def timestamp_to_datetime(timestamp):
    return None if timestamp is None else datetime.fromtimestamp(timestamp / 1000)


@dataclass
class EquipmentPickUpTicket(Ticket):
    accepted: bool
    date_occurred: datetime = field(default=None, metadata={'convert': timestamp_to_datetime})
    date_resolved: datetime = field(default=None, metadata={'convert': timestamp_to_datetime})
    date_submitted: datetime
    description: str
    employee_id: str
    employee_name: str
    last_updated: datetime
    num_minutes: int
    pay_year: int
    paid: bool
    pay_week: int
    rejected: bool
    status: str
    subject: str
    ticket_type: str = field(init=False, default='pickUp')
