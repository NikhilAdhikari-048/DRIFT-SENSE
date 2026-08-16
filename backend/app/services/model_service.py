from pathlib import Path

import joblib
import pandas as pd


# Find the project root
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# Location of trained model
MODEL_PATH = PROJECT_ROOT / "model" / "navigation_ai.pkl"


# Load model ONCE when the backend starts
model = joblib.load(MODEL_PATH)


def predict_correction(data: dict):
    """
    Convert backend input into the 13 numeric features
    expected by WaferNavigationRegressor.
    """

    direction = str(data.get("Direction", "LEFT")).upper()

    direction_left = 1.0 if direction == "LEFT" else 0.0
    direction_right = 1.0 if direction == "RIGHT" else 0.0
    direction_up = 1.0 if direction == "UP" else 0.0
    direction_down = 1.0 if direction == "DOWN" else 0.0

    input_data = [[
        float(data["Target_X"]),
        float(data["Target_Y"]),
        float(data["Temperature"]),
        float(data["Vibration"]),
        float(data["Speed"]),
        float(data["Stage_Load"]),
        direction_left,
        direction_right,
        direction_up,
        direction_down,
        float(data["Previous_Error_X"]),
        float(data["Previous_Error_Y"]),
        float(data["Time_Since_Calibration"]),
    ]]

    prediction = model.predict(input_data)

    correction_x = float(prediction[0][0])
    correction_y = float(prediction[0][1])

    return {
        "correction_x": correction_x,
        "correction_y": correction_y
    }