import React from "react";
import { DiagnosticData } from "../types";
import { ShieldCheck, AlertTriangle, HelpCircle, Layers, Zap, Info } from "lucide-react";

interface RiskAndDiagnosticsProps {
  diagnostics: DiagnosticData;
}

export const RiskAndDiagnostics: React.FC<RiskAndDiagnosticsProps> = ({ diagnostics }) => {
  const { scores, primaryDriver, highestScore, riskScore, confidencePct } = diagnostics;

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800";
    if (score < 60) return "text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800";
    return "text-rose-900 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Risk & Diagnostic Confidence Gauge */}
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 shadow-sm flex flex-col justify-between transition-colors duration-200">
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-stone-200 dark:border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
              <span>Diagnostic System Confidence</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-cyan-900 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 px-2 py-0.5 rounded">
              Rule-Based Metric
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black font-mono tracking-tight text-cyan-900 dark:text-cyan-400">
              {Number(confidencePct ?? 0).toFixed(1)}%
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-md border font-bold ${getRiskColor(riskScore ?? 0)}`}>
              System Risk: {Number(riskScore ?? 0).toFixed(1)} / 100
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden border border-stone-300 dark:border-stone-700 mt-3">
            <div
              className="h-full bg-stone-900 dark:bg-cyan-500 transition-all duration-500"
              style={{ width: `${Math.min(100, confidencePct)}%` }}
            />
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-400 mt-3 font-medium">
            Evaluates environmental instability (temperature gradient, ambient vibration, calibration drift) to estimate operational safety margins.
          </p>
        </div>

        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300">
          <Info className="w-4 h-4 text-cyan-700 dark:text-cyan-400 shrink-0 mt-0.5" />
          <span>
            High confidence (&gt; 80%) indicates standard operating window where regression model corrections achieve rapid &lt; 0.01 mm convergence.
          </span>
        </div>
      </div>

      {/* Primary Error Driver / Root Cause Ranking */}
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between mb-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Primary Error Driver Analysis</span>
          </h3>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded border border-stone-300 dark:border-stone-700">
            Root Cause Ranking
          </span>
        </div>

        {/* Banner highlighting rule-based nature */}
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-lg mb-4 text-xs text-amber-950 dark:text-amber-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Rule-based Diagnostic Layer:</strong> Evaluated separately from the AI regression model prediction logic.
          </span>
        </div>

        <div className="mb-3 p-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg">
          <span className="text-xs text-stone-600 dark:text-stone-400 font-medium block">Likely Primary Root Cause:</span>
          <span className="text-sm font-bold text-amber-900 dark:text-amber-300 block mt-0.5">
            {primaryDriver} (Score: {highestScore}/100)
          </span>
        </div>

        {/* Factor Score Bars */}
        <div className="space-y-2.5 text-xs">
          {Object.entries(scores).map(([factor, scoreVal]) => {
            const score = Number(scoreVal);
            const isHighest = factor === primaryDriver;
            return (
              <div key={factor}>
                <div className="flex justify-between text-stone-800 dark:text-stone-200 mb-1">
                  <span className={isHighest ? "font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1" : "font-medium text-stone-700 dark:text-stone-300"}>
                    {isHighest && "★ "} {factor}
                  </span>
                  <span className="font-mono text-stone-600 dark:text-stone-400 font-medium">{score} / 100</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden border border-stone-300 dark:border-stone-700">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isHighest
                        ? "bg-amber-600 dark:bg-amber-500"
                        : score > 50
                        ? "bg-cyan-700 dark:bg-cyan-500"
                        : "bg-stone-400 dark:bg-stone-600"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
