import React, { useState } from "react";
import { TrajectoryPoint } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { LineChart as ChartIcon, Crosshair, Layers } from "lucide-react";

interface ConvergenceChartProps {
  trajectory: TrajectoryPoint[];
  targetX: number;
  targetY: number;
}

export const ConvergenceChart: React.FC<ConvergenceChartProps> = ({
  trajectory,
  targetX,
  targetY,
}) => {
  const [activeTab, setActiveTab] = useState<"both" | "convergence" | "trajectory">("both");

  const lineData = trajectory.map((t) => ({
    attempt: `Step ${t.attempt}`,
    remaining: Number((t.remaining ?? 0).toFixed(5)),
    tolerance: 0.01,
  }));

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 shadow-sm transition-colors duration-200">
      {/* Top Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 rounded-lg text-cyan-700 dark:text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Stage Inspection Visualizers
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Toggle between error convergence metrics, 2D vector trajectories, or split view
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-lg border border-stone-200 dark:border-stone-700/80 self-start sm:self-auto">
          <button
            id="tab-both-btn"
            onClick={() => setActiveTab("both")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === "both"
                ? "bg-white dark:bg-stone-900 text-cyan-900 dark:text-cyan-300 shadow-xs border border-stone-200 dark:border-stone-700"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            }`}
          >
            Both Views
          </button>

          <button
            id="tab-convergence-btn"
            onClick={() => setActiveTab("convergence")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "convergence"
                ? "bg-white dark:bg-stone-900 text-cyan-900 dark:text-cyan-300 shadow-xs border border-stone-200 dark:border-stone-700"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            }`}
          >
            <ChartIcon className="w-3.5 h-3.5" />
            <span>Error Convergence</span>
          </button>

          <button
            id="tab-trajectory-btn"
            onClick={() => setActiveTab("trajectory")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "trajectory"
                ? "bg-white dark:bg-stone-900 text-cyan-900 dark:text-cyan-300 shadow-xs border border-stone-200 dark:border-stone-700"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>2D Trajectory</span>
          </button>
        </div>
      </div>

      {/* Main Charts Container */}
      <div className={`grid gap-5 ${activeTab === "both" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Chart 1: Error Distance Convergence */}
        {(activeTab === "both" || activeTab === "convergence") && (
          <div className="bg-stone-50/50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 rounded-xl p-4 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-stone-200 dark:border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <ChartIcon className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  Error Distance Convergence (mm)
                </h3>
              </div>
              <span className="text-xs text-stone-600 dark:text-stone-400 font-mono font-medium">
                Tolerance: 0.01 mm
              </span>
            </div>

            <div className={activeTab === "convergence" ? "h-80 w-full" : "h-64 w-full"}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-stone-200 dark:stroke-stone-800" />
                  <XAxis dataKey="attempt" className="stroke-stone-600 dark:stroke-stone-400" fontSize={12} />
                  <YAxis
                    className="stroke-stone-600 dark:stroke-stone-400"
                    fontSize={12}
                    domain={[0, "auto"]}
                    tickFormatter={(val) => typeof val === "number" && !isNaN(val) ? val.toFixed(3) : String(val ?? "")}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1917",
                      borderColor: "#44403c",
                      borderRadius: "8px",
                      color: "#f5f5f4",
                      fontSize: "12px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                    formatter={(value: any) => [`${value} mm`, "Remaining Error"]}
                  />
                  <ReferenceLine
                    y={0.01}
                    label={{
                      value: "0.01 mm Tolerance Limit",
                      fill: "#10b981",
                      fontSize: 11,
                      position: "top",
                      fontWeight: "bold",
                    }}
                    stroke="#059669"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="remaining"
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#0369a1" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: 2D Stage Trajectory Plot */}
        {(activeTab === "both" || activeTab === "trajectory") && (
          <div className="bg-stone-50/50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex flex-col transition-colors duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-stone-200 dark:border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  2D Inspection Stage Vector Trajectory
                </h3>
              </div>
              <span className="text-xs text-stone-600 dark:text-stone-400 font-mono font-medium">
                Target: ({targetX}, {targetY})
              </span>
            </div>

            <div className={`${activeTab === "trajectory" ? "h-80" : "h-64"} w-full relative bg-stone-100/60 dark:bg-stone-950 rounded-lg border border-stone-300 dark:border-stone-800 p-2 flex items-center justify-center`}>
              {/* Custom SVG Stage Grid */}
              <svg className="w-full h-full overflow-visible" viewBox="-0.5 -0.5 1.0 1.0">
                {/* Target Crosshair at Origin */}
                <line x1="-0.5" y1="0" x2="0.5" y2="0" className="stroke-stone-300 dark:stroke-stone-700" strokeWidth="0.005" strokeDasharray="0.02" />
                <line x1="0" y1="-0.5" x2="0" y2="0.5" className="stroke-stone-300 dark:stroke-stone-700" strokeWidth="0.005" strokeDasharray="0.02" />

                {/* Tolerance circle 0.01 radius scaled up for view */}
                <circle cx="0" cy="0" r="0.05" fill="#10b98115" stroke="#059669" strokeWidth="0.004" strokeDasharray="0.01" />

                {/* Trajectory vector path */}
                {trajectory.map((pt, idx) => {
                  if (idx === 0) return null;
                  const prev = trajectory[idx - 1];
                  const scale = 1.2;
                  return (
                    <line
                      key={idx}
                      x1={prev.err_x * scale}
                      y1={-prev.err_y * scale}
                      x2={pt.err_x * scale}
                      y2={-pt.err_y * scale}
                      stroke="#38bdf8"
                      strokeWidth="0.008"
                      strokeDasharray="0.01"
                    />
                  );
                })}

                {/* Stage Position Points */}
                {trajectory.map((pt) => {
                  const scale = 1.2;
                  const isFirst = pt.attempt === 0;
                  const isLast = pt.attempt === trajectory.length - 1;
                  return (
                    <g key={pt.attempt}>
                      <circle
                        cx={pt.err_x * scale}
                        cy={-pt.err_y * scale}
                        r={isLast ? "0.025" : "0.018"}
                        fill={isLast ? "#10b981" : isFirst ? "#f43f5e" : "#0284c7"}
                        stroke="#ffffff"
                        strokeWidth="0.003"
                      />
                      <text
                        x={pt.err_x * scale + 0.03}
                        y={-pt.err_y * scale + 0.01}
                        fontSize="0.035"
                        className="fill-stone-700 dark:fill-stone-300"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        Step {pt.attempt}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend overlay */}
              <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-stone-900/90 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 flex items-center gap-3 text-[10px] text-stone-700 dark:text-stone-300 shadow-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span> Initial State
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span> Iteration
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Final / Recovered
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

