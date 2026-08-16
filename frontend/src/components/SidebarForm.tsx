import React, { useState } from "react";
import { ModelInputs, PresetConfig, DashboardSection } from "../types";
import { PRESETS } from "../data/presets";
import {
  Play,
  Sparkles,
  Thermometer,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  LineChart,
  Cpu,
  RefreshCw,
  Navigation,
  User,
  LogOut,
  Sliders,
  Layers,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface SidebarFormProps {
  inputs: ModelInputs;
  onChange: (inputs: ModelInputs) => void;
  onRunRecovery: () => void;
  isProcessing: boolean;
  currentUser?: string;
  onLogout?: () => void;
  dashboardSection?: DashboardSection;
  onSelectDashboardSection?: (section: DashboardSection) => void;
}

export const SidebarForm: React.FC<SidebarFormProps> = ({
  inputs,
  onChange,
  onRunRecovery,
  isProcessing,
  currentUser,
  onLogout,
  dashboardSection = "ALL",
  onSelectDashboardSection,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSubFeatures, setShowSubFeatures] = useState(false);

  const handleSelectSection = (section: DashboardSection) => {
    if (onSelectDashboardSection) {
      onSelectDashboardSection(section);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyPreset = (preset: PresetConfig) => {
    onChange({ ...preset.inputs });
  };

  const subFeatures: { key: DashboardSection; name: string }[] = [
    { key: "TARGET_X", name: "1. Target X" },
    { key: "TARGET_Y", name: "2. Target Y" },
    { key: "TEMP", name: "3. Temperature" },
    { key: "VIB", name: "4. Vibration" },
    { key: "SPEED", name: "5. Speed" },
    { key: "LOAD", name: "6. Stage Load" },
    { key: "DIRECTION", name: "7. Direction" },
    { key: "PREV_ERR_X", name: "8. Prev Err X" },
    { key: "PREV_ERR_Y", name: "9. Prev Err Y" },
    { key: "TIME_CALIB", name: "10. Calib Time" },
  ];

  if (isCollapsed) {
    return (
      <aside className="w-full lg:w-16 bg-[#F2F1EF] dark:bg-stone-900 border-r border-stone-300 dark:border-stone-800 p-3 flex flex-col items-center justify-between gap-4 text-stone-900 dark:text-stone-100 transition-all duration-300 shrink-0">
        <div className="flex flex-col items-center gap-3 w-full">
          <button
            id="btn-expand-sidebar"
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-cyan-800 dark:text-cyan-400 border border-stone-300 dark:border-stone-700 transition-all cursor-pointer shadow-xs"
            title="Expand Navigation & Controls"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>

          <div className="h-px w-full bg-stone-300 dark:bg-stone-800 my-0.5" />

          {/* Quick Nav Icons */}
          <button
            onClick={() => handleSelectSection("ALL")}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              dashboardSection === "ALL"
                ? "bg-cyan-600 text-white border-cyan-700 shadow-xs"
                : "bg-stone-200/80 hover:bg-cyan-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700"
            }`}
            title="Show All Features & Sections"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSelectSection("FEATURE_INPUTS")}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              dashboardSection === "FEATURE_INPUTS"
                ? "bg-cyan-600 text-white border-cyan-700 shadow-xs"
                : "bg-stone-200/80 hover:bg-cyan-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700"
            }`}
            title="10 Feature Model Inputs"
          >
            <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </button>

          <button
            onClick={() => handleSelectSection("MACHINE_CONDITIONS")}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              dashboardSection === "MACHINE_CONDITIONS"
                ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                : "bg-stone-200/80 hover:bg-cyan-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700"
            }`}
            title="Machine Conditions"
          >
            <Thermometer className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </button>

          <button
            onClick={() => handleSelectSection("RECOVERY_LOG")}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              dashboardSection === "RECOVERY_LOG"
                ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                : "bg-stone-200/80 hover:bg-cyan-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700"
            }`}
            title="Recovery Attempts Log"
          >
            <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>

          <button
            onClick={() => handleSelectSection("STAGE_VISUALIZERS")}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              dashboardSection === "STAGE_VISUALIZERS"
                ? "bg-cyan-600 text-white border-cyan-700 shadow-xs"
                : "bg-stone-200/80 hover:bg-cyan-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700"
            }`}
            title="Stage Visualizers & Trajectory"
          >
            <LineChart className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </button>

          <button
            onClick={() => handleSelectSection("RISK_DIAGNOSTICS")}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              dashboardSection === "RISK_DIAGNOSTICS"
                ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                : "bg-stone-200/80 hover:bg-cyan-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700"
            }`}
            title="Risk & Diagnostics"
          >
            <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>

          <button
            onClick={() => handleSelectSection("SYSTEM_ARCHITECTURE")}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              dashboardSection === "SYSTEM_ARCHITECTURE"
                ? "bg-stone-800 text-white border-stone-900 shadow-xs"
                : "bg-stone-200/80 hover:bg-cyan-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700"
            }`}
            title="System Architecture"
          >
            <Cpu className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          </button>
        </div>

        {/* Action Run Button in collapsed state */}
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            id="sidebar-run-recovery-btn-collapsed"
            onClick={onRunRecovery}
            disabled={isProcessing}
            className="w-full p-3 bg-stone-900 hover:bg-stone-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white rounded-xl shadow-sm transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
            title="Run Recovery"
          >
            <Play className="w-4 h-4 fill-current text-cyan-400 dark:text-cyan-200" />
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-72 bg-[#F2F1EF] dark:bg-stone-900 border-r border-stone-300 dark:border-stone-800 p-5 flex flex-col justify-between text-stone-900 dark:text-stone-100 transition-all duration-300 shrink-0">
      <div className="space-y-5">
        {/* Navigation Sidebar Header */}
        <div className="flex items-center justify-between gap-2 border-b border-stone-300 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-wider shrink-0">
            <Navigation className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
            <span>Navigation & Controls</span>
          </div>
          <button
            id="btn-collapse-sidebar"
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-md bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 transition-all cursor-pointer shrink-0"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
          </button>
        </div>

        {/* Quick Nav Links Grid */}
        <div className="bg-white dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700/80 rounded-xl p-3 shadow-xs space-y-2">
          <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block px-1">
            Display Dashboard View:
          </span>

          <div className="flex flex-col gap-1.5 text-xs font-semibold">
            {/* SHOW ALL FEATURES & SECTIONS BUTTON */}
            <button
              id="sidebar-show-all-btn"
              onClick={() => handleSelectSection("ALL")}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                dashboardSection === "ALL"
                  ? "bg-cyan-600 text-white border-cyan-700 font-bold shadow-xs"
                  : "bg-stone-100 hover:bg-cyan-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>Show All Features & Sections</span>
              </div>
              {dashboardSection === "ALL" && (
                <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
              )}
            </button>

            <div className="h-px bg-stone-200 dark:bg-stone-800 my-1" />

            {/* 10 Feature Inputs Accordion/Button */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-1">
                <button
                  id="nav-btn-feature-inputs"
                  onClick={() => handleSelectSection("FEATURE_INPUTS")}
                  className={`flex-1 flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all cursor-pointer text-left ${
                    dashboardSection === "FEATURE_INPUTS"
                      ? "bg-cyan-50 dark:bg-stone-800 text-cyan-900 dark:text-cyan-300 border-cyan-400 dark:border-cyan-700 font-bold"
                      : "bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>10 Feature Inputs</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                    10
                  </span>
                </button>

                <button
                  onClick={() => setShowSubFeatures(!showSubFeatures)}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                  title={showSubFeatures ? "Hide Feature List" : "Select Specific Single Feature"}
                >
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSubFeatures ? "rotate-90" : ""}`} />
                </button>
              </div>

              {/* Sub-feature buttons list */}
              {showSubFeatures && (
                <div className="pl-3 pr-1 py-2 bg-stone-50/90 dark:bg-stone-950/50 rounded-lg border border-stone-200 dark:border-stone-800 flex flex-col gap-1 my-1 text-[11px]">
                  <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Isolate Single Input:</span>
                    <button
                      onClick={() => handleSelectSection("ALL")}
                      className="text-cyan-700 dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      Show All
                    </button>
                  </div>
                  {subFeatures.map((f) => (
                    <button
                      key={f.key}
                      id={`sidebar-subfeature-btn-${f.key.toLowerCase()}`}
                      onClick={() => handleSelectSection(f.key)}
                      className={`text-left px-2 py-1.5 rounded transition-all cursor-pointer flex items-center justify-between ${
                        dashboardSection === f.key
                          ? "bg-cyan-600 text-white font-bold"
                          : "hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200"
                      }`}
                    >
                      <span>{f.name}</span>
                      {dashboardSection === f.key && <span className="text-[9px] uppercase font-mono">Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Machine Conditions */}
            <button
              id="sidebar-nav-machine-conditions"
              onClick={() => handleSelectSection("MACHINE_CONDITIONS")}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all cursor-pointer text-left ${
                dashboardSection === "MACHINE_CONDITIONS"
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-400 dark:border-rose-700 font-bold"
                  : "bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Machine Conditions</span>
              </div>
              {dashboardSection === "MACHINE_CONDITIONS" && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 uppercase">
                  Active
                </span>
              )}
            </button>

            {/* Recovery Attempts Log */}
            <button
              id="sidebar-nav-recovery-log"
              onClick={() => handleSelectSection("RECOVERY_LOG")}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all cursor-pointer text-left ${
                dashboardSection === "RECOVERY_LOG"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border-blue-400 dark:border-blue-700 font-bold"
                  : "bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Recovery Attempts Log</span>
              </div>
              {dashboardSection === "RECOVERY_LOG" && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 uppercase">
                  Active
                </span>
              )}
            </button>

            {/* Stage Visualizers */}
            <button
              id="sidebar-nav-visualizers"
              onClick={() => handleSelectSection("STAGE_VISUALIZERS")}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all cursor-pointer text-left ${
                dashboardSection === "STAGE_VISUALIZERS"
                  ? "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-300 border-cyan-400 dark:border-cyan-700 font-bold"
                  : "bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Stage Visualizers</span>
              </div>
              {dashboardSection === "STAGE_VISUALIZERS" && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-200 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 uppercase">
                  Active
                </span>
              )}
            </button>

            {/* Risk & Diagnostics */}
            <button
              id="sidebar-nav-diagnostics"
              onClick={() => handleSelectSection("RISK_DIAGNOSTICS")}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all cursor-pointer text-left ${
                dashboardSection === "RISK_DIAGNOSTICS"
                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-700 font-bold"
                  : "bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Risk & Diagnostics</span>
              </div>
              {dashboardSection === "RISK_DIAGNOSTICS" && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 uppercase">
                  Active
                </span>
              )}
            </button>

            {/* System Architecture */}
            <button
              id="sidebar-nav-architecture"
              onClick={() => handleSelectSection("SYSTEM_ARCHITECTURE")}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all cursor-pointer text-left ${
                dashboardSection === "SYSTEM_ARCHITECTURE"
                  ? "bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 border-stone-400 dark:border-stone-600 font-bold"
                  : "bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-stone-600 dark:text-stone-400 shrink-0" />
                <span>System Architecture</span>
              </div>
              {dashboardSection === "SYSTEM_ARCHITECTURE" && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-300 dark:bg-stone-600 text-stone-800 dark:text-stone-100 uppercase">
                  Active
                </span>
              )}
            </button>
          </div>
        </div>


      </div>

      {/* Action Button & User Footer */}
      <div className="space-y-3 pt-4 mt-6 border-t border-stone-300 dark:border-stone-800">
        <button
          id="sidebar-run-recovery-btn"
          onClick={onRunRecovery}
          disabled={isProcessing}
          className="w-full py-3 bg-stone-900 hover:bg-stone-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current text-cyan-400 dark:text-cyan-200" />
          <span>{isProcessing ? "Computing..." : "Run Recovery Loop"}</span>
        </button>

        {currentUser && (
          <div className="flex items-center justify-between gap-2 p-2 bg-stone-200/70 dark:bg-stone-800/80 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 border border-stone-300/80 dark:border-stone-700/80">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <User className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400 shrink-0" />
              <span className="truncate">Signed in as <strong className="text-stone-900 dark:text-stone-100">{currentUser}</strong></span>
            </div>
            {onLogout && (
              <button
                id="sidebar-logout-btn"
                onClick={onLogout}
                className="p-1 text-rose-700 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded transition-all cursor-pointer shrink-0"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
