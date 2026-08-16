"""
AI Wafer Navigation Recovery - Hackathon Prototype Dashboard (Streamlit)
Demonstrates inspection-stage navigation error recovery using a trained regression AI model.
"""

import pickle
import math
import os
import pandas as pd

# Try importing streamlit and plotly; provide fallback if running in minimal env
try:
    import streamlit as st
    import plotly.graph_objects as go
    HAS_STREAMLIT = True
except ImportError:
    HAS_STREAMLIT = False

from wafer_model import WaferNavigationRegressor

# ==============================================================================
# 1. LOAD MODEL
# ==============================================================================
def load_model(model_path="navigation_ai.pkl"):
    """Loads the pre-trained regression model from disk using pickle."""
    if not os.path.exists(model_path):
        # Fallback: create model if file missing
        model = WaferNavigationRegressor()
        with open(model_path, "wb") as f:
            pickle.dump(model, f)
        return model
    
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    return model

# ==============================================================================
# 2. ENCODE INPUTS
# ==============================================================================
def encode_inputs(
    target_x, target_y, temp, vib, speed, load,
    direction, prev_err_x, prev_err_y, time_since_calib
):
    """
    Encodes categorical features (Direction: LEFT, RIGHT, UP, DOWN) as one-hot columns
    and builds the feature vector matching model training format.
    
    Returns 2D list: [[
      Target_X, Target_Y, Temperature, Vibration, Speed, Stage_Load,
      Dir_LEFT, Dir_RIGHT, Dir_UP, Dir_DOWN,
      Previous_Error_X, Previous_Error_Y, Time_Since_Calibration
    ]]
    """
    dir_left = 1.0 if direction == "LEFT" else 0.0
    dir_right = 1.0 if direction == "RIGHT" else 0.0
    dir_up = 1.0 if direction == "UP" else 0.0
    dir_down = 1.0 if direction == "DOWN" else 0.0

    feature_vector = [[
        float(target_x),
        float(target_y),
        float(temp),
        float(vib),
        float(speed),
        float(load),
        dir_left,
        dir_right,
        dir_up,
        dir_down,
        float(prev_err_x),
        float(prev_err_y),
        float(time_since_calib)
    ]]
    return feature_vector

# ==============================================================================
# 3. PREDICT CORRECTION
# ==============================================================================
def predict_correction(model, encoded_vector):
    """
    Calls the trained AI model prediction method.
    Extracts prediction[0][0] (Correction X) and prediction[0][1] (Correction Y).
    """
    prediction = model.predict(encoded_vector)
    corr_x = float(prediction[0][0])
    corr_y = float(prediction[0][1])
    return corr_x, corr_y

# ==============================================================================
# 4. APPLY CORRECTION
# ==============================================================================
def apply_correction(current_err_x, current_err_y, corr_x, corr_y):
    """
    Applies the predicted correction vector to the current stage error state.
    Returns new X error, new Y error, and new Euclidean remaining error (mm).
    """
    # Apply correction to stage navigation error
    new_err_x = current_err_x + corr_x
    new_err_y = current_err_y + corr_y
    remaining_error = math.sqrt(new_err_x**2 + new_err_y**2)
    return new_err_x, new_err_y, remaining_error

# ==============================================================================
# 5. CORE RECOVERY LOOP
# ==============================================================================
def run_recovery_loop(model, base_inputs, max_attempts=3, tolerance=0.01):
    """
    Iterative recovery loop executing:
    Machine State → AI Prediction → X/Y Correction → Apply Correction →
    Calculate Remaining Error → AI Re-prediction → Recovery / Safe Stop
    """
    attempts_log = []
    curr_err_x = base_inputs["prev_err_x"]
    curr_err_y = base_inputs["prev_err_y"]
    initial_remaining = math.sqrt(curr_err_x**2 + curr_err_y**2)
    
    status = "Safe Stop"
    final_error = initial_remaining

    # Track trajectory for visualization
    trajectory = [{"attempt": 0, "err_x": curr_err_x, "err_y": curr_err_y, "remaining": initial_remaining}]

    for attempt_num in range(1, max_attempts + 1):
        # Step A: Machine State -> Prepare input vector with current error state
        encoded = encode_inputs(
            base_inputs["target_x"],
            base_inputs["target_y"],
            base_inputs["temp"],
            base_inputs["vib"],
            base_inputs["speed"],
            base_inputs["load"],
            base_inputs["direction"],
            curr_err_x,
            curr_err_y,
            base_inputs["time_since_calib"]
        )

        # Step B: AI Prediction -> Query model for corrective vector
        corr_x, corr_y = predict_correction(model, encoded)

        # Step C & D: X/Y Correction & Apply Correction
        new_err_x, new_err_y, remaining_err = apply_correction(curr_err_x, curr_err_y, corr_x, corr_y)

        # Step E: Calculate Remaining Error & Check Tolerance
        passed = remaining_err <= tolerance

        log_entry = {
            "attempt": attempt_num,
            "input_err_x": curr_err_x,
            "input_err_y": curr_err_y,
            "corr_x": corr_x,
            "corr_y": corr_y,
            "new_err_x": new_err_x,
            "new_err_y": new_err_y,
            "remaining_error": remaining_err,
            "passed": passed,
            "status": "PASS" if passed else "FAIL"
        }
        attempts_log.append(log_entry)

        trajectory.append({
            "attempt": attempt_num,
            "err_x": new_err_x,
            "err_y": new_err_y,
            "remaining": remaining_err
        })

        curr_err_x = new_err_x
        curr_err_y = new_err_y
        final_error = remaining_err

        # Check if tolerance criteria met
        if passed:
            status = "Recovered"
            break

    return {
        "status": status,
        "final_error": final_error,
        "attempts_log": attempts_log,
        "trajectory": trajectory
    }

