


from dataclasses import dataclass, field
from typing import List, Any


from lib.programs.docs.tutorials import Tutorial



@dataclass
class Curriculum:
    id: str
    title: str
    is_holiday_program: bool
    num_sessions: int
    holiday_module: Any
    tutorials: List[Tutorial] = field(default_factory=list)
    additional_info: str