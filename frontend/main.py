"""
AI Wafer Navigation Recovery System - Main Executable Entry Point
All core machine learning inference, diagnostic, and recovery loop modules in Python.
"""

import sys
import json
from recovery_loop import run_recovery_loop
from wafer_model import WaferNavigationRegressor
from diagnostics import score_root_cause

def main():
    print("=" * 65)
    print("  AI Wafer Navigation Error Recovery System (Python Framework)")
    print("  Model Artifact: navigation_ai.pkl (WaferNavigationRegressor)")
    print("=" * 65)

    sample_input = {
        "target_x": 125.0,
        "target_y": 125.0,
        "temp": 23.4,
        "vib": 0.08,
        "speed": 50.0,
        "load": 15.0,
        "direction": "LEFT",
        "prev_err_x": -0.0820,
        "prev_err_y": 0.0410,
        "time_since_calib": 14.0
    }

    if len(sys.argv) > 1:
        try:
            sample_input = json.loads(sys.argv[1])
        except Exception as e:
            print(f"[Warning] Could not parse custom JSON arguments. Using default parameters. Error: {e}")

    print("\n[1] Machine Operating Conditions:")
    for k, v in sample_input.items():
        print(f"  - {k}: {v}")

    print("\n[2] Executing Iterative Recovery Control Loop...")
    result = run_recovery_loop(sample_input)

    print(f"\n[3] Outcome Status: {result['status'].upper()}")
    print(f"    Final Remaining Error: {result['final_error']} mm (Tolerance Target: <= 0.0100 mm)")
    print(f"    Total Iteration Steps: {result['attempts_count']}")

    print("\n[4] Step-by-Step Correction Log:")
    for step in result['attempts']:
        print(f"  Step {step['attempt']}:")
        print(f"    Input Error (X, Y): ({step['input_err_x']}, {step['input_err_y']}) mm")
        print(f"    Predicted Correction: ({step['corr_x']}, {step['corr_y']}) mm")
        print(f"    Resulting Remaining: {step['remaining_error']} mm -> {'[PASS]' if step['passed'] else '[FAIL]'}")

    diag = result['diagnostics']
    print("\n[5] Rule-Based Root Cause Diagnostic Analysis:")
    print(f"    Likely Primary Driver: {diag['primary_driver']} (Score: {diag['highest_score']}/100)")
    print(f"    System Risk Index: {diag['risk_score']}/100 | Diagnostic Confidence: {diag['confidence_pct']}%")
    print("    Factor Breakdown:")
    for factor, score in diag['scores'].items():
        print(f"      * {factor}: {score}/100")

    print("\n" + "=" * 65)

if __name__ == "__main__":
    main()
