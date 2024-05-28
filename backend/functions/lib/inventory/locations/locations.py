



from dataclasses import dataclass

@dataclass
class InventoryLocation:
    address: str
    id: str
    latitude: str
    longitude: str
    name: str