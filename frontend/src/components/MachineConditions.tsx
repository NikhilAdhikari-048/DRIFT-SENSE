import React from "react";
import { ModelInputs } from "../types";
import { Target, Thermometer, Activity, Gauge, Weight, Compass, Clock, AlertTriangle } from "lucide-react";

interface MachineConditionsProps {
  inputs: ModelInputs;
}

export const MachineConditions: React.FC<MachineConditionsProps> = ({ inputs }) => {
  const initialOffset = Math.sqrt(((inputs?.prev_err_x ?? 0) ** 2) + ((inputs?.prev_err_y ?? 0) ** 2));

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-4 shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-stone-200 dark:border-stone-800 pb-2.5">
        <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
          <span>Machine Operating Conditions</span>
        </h2>
        <span className="text-[11px] text-stone-600 dark:text-stone-400 font-mono flex items-center gap-1.5">
          Initial Offset: <strong className="text-cyan-900 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">{Number(initialOffset ?? 0).toFixed(4)} mm</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
        {/* Target Position */}
        <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg p-2 flex flex-col justify-between">
          <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-mono tracking-wider">Target (X, Y)</span>
          <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 mt-1 text-[11px]">
            ({inputs?.target_x ?? 125}, {inputs?.target_y ?? 125})
          </span>
        </div>

        {/* Temperature */}
        <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg p-2 flex flex-col justify-between">
          <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Temp
          </span>
          <span className={`font-mono font-semibold mt-1 text-[11px] ${(inputs?.temp ?? 22) > 25.0 ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}>
            {Number(inputs?.temp ?? 22.0).toFixed(1)} °C
          </span>
        </div>

        {/* Vibration */}
        <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg p-2 flex flex-col justify-between">
          <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Vibration
          </span>
          <span className={`font-mono font-semibold mt-1 text-[11px] ${(inputs?.vib ?? 0.05) > 0.15 ? "text-rose-700 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"}`}>
            {Number(inputs?.vib ?? 0.05).toFixed(2)} g
          </span>
        </div>

        {/* Speed */}
        <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg p-2 flex flex-col justify-between">
          <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
            <Gauge className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Speed
          </span>
          <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 mt-1 text-[11px]">
            {inputs.speed} mm/s
          </span>
        </div>

        {/* Stage Load */}
        <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg p-2 flex flex-col justify-between">
          <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
            <Weight className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Load
          </span>
          <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 mt-1 text-[11px]">
            {inputs.load} kg
          </span>
        </div>

        {/* Direction */}
        <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg p-2 flex flex-col justify-between">
          <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-700 dark:text-cyan-400" /> Vector
          </span>
          <span className="font-mono font-semibold text-cyan-800 dark:text-cyan-300 mt-1 text-[11px]">
            {inputs.direction}
          </span>
        </div>

        {/* Previous Err X/Y */}
        <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg p-2 flex flex-col justify-between">
          <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-mono tracking-wider">Prev Error</span>
          <span className="font-mono font-semibold text-amber-800 dark:text-amber-300 mt-1 text-[10px] truncate">
            {inputs.prev_err_x > 0 ? `+${inputs.prev_err_x}` : inputs.prev_err_x} / {inputs.prev_err_y > 0 ? `+${inputs.prev_err_y}` : inputs.prev_err_y}
          </span>
        </div>

        {/* Calibration Age */}
        <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg p-2 flex flex-col justify-between">
          <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-700 dark:text-cyan-400" /> Calib Age
          </span>
          <span className={`font-mono font-semibold mt-1 text-[11px] ${inputs.time_since_calib > 48 ? "text-rose-700 dark:text-rose-400" : "text-stone-900 dark:text-stone-100"}`}>
            {inputs.time_since_calib} hrs
          </span>
        </div>
      </div>
    </div>
  );
};
