




from  utils.dates.daysOfWeek import DaysOfWeek
import pytz
from datetime import datetime

class TimestampParser:


    @staticmethod
    def get_day_from_timestamp(timestamp: int, timezone=pytz.UTC) -> DaysOfWeek:
        """
        Convert a Unix timestamp to a day of the week.

        Args:
        timestamp (int): The Unix timestamp.
        timezone (pytz.timezone): The timezone to consider for the conversion.

        Returns:
        DaysOfWeek: The day of the week as an enum value.
        """
        # Convert the Unix timestamp to a datetime object in the specified timezone
        dt_object = datetime.fromtimestamp(int(timestamp/1000), tz=timezone)

        # Get the weekday index (where Monday is 0 and Sunday is 6)
        weekday = dt_object.weekday()

        # Mapping the weekday index to the DaysOfWeek enum
        day_mapping = {
            0: DaysOfWeek.MONDAY,
            1: DaysOfWeek.TUESDAY,
            2: DaysOfWeek.WEDNESDAY,
            3: DaysOfWeek.THURSDAY,
            4: DaysOfWeek.FRIDAY,
            5: DaysOfWeek.SATURDAY,
            6: DaysOfWeek.SUNDAY
        }

        return day_mapping[weekday]


    @staticmethod
    def datetime_to_milliseconds_timestamp(dt):
        return int(dt.timestamp() * 1000)