# ==============================================================================
# 6. SCORE ROOT CAUSE (RULE-BASED DIAGNOSTIC ENGINE)
# ==============================================================================
def score_root_cause(temp, vib, time_since_calib, load):
    """
    Rule-based diagnostic layer scoring root cause potential.
    SEPARATE FROM THE AI MODEL INFERENCE LOGIC.
    Calculates impact scores for Temperature, Vibration, Calibration Age, and Stage Load.
    """
    # 1. Temperature deviation score (baseline: 22.0°C)
    temp_dev = abs(temp - 22.0)
    temp_score = min(100.0, temp_dev * 22.5)

    # 2. Vibration score (baseline: < 0.05g)
    vib_score = min(100.0, max(0.0, (vib - 0.02) * 500.0))

    # 3. Calibration age score (baseline: < 12 hrs)
    calib_score = min(100.0, max(0.0, (time_since_calib - 8.0) * 2.2))

    # 4. Stage load score (baseline: 10.0 kg)
    load_score = min(100.0, max(0.0, (load - 10.0) * 3.5))

    scores = {
        "Temperature Deviation": round(temp_score, 1),
        "Vibration Level": round(vib_score, 1),
        "Calibration Age": round(calib_score, 1),
        "Mechanical Stage Load": round(load_score, 1)
    }

    # Identify primary driver
    primary_driver = max(scores, key=scores.get)
    highest_score = scores[primary_driver]

    # Calculate overall risk score & confidence indicator (rule-based)
    risk_score = min(100.0, (temp_score * 0.35 + vib_score * 0.35 + calib_score * 0.15 + load_score * 0.15))
    confidence_pct = max(10.0, 100.0 - (risk_score * 0.6))

    return {
        "scores": scores,
        "primary_driver": primary_driver,
        "highest_score": highest_score,
        "risk_score": round(risk_score, 1),
        "confidence_pct": round(confidence_pct, 1)
    }

