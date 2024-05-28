from dataclasses import dataclass
from typing import List

@dataclass
class Item:
    itemID: str
    quantity: int
    name: str = ""  