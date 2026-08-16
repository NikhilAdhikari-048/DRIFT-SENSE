from pydantic import BaseModel


class WaferInput(BaseModel):
    Target_X: float
    Target_Y: float
    Temperature: float
    Vibration: float
    Speed: float
    Stage_Load: float
    Direction: str
    Previous_Error_X: float
    Previous_Error_Y: float
    Time_Since_Calibration: float
class RecoveryInput(BaseModel):
    Target_X: float
    Target_Y: float
    Temperature: float
    Vibration: float
    Speed: float
    Stage_Load: float
    Direction: str
    Previous_Error_X: float
    Previous_Error_Y: float
    Time_Since_Calibration: float