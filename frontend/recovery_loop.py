"""
Iterative Recovery Control Loop Algorithm
Executes up to 3 corrective steps using AI model predictions until error <= 0.0100 mm.
"""

import math
import pickle
import os
from wafer_model import WaferNavigationRegressor
from diagnostics import score_root_cause

def load_ai_model(model_path: str = "navigation_ai.pkl") -> WaferNavigationRegressor:
    if os.path.exists(model_path):
        try:
            with open(model_path, "rb") as f:
                return pickle.load(f)
        except Exception:
            pass
    
    # Fallback to direct model instance
    model = WaferNavigationRegressor()
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
    return model

def run_recovery_loop(inputs: dict, model_path: str = "navigation_ai.pkl") -> dict:
    """
    Runs up to 3 iterative corrective steps for wafer stage navigation recovery.
    """
    model = load_ai_model(model_path)
    
    target_x = float(inputs.get("target_x", 125.0))
    target_y = float(inputs.get("target_y", 125.0))
    temp = float(inputs.get("temp", 22.0))
    vib = float(inputs.get("vib", 0.05))
    speed = float(inputs.get("speed", 50.0))
    load = float(inputs.get("load", 10.0))
    direction = str(inputs.get("direction", "LEFT")).upper()
    time_since_calib = float(inputs.get("time_since_calib", 12.0))

    dir_left = 1.0 if direction == "LEFT" else 0.0
    dir_right = 1.0 if direction == "RIGHT" else 0.0
    dir_up = 1.0 if direction == "UP" else 0.0
    dir_down = 1.0 if direction == "DOWN" else 0.0

    curr_err_x = float(inputs.get("prev_err_x", -0.0820))
    curr_err_y = float(inputs.get("prev_err_y", 0.0410))

    attempts = []
    trajectory = [{
        "attempt": 0,
        "err_x": curr_err_x,
        "err_y": curr_err_y,
        "remaining": round(math.sqrt(curr_err_x**2 + curr_err_y**2), 4)
    }]

    is_recovered = False
    tolerance = 0.0100

    for attempt_num in range(1, 4):
        # Build 13-feature input vector for model inference
        feature_vector = [[
            target_x, target_y, temp, vib, speed, load,
            dir_left, dir_right, dir_up, dir_down,
            curr_err_x, curr_err_y, time_since_calib
        ]]

        prediction = model.predict(feature_vector)
        corr_x = float(prediction[0][0])
        corr_y = float(prediction[0][1])

        new_err_x = curr_err_x + corr_x
        new_err_y = curr_err_y + corr_y
        remaining_err = math.sqrt(new_err_x**2 + new_err_y**2)
        passed = remaining_err <= tolerance

        attempts.append({
            "attempt": attempt_num,
            "input_err_x": round(curr_err_x, 4),
            "input_err_y": round(curr_err_y, 4),
            "corr_x": round(corr_x, 4),
            "corr_y": round(corr_y, 4),
            "new_err_x": round(new_err_x, 4),
            "new_err_y": round(new_err_y, 4),
            "remaining_error": round(remaining_err, 4),
            "passed": passed
        })

        trajectory.append({
            "attempt": attempt_num,
            "err_x": round(new_err_x, 4),
            "err_y": round(new_err_y, 4),
            "remaining": round(remaining_err, 4)
        })

        curr_err_x = new_err_x
        curr_err_y = new_err_y

        if passed:
            is_recovered = True
            break

    diagnostics = score_root_cause(temp, vib, time_since_calib, load)
    final_error = round(trajectory[-1]["remaining"], 4)

    return {
        "status": "Recovered" if is_recovered else "Safe Stop Triggered",
        "attempts": attempts,
        "trajectory": trajectory,
        "diagnostics": diagnostics,
        "final_error": final_error,
        "attempts_count": len(attempts)
    }

if __name__ == "__main__":
    # Test execution
    test_inputs = {
        "target_x": 125.0,
        "target_y": 125.0,
        "temp": 22.5,
        "vib": 0.08,
        "speed": 50.0,
        "load": 10.0,
        "direction": "LEFT",
        "prev_err_x": -0.082,
        "prev_err_y": 0.041,
        "time_since_calib": 12.0
    }
    results = run_recovery_loop(test_inputs)
    print("Status:", results["status"])
    print("Final Error:", results["final_error"], "mm")
    print("Attempts Count:", results["attempts_count"])
