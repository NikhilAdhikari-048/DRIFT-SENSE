import math

from .model_service import predict_correction
from .diagnostics_service import diagnose

RECOVERY_TOLERANCE = 0.01
MAX_ATTEMPTS = 3


def calculate_error_magnitude(error_x: float, error_y: float) -> float:
    """
    Calculate total navigation error in mm.
    """
    return math.sqrt(error_x ** 2 + error_y ** 2)


def recover_wafer(data: dict):
    """
    Simulate iterative AI-based wafer navigation recovery.

    The AI predicts an X/Y correction.
    The correction is applied to the current navigation error.
    Recovery succeeds when the remaining error <= 0.01 mm.
    """

    current_error_x = data["Previous_Error_X"]
    current_error_y = data["Previous_Error_Y"]

    # Initial diagnostics
    diagnostics = diagnose(data)

    attempts = []

    # Calculate initial error
    initial_error = calculate_error_magnitude(
        current_error_x,
        current_error_y
    )

    # Track the best error achieved during recovery
    best_error = initial_error

    for attempt_number in range(1, MAX_ATTEMPTS + 1):

        # Error before this attempt
        previous_error_magnitude = calculate_error_magnitude(
            current_error_x,
            current_error_y
        )

        # Update model input with current error
        model_input = data.copy()
        model_input["Previous_Error_X"] = current_error_x
        model_input["Previous_Error_Y"] = current_error_y

        # Ask trained AI model for correction
        prediction = predict_correction(model_input)

        correction_x = prediction["correction_x"]
        correction_y = prediction["correction_y"]

        # Simulate applying correction
        new_error_x = current_error_x + correction_x
        new_error_y = current_error_y + correction_y

        # Calculate remaining error
        remaining_error = calculate_error_magnitude(
            new_error_x,
            new_error_y
        )

        # Check whether this attempt improved the error
        improved = remaining_error < previous_error_magnitude

        # Update best error
        if remaining_error < best_error:
            best_error = remaining_error

        attempt_result = {
            "attempt": attempt_number,
            "previous_error_x": current_error_x,
            "previous_error_y": current_error_y,
            "previous_error": previous_error_magnitude,
            "correction_x": correction_x,
            "correction_y": correction_y,
            "remaining_error": remaining_error,
            "improved": improved
        }

        attempts.append(attempt_result)

        # Recovery successful
        if remaining_error <= RECOVERY_TOLERANCE:
            return {
                "status": "RECOVERED",
                "attempts_used": attempt_number,
                "final_error_x": new_error_x,
                "final_error_y": new_error_y,
                "final_error": remaining_error,
                "best_error_achieved": best_error,
                "diagnostics": diagnostics,
                "attempt_history": attempts
            }

        # Continue with new error
        current_error_x = new_error_x
        current_error_y = new_error_y

    # Maximum attempts reached
    final_error = calculate_error_magnitude(
        current_error_x,
        current_error_y
    )

    return {
        "status": "SAFE_STOP",
        "attempts_used": MAX_ATTEMPTS,
        "final_error_x": current_error_x,
        "final_error_y": current_error_y,
        "final_error": final_error,
        "best_error_achieved": best_error,
        "diagnostics": diagnostics,
        "attempt_history": attempts
    }