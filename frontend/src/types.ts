export type DashboardSection =
  | "ALL"
  | "FEATURE_INPUTS"
  | "TARGET_X"
  | "TARGET_Y"
  | "TEMP"
  | "VIB"
  | "SPEED"
  | "LOAD"
  | "DIRECTION"
  | "PREV_ERR_X"
  | "PREV_ERR_Y"
  | "TIME_CALIB"
  | "MACHINE_CONDITIONS"
  | "RECOVERY_LOG"
  | "STAGE_VISUALIZERS"
  | "RISK_DIAGNOSTICS"
  | "SYSTEM_ARCHITECTURE";

export type Direction = "LEFT" | "RIGHT" | "UP" | "DOWN";

export interface ModelInputs {
  target_x: number;
  target_y: number;
  temp: number;
  vib: number;
  speed: number;
  load: number;
  direction: Direction;
  prev_err_x: number;
  prev_err_y: number;
  time_since_calib: number;
}

export interface AttemptLogEntry {
  attempt: number;
  input_err_x: number;
  input_err_y: number;
  corr_x: number;
  corr_y: number;
  new_err_x: number;
  new_err_y: number;
  remaining_error: number;
  passed: boolean;
  status: "PASS" | "FAIL";
}

export interface TrajectoryPoint {
  attempt: number;
  err_x: number;
  err_y: number;
  remaining: number;
}

export interface DiagnosticData {
  scores: {
    "Temperature Deviation": number;
    "Vibration Level": number;
    "Calibration Age": number;
    "Mechanical Stage Load": number;
  };
  primaryDriver: string;
  highestScore: number;
  riskScore: number;
  confidencePct: number;
}

export interface RecoveryResult {
  status: "Recovered" | "Safe Stop";
  final_error: number;
  attempts_log: AttemptLogEntry[];
  trajectory: TrajectoryPoint[];
  diagnostics: DiagnosticData;
}

export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  inputs: ModelInputs;
}
