
from dataclasses import dataclass
from datetime import datetime

from utils.dates.daysOfWeek import DaysOfWeek


@dataclass
class Exception:
    id: str
    start_time: str
    start_timestamp: int
    startDateTime: str
    endDateTime: str
    end_time: str
    end_timestamp: int

    @property
    def start_datetime(self) -> datetime:
        return datetime.fromtimestamp(self.start_timestamp / 1000)  # Corrected

    @property
    def end_datetime(self) -> datetime:
        return datetime.fromtimestamp(self.end_timestamp / 1000)  # Corrected

    @staticmethod
    def db_to_obj(data: dict) -> "Exception":
        return Exception(
            id=data['id'],
            startDateTime=data['startDateTime'],
            endDateTime=data['endDateTime'],
            start_time=data['startTime'],
            end_time=data['endTime'],
            start_timestamp=data['startDateTimestamp'],
            end_timestamp=data['endDateTimestamp']
        )

    def __str__(self) -> str:
        return f"Exception: {self.day} from {self.start_time} to {self.end_time}"