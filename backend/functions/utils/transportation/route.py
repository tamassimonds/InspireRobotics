


from dataclasses import dataclass




@dataclass
class Route:
    typical_duration_in_minutes: int
    current_duration_in_minutes: int
    length_in_meters: int


    def db_to_obj(data: dict) -> "Route":
        return Route(
            typical_duration_in_minutes=data['typicalDuration']/60,
            current_duration_in_minutes=data['duration']/60,
            length_in_meters=data['length']
        )
    
    def __str__(self) -> str:
        return f"Route: duration {self.typical_duration_in_minutes} minutes; distance {self.length_in_meters} meters"