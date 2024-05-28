
from dataclasses import dataclass




@dataclass
class Course:
    # Define fields with default values directly in the class attribute definitions
    iconImageURL: str = ''
    courseID: str = ''  # Assuming 'course_id' is simply 'id' in the keyword arguments
    largeImageURL: str = ''
    longDescription: str = ''
    name: str = ''
    notionLink: str = ''
    shortDescription: str = ''