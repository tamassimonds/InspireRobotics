


from datetime import datetime
from typing import List
from dataclasses import dataclass, field


from lib.tickets.ticket import Ticket

from utils.inputs.inputTypes import InputTypes


from utils.notifications.send_plain_email import SendPlainEmail 


@dataclass
class FeedbackTicket(Ticket):
    dateCreated: datetime
    dueDate: datetime
    date: datetime
    type: str
    programID: str
    courseID: str
    completed: bool
    questions: List[str] = field(default_factory=list)
    questionInputType: List[InputTypes] = field(default_factory=list)
    answers: List[str] = field(default_factory=list)




    def send_reminder(self):
        emailer = SendPlainEmail()
        emailer.send()
    
    