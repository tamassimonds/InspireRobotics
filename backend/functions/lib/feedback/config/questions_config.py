




from enum import Enum

class InputType(Enum):
    TEXT = "text"
    NUMBER = "number"







CLASS_FEEDBACK_QUESTION_TYPES = [
    ("What could be improved in the discussion?", InputType.TEXT.value),
    ("What worked well in the activity?", InputType.TEXT.value),
    ("What could be improved in the activity?", InputType.TEXT.value),
    ("What worked well in the discussion?", InputType.TEXT.value),
    ("What's something your coteacher did well?", InputType.TEXT.value),
    ("What's something your coteacher could have improved?", InputType.TEXT.value),
    ("What number would you rate your peers' performance our of 10?", InputType.NUMBER.value),
]