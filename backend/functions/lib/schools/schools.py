

from dataclasses import dataclass


@dataclass
class School:
    name:str
    id:str
    _address:str
    public:bool
    primary: bool = False
    secondary:bool = False
    


    @staticmethod
    def db_to_obj(data: dict) -> "School":
        return School(
            name=data['name'],
            id=data['id'],
            _address=data.get('address'),  # Using .get without a second argument defaults to None if not found
            public=data['public'],
            primary=data.get('primary', False),  # Default to False if 'primary' key is not in data
            secondary=data.get('secondary', False)  # Default to False if 'secondary' key is not in data
        )
    
    @property
    def address(self):
        if self._address:
            return self._address
        else:
            return self.name + " Australia"