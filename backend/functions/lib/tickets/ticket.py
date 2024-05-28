





class Ticket:
    id: str
    ticketType: str




    def __str__(self):
        return f"Ticket {self.id} of type {self.ticketType}"


