import React from "react";
import { AttemptLogEntry } from "../types";
import { CheckCircle2, XCircle, ArrowRight, CornerDownRight, Cpu } from "lucide-react";

interface RecoveryTableProps {
  attempts: AttemptLogEntry[];
}

export const RecoveryTable: React.FC<RecoveryTableProps> = ({ attempts }) => {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 rounded-lg text-cyan-700 dark:text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Iterative Recovery Attempts Log (Max 3)
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              AI regression prediction vector applied to stage position per step
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-semibold text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-md self-start sm:self-auto">
          Tolerance Threshold: ≤ 0.0100 mm
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-sans font-bold uppercase text-[10px]">
              <th className="py-2.5 px-3">Attempt #</th>
              <th className="py-2.5 px-3">Input Error (X, Y)</th>
              <th className="py-2.5 px-3 text-cyan-900 dark:text-cyan-300">Predicted Correction (X, Y)</th>
              <th className="py-2.5 px-3">Resulting Position (X, Y)</th>
              <th className="py-2.5 px-3 text-right">Remaining Error</th>
              <th className="py-2.5 px-3 text-center">Tolerance Check</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {attempts.map((att) => (
              <tr key={att.attempt} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                <td className="py-3 px-3 font-semibold text-stone-900 dark:text-stone-100">
                  <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded border border-stone-300 dark:border-stone-700">
                    Step {att.attempt}
                  </span>
                </td>

                <td className="py-3 px-3 text-stone-800 dark:text-stone-200">
                  ({(att.input_err_x ?? 0) > 0 ? `+${Number(att.input_err_x ?? 0).toFixed(4)}` : Number(att.input_err_x ?? 0).toFixed(4)}, {(att.input_err_y ?? 0) > 0 ? `+${Number(att.input_err_y ?? 0).toFixed(4)}` : Number(att.input_err_y ?? 0).toFixed(4)}) mm
                </td>

                <td className="py-3 px-3 text-cyan-900 dark:text-cyan-400 font-bold">
                  ({(att.corr_x ?? 0) > 0 ? `+${Number(att.corr_x ?? 0).toFixed(4)}` : Number(att.corr_x ?? 0).toFixed(4)}, {(att.corr_y ?? 0) > 0 ? `+${Number(att.corr_y ?? 0).toFixed(4)}` : Number(att.corr_y ?? 0).toFixed(4)}) mm
                </td>

                <td className="py-3 px-3 text-stone-800 dark:text-stone-200">
                  ({(att.new_err_x ?? 0) > 0 ? `+${Number(att.new_err_x ?? 0).toFixed(4)}` : Number(att.new_err_x ?? 0).toFixed(4)}, {(att.new_err_y ?? 0) > 0 ? `+${Number(att.new_err_y ?? 0).toFixed(4)}` : Number(att.new_err_y ?? 0).toFixed(4)}) mm
                </td>

                <td className="py-3 px-3 text-right font-extrabold text-stone-900 dark:text-stone-100">
                  {Number(att.remaining_error ?? 0).toFixed(4)} mm
                </td>

                <td className="py-3 px-3 text-center">
                  {att.passed ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-sans font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      PASS (≤ 0.01mm)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-sans font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border border-rose-400 dark:border-rose-700">
                      <XCircle className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
                      FAIL (&gt; 0.01mm)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
