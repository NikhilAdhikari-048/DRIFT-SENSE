"""
Rule-Based Diagnostic Engine for Wafer Stage Error Root Cause Analysis
Evaluates environmental and operational factors independently of ML model predictions.
"""

def score_root_cause(temp: float, vib: float, time_since_calib: float, load: float) -> dict:
    """
    Calculates diagnostic scores (0 - 100) for potential root cause error drivers.
    """
    temp_dev = abs(temp - 22.0)
    temp_score = min(100.0, temp_dev * 22.5)
    vib_score = min(100.0, max(0.0, (vib - 0.02) * 500.0))
    calib_score = min(100.0, max(0.0, (time_since_calib - 8.0) * 2.2))
    load_score = min(100.0, max(0.0, (load - 10.0) * 3.5))

    scores = {
        "Temperature Deviation": round(temp_score, 1),
        "Vibration Level": round(vib_score, 1),
        "Calibration Age": round(calib_score, 1),
        "Mechanical Stage Load": round(load_score, 1),
    }

    primary_driver = "Temperature Deviation"
    highest_score = -1.0
    for factor, score in scores.items():
        if score > highest_score:
            highest_score = score
            primary_driver = factor

    risk_score = round(
        0.35 * scores["Temperature Deviation"] +
        0.35 * scores["Vibration Level"] +
        0.20 * scores["Calibration Age"] +
        0.10 * scores["Mechanical Stage Load"],
        1
    )

    confidence_pct = max(0.0, min(100.0, 100.0 - (risk_score * 0.75)))

    return {
        "scores": scores,
        "primary_driver": primary_driver,
        "highest_score": highest_score,
        "risk_score": risk_score,
        "confidence_pct": round(confidence_pct, 1),
    }
