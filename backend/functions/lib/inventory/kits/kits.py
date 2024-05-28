


from dataclasses import dataclass
from typing import List

from lib.inventory.item.item import Item


@dataclass
class CourseKit:
    courseIDs: List[str]
    description: str
    id: str
    items: List[Item]
    numClassesCanService: int
    numClassesConcurrently: int
    numStudentsCanService: int
