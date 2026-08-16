import React from "react";
import { CheckCircle, AlertOctagon, ArrowRight, ShieldCheck, ShieldAlert } from "lucide-react";

interface StatusBadgeProps {
  status: "Recovered" | "Safe Stop";
  finalError: number;
  attemptsCount: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, finalError, attemptsCount }) => {
  const isRecovered = status === "Recovered";

  return (
    <div
      className={`rounded-xl border p-5 transition-all shadow-sm ${
        isRecovered
          ? "bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
          : "bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`p-3 rounded-xl border ${
              isRecovered
                ? "bg-emerald-100 dark:bg-emerald-900/60 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300"
                : "bg-rose-100 dark:bg-rose-900/60 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-300"
            }`}
          >
            {isRecovered ? (
              <ShieldCheck className="w-8 h-8" />
            ) : (
              <ShieldAlert className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider font-bold opacity-80 mb-0.5">
              Recovery Loop Outcome
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight">
                STATUS: {status.toUpperCase()}
              </span>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${
                  isRecovered
                    ? "bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700"
                    : "bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 border-rose-400 dark:border-rose-700"
                }`}
              >
                {attemptsCount} Attempt{attemptsCount > 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-xs opacity-90 mt-1 max-w-xl font-medium">
              {isRecovered
                ? `Wafer inspection stage navigation successfully recovered within 0.0100 mm tolerance limit at attempt ${attemptsCount}.`
                : `Stage navigation error remained above tolerance (> 0.0100 mm) after ${attemptsCount} attempts. Triggered automated Safe Stop protocol.`}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end border-t sm:border-t-0 sm:border-l border-stone-300 dark:border-stone-700 pt-3 sm:pt-0 sm:pl-5">
          <span className="text-xs text-stone-600 dark:text-stone-400 font-mono font-medium">Final Remaining Error</span>
          <span className="text-2xl font-mono font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-0.5">
            {Number(finalError ?? 0).toFixed(4)} <span className="text-xs font-normal text-stone-600 dark:text-stone-400">mm</span>
          </span>
          <span className="text-[11px] font-mono text-stone-600 dark:text-stone-400 font-medium mt-1">
            Target: ≤ 0.0100 mm
          </span>
        </div>
      </div>
    </div>
  );
};