# ==============================================================================
# 7. RENDER DASHBOARD
# ==============================================================================
def render_dashboard():
    """Renders the Streamlit frontend layout if Streamlit is present."""
    if not HAS_STREAMLIT:
        print("Streamlit package not detected. Please run via Streamlit CLI or web interface.")
        return

    st.set_page_config(
        page_title="AI Wafer Navigation Recovery",
        page_icon="🔬",
        layout="wide"
    )

    st.title("🔬 AI Wafer Navigation Recovery")
    st.caption(
        "Hackathon Prototype: Automated stage error recovery using AI regression model "
        "inference combined with a rule-based diagnostic engine for semiconductor wafer inspection tools."
    )

    model = load_model()

    # Sidebar Form for 10 Model Inputs
    st.sidebar.header("⚙️ Stage Machine Parameters")

    target_x = st.sidebar.number_input("Target X Coordinate (mm)", value=0.0, step=1.0)
    target_y = st.sidebar.number_input("Target Y Coordinate (mm)", value=0.0, step=1.0)
    temp = st.sidebar.slider("Temperature (°C)", min_value=15.0, max_value=35.0, value=22.5, step=0.1)
    vib = st.sidebar.slider("Vibration (g)", min_value=0.0, max_value=0.5, value=0.08, step=0.01)
    speed = st.sidebar.slider("Speed (mm/s)", min_value=1.0, max_value=200.0, value=50.0, step=1.0)
    load = st.sidebar.slider("Stage Load (kg)", min_value=1.0, max_value=50.0, value=12.0, step=0.5)
    direction = st.sidebar.selectbox("Movement Direction", ["LEFT", "RIGHT", "UP", "DOWN"])
    prev_err_x = st.sidebar.number_input("Previous Error X (mm)", value=0.085, format="%.4f")
    prev_err_y = st.sidebar.number_input("Previous Error Y (mm)", value=-0.062, format="%.4f")
    time_since_calib = st.sidebar.number_input("Time Since Calibration (hrs)", value=14.0, step=1.0)

    run_button = st.sidebar.button("🚀 Run Recovery Loop", type="primary")

    base_inputs = {
        "target_x": target_x,
        "target_y": target_y,
        "temp": temp,
        "vib": vib,
        "speed": speed,
        "load": load,
        "direction": direction,
        "prev_err_x": prev_err_x,
        "prev_err_y": prev_err_y,
        "time_since_calib": time_since_calib
    }

    # Diagnostic scoring
    diagnostics = score_root_cause(temp, vib, time_since_calib, load)

    # Main dashboard layout
    col1, col2 = st.columns([2, 1])

    with col1:
        st.subheader("📍 Machine Conditions Summary")
        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Initial Error X", f"{prev_err_x:+.4f} mm")
        m2.metric("Initial Error Y", f"{prev_err_y:+.4f} mm")
        m3.metric("Temp / Vib", f"{temp}°C | {vib}g")
        m4.metric("Calibration", f"{time_since_calib} hrs")

        # Execute recovery loop
        results = run_recovery_loop(model, base_inputs)

        st.subheader("🔄 Iterative Recovery Attempts Log")
        attempts_df = pd.DataFrame([
            {
                "Attempt": a["attempt"],
                "Predicted Corr X (mm)": f"{a['corr_x']:+.4f}",
                "Predicted Corr Y (mm)": f"{a['corr_y']:+.4f}",
                "New Error X (mm)": f"{a['new_err_x']:+.4f}",
                "New Error Y (mm)": f"{a['new_err_y']:+.4f}",
                "Remaining Err (mm)": f"{a['remaining_error']:.4f}",
                "Tolerance Check": "Pass (≤0.01)" if a["passed"] else "Fail (>0.01)"
            }
            for a in results["attempts_log"]
        ])
        st.table(attempts_df)

        # Final status
        status = results["status"]
        if status == "Recovered":
            st.success(f"✅ **STATUS: RECOVERED** — Final error {results['final_error']:.4f} mm is within target tolerance (0.01 mm).")
        else:
            st.error(f"🛑 **STATUS: SAFE STOP** — Final error {results['final_error']:.4f} mm exceeded tolerance after 3 attempts.")

        # Convergence chart
        st.subheader("📈 Error Convergence Trajectory")
        fig = go.Figure()
        attempts_num = [t["attempt"] for t in results["trajectory"]]
        remainings = [t["remaining"] for t in results["trajectory"]]
        fig.add_trace(go.Scatter(x=attempts_num, y=remainings, mode='lines+markers', name='Remaining Error (mm)'))
        fig.add_hline(y=0.01, line_dash="dash", line_color="green", annotation_text="0.01mm Tolerance Limit")
        fig.update_layout(title="Error Reduction Over Attempts", xaxis_title="Attempt #", yaxis_title="Remaining Error (mm)")
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.subheader("🛡️ Risk & Diagnostic Intelligence")
        st.metric("Diagnostic Confidence", f"{diagnostics['confidence_pct']}%")
        st.progress(diagnostics['confidence_pct'] / 100.0)

        st.markdown("---")
        st.subheader("🔍 Primary Error Driver (Rule-Based)")
        st.caption("Note: Rule-based diagnostic layer, evaluated separately from the AI regression model.")
        st.write(f"**Likely Primary Cause:** `{diagnostics['primary_driver']}` (Score: {diagnostics['highest_score']}/100)")

        for factor, sc in diagnostics["scores"].items():
            st.write(f"- {factor}: `{sc}/100`")

    st.markdown("---")
    st.subheader("🧱 System Architecture Components")
    ac1, ac2, ac3, ac4 = st.columns(4)
    ac1.info("**1. Trained AI Model**\nPredicts corrective X/Y navigation movement only (`navigation_ai.pkl`).")
    ac2.info("**2. Diagnostic Engine**\nAnalyzes temperature, vibration, calibration age, load, and simulated failures (rule-based).")
    ac3.info("**3. Recovery Engine**\nApplies corrections and repeats recovery iteratively up to 3 attempts.")
    ac4.info("**4. Dashboard**\nDisplays risk, confidence, root-cause ranking, status, and recommendations.")

if __name__ == "__main__":
    render_dashboard()
