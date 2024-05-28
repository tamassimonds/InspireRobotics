

from utils.firebase_config import db, app


class Parent:

    def __init__(self, firstName=None, lastName=None, email=None, postCode=None, address=None, phoneNumber=None, id=None) -> None:
        self.name = f"{firstName or ''} {lastName or ''}".strip()
        self.email = email or ''
        self.postCode = postCode or ''
        self.address = address or ''
        self.phoneNumber = phoneNumber or ''
        self.id = id or ''

    def __repr__(self):
        return (f"Parent(name={self.name}, email={self.email}, postCode={self.postCode}, "
                f"address={self.address}, phoneNumber={self.phoneNumber}, id={self.id})")

