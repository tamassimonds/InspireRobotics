from utils.firebase_config import db

class PaySettings:
    _instance = None
    # Initialize class variables to None or a default value
    default_rnd_rate = None
    default_standard_pay = None
    default_transportation_pay_start_hours = None
    time_added_for_picking_up_equipment_hours = None
    time_in_minutes_added_to_each_shift = None
    last_updated = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PaySettings, cls).__new__(cls)
            cls._load_settings()
        return cls._instance

    @classmethod
    def _load_settings(cls):
        db_doc = db.collection('configurations').document('paySettings')
        data = db_doc.get().to_dict()
        if data:
            cls.default_rnd_rate = float(data.get('defaultRNDRate', 0))
            cls.default_standard_pay = float(data.get('defaultStandardPay', 0))
            cls.default_transportation_pay_start_hours = float(data.get('defaultTransportationPayStartHours', 0))
            cls.time_added_for_picking_up_equipment_hours = float(data.get('timeAddedForPickingUpEquipmentHours', 0))
            cls.time_in_minutes_added_to_each_shift = int(data.get('timeInMinutesAddedToEachShift', 0))
            cls.last_updated = data.get('lastUpdated')  # Store as string or convert to datetime
        else:
            raise ValueError("No data found in the Firestore document.")

# To ensure settings are loaded, access any property or create an instance.
_ = PaySettings()