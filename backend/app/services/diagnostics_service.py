def diagnose(data: dict):
    """
    Diagnostic layer for wafer navigation recovery.
    Calculates risk scores and identifies the highest-risk factor.
    """

    vibration = data["Vibration"]
    temperature = data["Temperature"]
    stage_load = data["Stage_Load"]
    calibration_age = data["Time_Since_Calibration"]

    previous_error_x = data["Previous_Error_X"]
    previous_error_y = data["Previous_Error_Y"]

    error_magnitude = (
        previous_error_x ** 2 + previous_error_y ** 2
    ) ** 0.5

    # Calculate scores from 0-100
    temperature_score = min(
        100,
        abs(temperature - 22.0) * 22.5
    )

    vibration_score = min(
        100,
        max(0, (vibration - 0.02) * 500)
    )

    calibration_score = min(
        100,
        max(0, (calibration_age - 8.0) * 2.2)
    )

    stage_load_score = min(
        100,
        max(0, (stage_load - 10.0) * 3.5)
    )

    error_score = min(
        100,
        error_magnitude * 100
    )

    scores = {
        "THERMAL_DRIFT": temperature_score,
        "HIGH_VIBRATION": vibration_score,
        "CALIBRATION_AGING": calibration_score,
        "HIGH_STAGE_LOAD": stage_load_score,
        "LARGE_POSITION_ERROR": error_score,
    }

    # Find the highest scoring factor
    primary_cause = max(
        scores,
        key=scores.get
    )

    highest_score = scores[primary_cause]

    # Overall risk
    risk_score = max(
        temperature_score,
        vibration_score,
        calibration_score,
        stage_load_score,
        error_score
    )

    if risk_score >= 70:
        overall_risk = "HIGH"
    elif risk_score >= 30:
        overall_risk = "MEDIUM"
    else:
        overall_risk = "LOW"

    # Create diagnostic factors
    factors = []

    if vibration_score > 0:
        factors.append({
            "factor": "HIGH_VIBRATION",
            "severity": "HIGH" if vibration_score >= 70 else "MEDIUM",
            "value": vibration,
            "score": vibration_score,
            "message": "Vibration may be affecting wafer positioning."
        })

    if temperature_score > 0:
        factors.append({
            "factor": "THERMAL_DRIFT",
            "severity": "HIGH" if temperature_score >= 70 else "MEDIUM",
            "value": temperature,
            "score": temperature_score,
            "message": "Temperature variation may contribute to positioning drift."
        })

    if stage_load_score > 0:
        factors.append({
            "factor": "HIGH_STAGE_LOAD",
            "severity": "HIGH" if stage_load_score >= 70 else "MEDIUM",
            "value": stage_load,
            "score": stage_load_score,
            "message": "Stage load may affect positioning stability."
        })

    if calibration_score > 0:
        factors.append({
            "factor": "CALIBRATION_AGING",
            "severity": "HIGH" if calibration_score >= 70 else "MEDIUM",
            "value": calibration_age,
            "score": calibration_score,
            "message": "Calibration age may contribute to navigation error."
        })

    if error_magnitude >= 0.01:
        factors.append({
            "factor": "LARGE_POSITION_ERROR",
            "severity": "HIGH" if error_magnitude >= 0.05 else "MEDIUM",
            "value": error_magnitude,
            "score": error_score,
            "message": "Positioning error is above recovery tolerance."
        })

    return {
        "primary_cause": primary_cause,
        "primary_score": round(highest_score, 1),
        "overall_risk": overall_risk,
        "risk_score": round(risk_score, 1),
        "error_magnitude": error_magnitude,
        "factors": factors
    }