import React, { useState, useEffect, useCallback } from "react";
import {
  ModelInputs,
  RecoveryResult,
  DashboardSection,
} from "./types";

import { PRESETS } from "./data/presets";
import { SignIn } from "./components/SignIn";
import { Header } from "./components/Header";
import { SidebarForm } from "./components/SidebarForm";
import {
  FeatureInputsPanel,
  FeatureFilter,
} from "./components/FeatureInputsPanel";
import { MachineConditions } from "./components/MachineConditions";
import { StatusBadge } from "./components/StatusBadge";
import { RecoveryTable } from "./components/RecoveryTable";
import { ConvergenceChart } from "./components/ConvergenceChart";
import { RiskAndDiagnostics } from "./components/RiskAndDiagnostics";
import { ArchitectureFooter } from "./components/ArchitectureFooter";

import {
  AlertCircle,
  RefreshCw,
  LineChart,
  Activity,
  Play,
} from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<string>("");

  const [inputs, setInputs] = useState<ModelInputs>(
    PRESETS[0].inputs
  );

  const [result, setResult] =
    useState<RecoveryResult | null>(null);

  const [isProcessing, setIsProcessing] =
    useState<boolean>(false);

  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);

  const [dashboardSection, setDashboardSection] =
    useState<DashboardSection>("ALL");

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const handleLogin = useCallback((username: string) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser("");
  }, []);

  // --------------------------------------------------
  // THEME
  // --------------------------------------------------

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  }, []);

  // --------------------------------------------------
  // FALLBACK RECOVERY
  // Used only if backend cannot be reached.
  // --------------------------------------------------

  const calculateFallbackRecovery = useCallback(
    (currentInputs: ModelInputs): RecoveryResult => {
      const maxAttempts = 3;
      const tolerance = 0.01;

      let currErrX = currentInputs.prev_err_x;
      let currErrY = currentInputs.prev_err_y;

      const initialRemaining = Math.sqrt(
        currErrX ** 2 + currErrY ** 2
      );

      const attemptsLog: any[] = [];

      const trajectory: any[] = [
        {
          attempt: 0,
          err_x: currErrX,
          err_y: currErrY,
          remaining: initialRemaining,
        },
      ];

      let status: "Recovered" | "Safe Stop" =
        "Safe Stop";

      let finalError = initialRemaining;

      for (
        let attemptNum = 1;
        attemptNum <= maxAttempts;
        attemptNum++
      ) {
        const tempExp =
          1.0 +
          (currentInputs.temp - 22.0) * 0.0012;

        const vibDamp =
          1.0 /
          (1.0 + currentInputs.vib * 0.15);

        const loadFac =
          1.0 - currentInputs.load / 1000.0;

        const gainX =
          0.942 *
          tempExp *
          vibDamp *
          loadFac;

        const gainY =
          0.938 *
          tempExp *
          vibDamp *
          loadFac;

        const corr_x = -currErrX * gainX;
        const corr_y = -currErrY * gainY;

        const newErrX = currErrX + corr_x;
        const newErrY = currErrY + corr_y;

        const remainingError = Math.sqrt(
          newErrX ** 2 + newErrY ** 2
        );

        const passed =
          remainingError <= tolerance;

        attemptsLog.push({
          attempt: attemptNum,
          input_err_x: currErrX,
          input_err_y: currErrY,
          corr_x,
          corr_y,
          new_err_x: newErrX,
          new_err_y: newErrY,
          remaining_error: remainingError,
          passed,
          status: passed ? "PASS" : "FAIL",
        });

        trajectory.push({
          attempt: attemptNum,
          err_x: newErrX,
          err_y: newErrY,
          remaining: remainingError,
        });

        currErrX = newErrX;
        currErrY = newErrY;
        finalError = remainingError;

        if (passed) {
          status = "Recovered";
          break;
        }
      }

      // Fallback diagnostic calculations
      const tempDev = Math.abs(
        currentInputs.temp - 22.0
      );

      const tempScore = Math.min(
        100,
        tempDev * 22.5
      );

      const vibScore = Math.min(
        100,
        Math.max(
          0,
          (currentInputs.vib - 0.02) * 500
        )
      );

      const calibScore = Math.min(
        100,
        Math.max(
          0,
          (currentInputs.time_since_calib - 8) *
            2.2
        )
      );

      const loadScore = Math.min(
        100,
        Math.max(
          0,
          (currentInputs.load - 10) * 3.5
        )
      );

      const scores = {
        "Temperature Deviation":
          Math.round(tempScore * 10) / 10,

        "Vibration Level":
          Math.round(vibScore * 10) / 10,

        "Calibration Age":
          Math.round(calibScore * 10) / 10,

        "Mechanical Stage Load":
          Math.round(loadScore * 10) / 10,
      };

      let primaryDriver =
        "Temperature Deviation";

      let highestScore = -1;

      for (const [key, value] of Object.entries(
        scores
      )) {
        if (value > highestScore) {
          highestScore = value;
          primaryDriver = key;
        }
      }

      const riskScore = Math.min(
        100,
        tempScore * 0.35 +
          vibScore * 0.35 +
          calibScore * 0.15 +
          loadScore * 0.15
      );

      const confidencePct = Math.max(
        0,
        100 - riskScore
      );

      return {
        status,
        final_error: finalError,
        attempts_log: attemptsLog,
        trajectory,
        diagnostics: {
          scores,
          primaryDriver,
          highestScore,
          riskScore:
            Math.round(riskScore * 10) / 10,
          confidencePct:
            Math.round(confidencePct * 10) / 10,
        },
      };
    },
    []
  );

  // --------------------------------------------------
  // RUN AI RECOVERY
  // --------------------------------------------------

  const handleRunRecovery = useCallback(
    async () => {
      setIsProcessing(true);
      setErrorMsg(null);

      try {
        const res = await fetch(
          "http://127.0.0.1:8000/recover",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Target_X: inputs.target_x,
              Target_Y: inputs.target_y,
              Temperature: inputs.temp,
              Vibration: inputs.vib,
              Speed: inputs.speed,
              Stage_Load: inputs.load,
              Direction: inputs.direction,
              Previous_Error_X: inputs.prev_err_x,
              Previous_Error_Y: inputs.prev_err_y,
              Time_Since_Calibration:
                inputs.time_since_calib,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(
            `Backend returned HTTP ${res.status}`
          );
        }

        const backendData = await res.json();

        console.log(
          "FASTAPI /recover RESPONSE:",
          backendData
        );

        const attemptHistory =
          backendData.attempt_history ?? [];

        const diagnostics =
          backendData.diagnostics ?? {};

        const getFactorScore = (
          factorName: string
        ): number => {
          const factor = (
            diagnostics.factors ?? []
          ).find(
            (f: any) => f.factor === factorName
          );

          return Number(factor?.score ?? 0);
        };

        const initialError = Math.sqrt(
          inputs.prev_err_x ** 2 +
            inputs.prev_err_y ** 2
        );

        const riskScore = Number(
          diagnostics.risk_score ?? 0
        );

        const confidencePct = Math.max(
          0,
          Math.min(100, 100 - riskScore)
        );

        setResult({
          status:
            backendData.status === "RECOVERED"
              ? "Recovered"
              : "Safe Stop",

          final_error: Number(
            backendData.final_error ?? 0
          ),

          attempts_log: attemptHistory.map(
            (a: any) => ({
              attempt: a.attempt,
              input_err_x:
                a.previous_error_x,
              input_err_y:
                a.previous_error_y,
              corr_x: a.correction_x,
              corr_y: a.correction_y,
              new_err_x:
                a.previous_error_x +
                a.correction_x,
              new_err_y:
                a.previous_error_y +
                a.correction_y,
              remaining_error:
                a.remaining_error,
              passed:
                a.remaining_error <= 0.01,
              status:
                a.remaining_error <= 0.01
                  ? "PASS"
                  : "FAIL",
            })
          ),

          trajectory: [
            {
              attempt: 0,
              err_x: inputs.prev_err_x,
              err_y: inputs.prev_err_y,
              remaining: initialError,
            },

            ...attemptHistory.map(
              (a: any) => ({
                attempt: a.attempt,
                err_x:
                  a.previous_error_x +
                  a.correction_x,
                err_y:
                  a.previous_error_y +
                  a.correction_y,
                remaining:
                  a.remaining_error,
              })
            ),
          ],

          diagnostics: {
            scores: {
              "Temperature Deviation":
                getFactorScore(
                  "THERMAL_DRIFT"
                ),

              "Vibration Level":
                getFactorScore(
                  "HIGH_VIBRATION"
                ),

              "Calibration Age":
                getFactorScore(
                  "CALIBRATION_AGING"
                ),

              "Mechanical Stage Load":
                getFactorScore(
                  "HIGH_STAGE_LOAD"
                ),

              "Position Error":
                getFactorScore(
                  "LARGE_POSITION_ERROR"
                ),
            },

            primaryDriver:
              diagnostics.primary_cause ??
              "NORMAL_OPERATION",

            highestScore: Number(
              diagnostics.primary_score ?? 0
            ),

            riskScore,

            confidencePct,
          },
        });

        console.log(
          "FRONTEND DIAGNOSTICS:",
          {
            primaryDriver:
              diagnostics.primary_cause,
            highestScore:
              diagnostics.primary_score,
            riskScore,
            confidencePct,
          }
        );
      } catch (err: any) {
        console.error(
          "FASTAPI CONNECTION ERROR:",
          err
        );

        setResult(null);

        setErrorMsg(
          "Cannot connect to FastAPI at http://127.0.0.1:8000. Make sure the backend is running."
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [inputs]
  );

  // --------------------------------------------------
  // INITIAL RECOVERY
  // --------------------------------------------------

  useEffect(() => {
    if (isLoggedIn) {
      handleRunRecovery();
    }
  }, [isLoggedIn]);

  // --------------------------------------------------
  // DASHBOARD SECTION VISIBILITY
  // --------------------------------------------------

  const isSectionVisible = (
    sectionKey: DashboardSection
  ) => {
    if (dashboardSection === "ALL") {
      return true;
    }

    if (sectionKey === "FEATURE_INPUTS") {
      return [
        "FEATURE_INPUTS",
        "TARGET_X",
        "TARGET_Y",
        "TEMP",
        "VIB",
        "SPEED",
        "LOAD",
        "DIRECTION",
        "PREV_ERR_X",
        "PREV_ERR_Y",
        "TIME_CALIB",
      ].includes(dashboardSection);
    }

    return dashboardSection === sectionKey;
  };

  // --------------------------------------------------
  // FEATURE FILTER
  // --------------------------------------------------

  const featureInputFilter: FeatureFilter = (
    [
      "ALL",
      "TARGET_X",
      "TARGET_Y",
      "TEMP",
      "VIB",
      "SPEED",
      "LOAD",
      "DIRECTION",
      "PREV_ERR_X",
      "PREV_ERR_Y",
      "TIME_CALIB",
    ].includes(dashboardSection)
      ? dashboardSection
      : "ALL"
  ) as FeatureFilter;

  // --------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------

  if (!isLoggedIn) {
    return (
      <SignIn
        onLogin={handleLogin}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // --------------------------------------------------
  // MAIN DASHBOARD
  // --------------------------------------------------

  return (
    <div
      className={`min-h-screen bg-[#E4E3E0] dark:bg-stone-950 text-[#141414] dark:text-stone-100 flex flex-col font-sans antialiased transition-colors duration-200 ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      {/* Header */}

      <Header
        onRunRecovery={handleRunRecovery}
        isProcessing={isProcessing}
        status={result?.status}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Layout */}

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-0">
        {/* Sidebar */}

        <SidebarForm
          inputs={inputs}
          onChange={setInputs}
          onRunRecovery={handleRunRecovery}
          isProcessing={isProcessing}
          currentUser={currentUser}
          onLogout={handleLogout}
          dashboardSection={dashboardSection}
          onSelectDashboardSection={
            setDashboardSection
          }
        />

        {/* Main Dashboard */}

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-x-hidden bg-[#E4E3E0] dark:bg-stone-950 transition-colors duration-200">
          {/* Error message */}

          {errorMsg && (
            <div className="p-4 bg-rose-100 border border-rose-400 rounded-lg text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />

              <span>{errorMsg}</span>
            </div>
          )}

          {/* ------------------------------------------ */}
          {/* Feature Inputs */}
          {/* ------------------------------------------ */}

          {isSectionVisible("FEATURE_INPUTS") && (
            <div id="sec-feature-inputs">
              <FeatureInputsPanel
                inputs={inputs}
                onChange={setInputs}
                onRunRecovery={
                  handleRunRecovery
                }
                isProcessing={isProcessing}
                selectedFilter={
                  featureInputFilter
                }
                onFilterChange={(filter) =>
                  setDashboardSection(
                    filter
                  )
                }
              />
            </div>
          )}

          {/* ------------------------------------------ */}
          {/* Machine Conditions */}
          {/* ------------------------------------------ */}

          {isSectionVisible(
            "MACHINE_CONDITIONS"
          ) && (
            <div id="sec-machine-conditions">
              <MachineConditions
                inputs={inputs}
              />
            </div>
          )}

          {/* ------------------------------------------ */}
          {/* Recovery Attempts */}
          {/* ------------------------------------------ */}

          {isSectionVisible(
            "RECOVERY_LOG"
          ) && (
            <div id="sec-recovery-log">
              {result ? (
                <div className="space-y-4">
                  <StatusBadge
                    status={result.status}
                    finalError={
                      result.final_error
                    }
                    attemptsCount={
                      result.attempts_log
                        .length
                    }
                  />

                  <RecoveryTable
                    attempts={
                      result.attempts_log
                    }
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-6 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mx-auto animate-spin" />

                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Recovery Attempts
                    Log Ready
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
                    Click "Run AI Recovery
                    Loop" to calculate
                    recovery steps.
                  </p>

                  <button
                    onClick={
                      handleRunRecovery
                    }
                    disabled={
                      isProcessing
                    }
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />

                    <span>
                      Run AI Recovery
                      Loop
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------ */}
          {/* Stage Visualizer */}
          {/* ------------------------------------------ */}

          {isSectionVisible(
            "STAGE_VISUALIZERS"
          ) && (
            <div id="sec-visualizers">
              {result ? (
                <ConvergenceChart
                  trajectory={
                    result.trajectory
                  }
                  targetX={
                    inputs.target_x
                  }
                  targetY={
                    inputs.target_y
                  }
                />
              ) : (
                <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-6 text-center space-y-3">
                  <LineChart className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mx-auto" />

                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Stage Visualizer
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
                    Run the AI recovery
                    loop to view
                    convergence.
                  </p>

                  <button
                    onClick={
                      handleRunRecovery
                    }
                    disabled={
                      isProcessing
                    }
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />

                    <span>
                      Run AI Recovery
                      Loop
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------ */}
          {/* Risk & Diagnostics */}
          {/* ------------------------------------------ */}

          {isSectionVisible(
            "RISK_DIAGNOSTICS"
          ) && (
            <div id="sec-diagnostics">
              {result ? (
                <RiskAndDiagnostics
                  diagnostics={
                    result.diagnostics
                  }
                />
              ) : (
                <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-6 text-center space-y-3">
                  <Activity className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />

                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Risk & Diagnostics
                    Ready
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
                    Run the AI recovery
                    loop to calculate
                    diagnostic risk
                    factors.
                  </p>

                  <button
                    onClick={
                      handleRunRecovery
                    }
                    disabled={
                      isProcessing
                    }
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />

                    <span>
                      Run AI Recovery
                      Loop
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------ */}
          {/* Architecture */}
          {/* ------------------------------------------ */}

          {isSectionVisible(
            "SYSTEM_ARCHITECTURE"
          ) && (
            <div id="sec-architecture">
              <ArchitectureFooter />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}