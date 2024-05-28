
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional

from lib.employee.availability.service.employee_availability_service import EmployeeAvailabilityService

from lib.employee.availability.combined_availability import CombinedAvailability

class EmployeeRoles(Enum):
    ADMIN = "admin"
    INSTRUCTOR = "instructor"
    STUDENT = "student"

@dataclass
class Employee:
    name: str
    id: str
    email: str
    address: str
    last_updated: Optional[datetime]
    date_of_birth: datetime
    profile_image: Optional[str] = field(default=None)
    access_to_car: bool = field(default=False)
    account_disabled: bool = field(default=False)
    active_teacher: bool = field(default=False)
    rnd_pay_rate: float = field(default=None)
    standard_pay_rate: float = field(default=None)
    transportation_pay_start: float = field(default=None)

    _availability: CombinedAvailability = field(default=None)

    def __str__(self):
        return f"{self.name} ({self.id})"

    @property
    def availability(self):
        if not self._availability:
            return EmployeeAvailabilityService.get_employee_availability(self.id)
        else:
            return self._availability


    

    def is_available_in_range(self, startTimestamp: int, endTimestamp: int) -> bool:
        return self.availability.is_available_in_time(startTimestamp, endTimestamp) 


    def get_pay_in_period(self, startTimestamp: int, endTimestamp: int) -> float:
        return self.availability.get_pay_in_period(startTimestamp, endTimestamp)