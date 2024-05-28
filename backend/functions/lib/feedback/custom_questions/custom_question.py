




from utils.inputs.inputTypes import InputTypes
from dataclasses import Optional, dataclass
from typing import List
from enum import Enum


@dataclass
class CustomQuestion:
    question: str
    inputType: InputTypes
    courseID: Optional(str)
    programID: str


