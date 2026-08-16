import React, { useState } from "react";
import { ModelInputs, Direction, PresetConfig } from "../types";
import { PRESETS } from "../data/presets";
import {
  Sliders,
  Play,
  Sparkles,
  Thermometer,
  Activity,
  Clock,
  Shuffle,
  Compass,
  Layers,
  Eye,
  Maximize2,
  Gauge,
  Weight,
  History,
  Target,
  CheckCircle2,
} from "lucide-react";

export type FeatureFilter =
  | "ALL"
  | "TARGET_X"
  | "TARGET_Y"
  | "TEMP"
  | "VIB"
  | "SPEED"
  | "LOAD"
  | "DIRECTION"
  | "PREV_ERR_X"
  | "PREV_ERR_Y"
  | "TIME_CALIB";

interface FeatureInputsPanelProps {
  inputs: ModelInputs;
  onChange: (inputs: ModelInputs) => void;
  onRunRecovery: () => void;
  isProcessing: boolean;
  selectedFilter?: FeatureFilter;
  onFilterChange?: (filter: FeatureFilter) => void;
}

export const FeatureInputsPanel: React.FC<FeatureInputsPanelProps> = ({
  inputs,
  onChange,
  onRunRecovery,
  isProcessing,
  selectedFilter: externalFilter,
  onFilterChange: externalOnFilterChange,
}) => {
  const [internalFilter, setInternalFilter] = useState<FeatureFilter>("ALL");

  const activeFilter = externalFilter !== undefined ? externalFilter : internalFilter;

  const setFilter = (filter: FeatureFilter) => {
    setInternalFilter(filter);
    if (externalOnFilterChange) {
      externalOnFilterChange(filter);
    }
  };

  const handleChange = (field: keyof ModelInputs, value: any) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  const applyPreset = (preset: PresetConfig) => {
    onChange({ ...preset.inputs });
  };

  const randomizeFeatures = () => {
    const directions: Direction[] = ["LEFT", "RIGHT", "UP", "DOWN"];

    const randTargetX = Number((Math.random() * 200 + 50).toFixed(1));
    const randTargetY = Number((Math.random() * 200 + 50).toFixed(1));
    const randTemp = Number((Math.random() * 15 + 18).toFixed(1));
    const randVib = Number((Math.random() * 0.35 + 0.02).toFixed(2));
    const randSpeed = Math.floor(Math.random() * 150 + 30);
    const randLoad = Math.floor(Math.random() * 45 + 5);
    const randDir = directions[Math.floor(Math.random() * directions.length)];
    const randErrX = Number(((Math.random() - 0.5) * 0.4).toFixed(4));
    const randErrY = Number(((Math.random() - 0.5) * 0.4).toFixed(4));
    const randTimeCalib = Math.floor(Math.random() * 100 + 2);

    onChange({
      target_x: randTargetX,
      target_y: randTargetY,
      temp: randTemp,
      vib: randVib,
      speed: randSpeed,
      load: randLoad,
      direction: randDir,
      prev_err_x: randErrX,
      prev_err_y: randErrY,
      time_since_calib: randTimeCalib,
    });
  };

  const filterButtons: { key: FeatureFilter; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { key: "ALL", label: "Show All Features (10)", shortLabel: "All Features (10)", icon: <Layers className="w-3.5 h-3.5" /> },
    { key: "TARGET_X", label: "1. Target X (mm)", shortLabel: "1. Target X", icon: <Target className="w-3.5 h-3.5" /> },
    { key: "TARGET_Y", label: "2. Target Y (mm)", shortLabel: "2. Target Y", icon: <Target className="w-3.5 h-3.5" /> },
    { key: "TEMP", label: "3. Temperature (°C)", shortLabel: "3. Temp", icon: <Thermometer className="w-3.5 h-3.5" /> },
    { key: "VIB", label: "4. Vibration (g)", shortLabel: "4. Vibration", icon: <Activity className="w-3.5 h-3.5" /> },
    { key: "SPEED", label: "5. Movement Speed (mm/s)", shortLabel: "5. Speed", icon: <Gauge className="w-3.5 h-3.5" /> },
    { key: "LOAD", label: "6. Stage Load (kg)", shortLabel: "6. Stage Load", icon: <Weight className="w-3.5 h-3.5" /> },
    { key: "DIRECTION", label: "7. Movement Direction", shortLabel: "7. Direction", icon: <Compass className="w-3.5 h-3.5" /> },
    { key: "PREV_ERR_X", label: "8. Historical Prev Err X", shortLabel: "8. Err X", icon: <History className="w-3.5 h-3.5" /> },
    { key: "PREV_ERR_Y", label: "9. Historical Prev Err Y", shortLabel: "9. Err Y", icon: <History className="w-3.5 h-3.5" /> },
    { key: "TIME_CALIB", label: "10. Time Since Calib (hrs)", shortLabel: "10. Calib Time", icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  const getActiveFilterLabel = () => {
    const found = filterButtons.find((b) => b.key === activeFilter);
    return found ? found.label : "Single Feature View";
  };

  const isFeatureVisible = (key: FeatureFilter) => {
    if (activeFilter === "ALL") return true;
    return activeFilter === key;
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 shadow-sm transition-colors duration-200">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 rounded-lg text-cyan-700 dark:text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>10 Feature Model Input Controls</span>
              <span className="px-2 py-0.5 text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono rounded border border-stone-300 dark:border-stone-700">
                AI Parameters
              </span>
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Adjust stage parameters, operating state, and historical errors for AI inference
            </p>
          </div>
        </div>

        <button
          id="btn-randomize-features-panel"
          onClick={randomizeFeatures}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-cyan-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 hover:text-cyan-900 dark:text-stone-200 dark:hover:text-cyan-300 border border-stone-300 dark:border-stone-700 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          title="Randomize all 10 feature values"
        >
          <Shuffle className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
          <span>Randomize Features</span>
        </button>
      </div>

      {/* Feature Filter Toggle Bar */}
      <div className="mb-4 bg-stone-100/80 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 rounded-xl p-2.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Select Feature Display View:</span>
          </span>
          <button
            id="btn-show-all-features-top"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === "ALL"
                ? "bg-cyan-600 text-white border-cyan-700 shadow-xs"
                : "bg-white dark:bg-stone-800 hover:bg-cyan-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Show All Features (10)</span>
          </button>
        </div>

        {/* Feature Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterButtons.map((btn) => {
            const isActive = activeFilter === btn.key;
            return (
              <button
                key={btn.key}
                id={`filter-btn-${btn.key.toLowerCase()}`}
                onClick={() => setFilter(btn.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white dark:bg-cyan-500 dark:text-stone-950 font-bold shadow-xs border border-transparent"
                    : "bg-white dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700"
                }`}
                title={`Show only ${btn.label}`}
              >
                {btn.icon}
                <span>{btn.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Badges Bar */}
      <div className="mb-5 bg-stone-50/80 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg p-2.5 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Quick Presets:</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              id={`preset-panel-btn-${preset.id}`}
              onClick={() => applyPreset(preset)}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 text-xs font-medium transition-all cursor-pointer shadow-2xs"
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Single Feature Alert / Banner when isolated */}
      {activeFilter !== "ALL" && (
        <div className="mb-4 p-3 bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-700 dark:text-cyan-400 shrink-0" />
            <span className="text-stone-800 dark:text-stone-200">
              Showing isolated view for: <strong className="text-cyan-900 dark:text-cyan-300">{getActiveFilterLabel()}</strong>
            </span>
          </div>
          <button
            onClick={() => setFilter("ALL")}
            className="px-3 py-1 bg-white dark:bg-stone-800 hover:bg-cyan-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 font-bold border border-stone-300 dark:border-stone-700 rounded-lg transition-all text-[11px] cursor-pointer flex items-center gap-1 self-start sm:self-auto"
          >
            <Layers className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>Show All 10 Features Together</span>
          </button>
        </div>
      )}

      {/* 10 Feature Inputs Form Grid */}
      <div className={`grid gap-4 text-xs ${activeFilter === "ALL" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-xl mx-auto"}`}>
        
        {/* Feature 1: Target X */}
        {isFeatureVisible("TARGET_X") && (
          <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 relative group transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                1. Target X Coordinate
              </span>
              {activeFilter === "ALL" ? (
                <button
                  onClick={() => setFilter("TARGET_X")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  title="Isolate Target X feature"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Only this</span>
                </button>
              ) : (
                <button
                  onClick={() => setFilter("ALL")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                >
                  Show All
                </button>
              )}
            </div>
            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Target X Position (mm)
              </label>
              <input
                id="panel-input-target-x"
                type="number"
                step="0.5"
                value={inputs.target_x}
                onChange={(e) => handleChange("target_x", parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 font-mono focus:border-cyan-600 dark:focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Range: 0.0 to 300.0 mm along horizontal stage</p>
          </div>
        )}

        {/* Feature 2: Target Y */}
        {isFeatureVisible("TARGET_Y") && (
          <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 relative group transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                2. Target Y Coordinate
              </span>
              {activeFilter === "ALL" ? (
                <button
                  onClick={() => setFilter("TARGET_Y")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  title="Isolate Target Y feature"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Only this</span>
                </button>
              ) : (
                <button
                  onClick={() => setFilter("ALL")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                >
                  Show All
                </button>
              )}
            </div>
            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Target Y Position (mm)
              </label>
              <input
                id="panel-input-target-y"
                type="number"
                step="0.5"
                value={inputs.target_y}
                onChange={(e) => handleChange("target_y", parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 font-mono focus:border-cyan-600 dark:focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Range: 0.0 to 300.0 mm along vertical stage</p>
          </div>
        )}

        {/* Feature 3: Temperature */}
        {isFeatureVisible("TEMP") && (
          <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-2 relative group transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                3. Ambient Temperature
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-800 dark:text-cyan-400 font-extrabold text-xs">
                  {inputs.temp.toFixed(1)} °C
                </span>
                {activeFilter === "ALL" ? (
                  <button
                    onClick={() => setFilter("TEMP")}
                    className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                    title="Isolate Temperature feature"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => setFilter("ALL")}
                    className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    Show All
                  </button>
                )}
              </div>
            </div>
            <input
              id="panel-input-temp"
              type="range"
              min="15.0"
              max="35.0"
              step="0.1"
              value={inputs.temp}
              onChange={(e) => handleChange("temp", parseFloat(e.target.value))}
              className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer my-2"
            />
            <div className="flex justify-between text-[10px] text-stone-600 dark:text-stone-400 font-mono">
              <span>15.0°C</span>
              <span>20.0°C (Base)</span>
              <span>35.0°C</span>
            </div>
          </div>
        )}

        {/* Feature 4: Vibration Level */}
        {isFeatureVisible("VIB") && (
          <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-2 relative group transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                4. Stage Vibration Level
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-800 dark:text-cyan-400 font-extrabold text-xs">
                  {inputs.vib.toFixed(2)} g
                </span>
                {activeFilter === "ALL" ? (
                  <button
                    onClick={() => setFilter("VIB")}
                    className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                    title="Isolate Vibration feature"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => setFilter("ALL")}
                    className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    Show All
                  </button>
                )}
              </div>
            </div>
            <input
              id="panel-input-vib"
              type="range"
              min="0.00"
              max="0.50"
              step="0.01"
              value={inputs.vib}
              onChange={(e) => handleChange("vib", parseFloat(e.target.value))}
              className="w-full accent-cyan-600 dark:accent-cyan-400 cursor-pointer my-2"
            />
            <div className="flex justify-between text-[10px] text-stone-600 dark:text-stone-400 font-mono">
              <span>0.00g (Nominal)</span>
              <span>0.25g</span>
              <span>0.50g (High)</span>
            </div>
          </div>
        )}

        {/* Feature 5: Speed */}
        {isFeatureVisible("SPEED") && (
          <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 relative group transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                5. Movement Speed
              </span>
              {activeFilter === "ALL" ? (
                <button
                  onClick={() => setFilter("SPEED")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  title="Isolate Speed feature"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Only this</span>
                </button>
              ) : (
                <button
                  onClick={() => setFilter("ALL")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                >
                  Show All
                </button>
              )}
            </div>
            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Stage Speed (mm/s)
              </label>
              <input
                id="panel-input-speed"
                type="number"
                min="1"
                max="300"
                value={inputs.speed}
                onChange={(e) => handleChange("speed", parseFloat(e.target.value) || 1)}
                className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 font-mono focus:border-cyan-600 dark:focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Nominal operating range: 1 to 300 mm/s</p>
          </div>
        )}

        {/* Feature 6: Stage Load */}
        {isFeatureVisible("LOAD") && (
          <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 relative group transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Weight className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                6. Stage Payload Load
              </span>
              {activeFilter === "ALL" ? (
                <button
                  onClick={() => setFilter("LOAD")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  title="Isolate Load feature"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Only this</span>
                </button>
              ) : (
                <button
                  onClick={() => setFilter("ALL")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                >
                  Show All
                </button>
              )}
            </div>
            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Stage Load (kg)
              </label>
              <input
                id="panel-input-load"
                type="number"
                min="1"
                max="100"
                value={inputs.load}
                onChange={(e) => handleChange("load", parseFloat(e.target.value) || 1)}
                className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 font-mono focus:border-cyan-600 dark:focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Total payload mass on stage: 1 to 100 kg</p>
          </div>
        )}

        {/* Feature 7: Movement Direction */}
        {isFeatureVisible("DIRECTION") && (
          <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 relative group transition-all">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                7. Stage Vector Direction
              </label>
              {activeFilter === "ALL" ? (
                <button
                  onClick={() => setFilter("DIRECTION")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  title="Isolate Direction feature"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Only this</span>
                </button>
              ) : (
                <button
                  onClick={() => setFilter("ALL")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                >
                  Show All
                </button>
              )}
            </div>
            <select
              id="panel-input-direction"
              value={inputs.direction}
              onChange={(e) => handleChange("direction", e.target.value as Direction)}
              className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 font-medium focus:border-cyan-600 dark:focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="LEFT">LEFT (Direction_LEFT=1)</option>
              <option value="RIGHT">RIGHT (Direction_RIGHT=1)</option>
              <option value="UP">UP (Direction_UP=1)</option>
              <option value="DOWN">DOWN (Direction_DOWN=1)</option>
            </select>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">One-hot encoded direction vector for AI model</p>
          </div>
        )}

        {/* Feature 8: Prev Err X */}
        {isFeatureVisible("PREV_ERR_X") && (
          <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 relative group transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                8. Prev Error X
              </span>
              {activeFilter === "ALL" ? (
                <button
                  onClick={() => setFilter("PREV_ERR_X")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  title="Isolate Prev Err X feature"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Only this</span>
                </button>
              ) : (
                <button
                  onClick={() => setFilter("ALL")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                >
                  Show All
                </button>
              )}
            </div>
            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Historical Position Error X (mm)
              </label>
              <input
                id="panel-input-prev-err-x"
                type="number"
                step="0.005"
                value={inputs.prev_err_x}
                onChange={(e) => handleChange("prev_err_x", parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 font-mono focus:border-cyan-600 dark:focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Previous loop positioning error along X-axis</p>
          </div>
        )}

        {/* Feature 9: Prev Err Y */}
        {isFeatureVisible("PREV_ERR_Y") && (
          <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 relative group transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                9. Prev Error Y
              </span>
              {activeFilter === "ALL" ? (
                <button
                  onClick={() => setFilter("PREV_ERR_Y")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  title="Isolate Prev Err Y feature"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Only this</span>
                </button>
              ) : (
                <button
                  onClick={() => setFilter("ALL")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                >
                  Show All
                </button>
              )}
            </div>
            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Historical Position Error Y (mm)
              </label>
              <input
                id="panel-input-prev-err-y"
                type="number"
                step="0.005"
                value={inputs.prev_err_y}
                onChange={(e) => handleChange("prev_err_y", parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 font-mono focus:border-cyan-600 dark:focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Previous loop positioning error along Y-axis</p>
          </div>
        )}

        {/* Feature 10: Time Since Calibration */}
        {isFeatureVisible("TIME_CALIB") && (
          <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 relative group transition-all">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                10. Time Since Calibration
              </label>
              {activeFilter === "ALL" ? (
                <button
                  onClick={() => setFilter("TIME_CALIB")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                  title="Isolate Calibration Time feature"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Only this</span>
                </button>
              ) : (
                <button
                  onClick={() => setFilter("ALL")}
                  className="text-[10px] text-stone-500 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                >
                  Show All
                </button>
              )}
            </div>
            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Elapsed Hours (hrs)
              </label>
              <input
                id="panel-input-time-calib"
                type="number"
                min="0"
                max="200"
                value={inputs.time_since_calib}
                onChange={(e) => handleChange("time_since_calib", parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-900 dark:text-stone-100 font-mono focus:border-cyan-600 dark:focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Hours since last optical stage zero calibration</p>
          </div>
        )}
      </div>

      {/* Action Submit Run Button */}
      <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {activeFilter !== "ALL" ? (
          <button
            onClick={() => setFilter("ALL")}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-start"
          >
            <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Show All 10 Features Together</span>
          </button>
        ) : (
          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            Showing all 10 feature inputs together.
          </div>
        )}

        <button
          id="panel-run-recovery-btn"
          onClick={onRunRecovery}
          disabled={isProcessing}
          className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 self-end"
        >
          <Play className="w-4 h-4 fill-current text-cyan-400 dark:text-cyan-200" />
          <span>{isProcessing ? "Computing Recovery Vector..." : "Run AI Recovery Loop"}</span>
        </button>
      </div>
    </div>
  );
};
