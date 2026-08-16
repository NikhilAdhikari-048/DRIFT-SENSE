import React from "react";
import { Cpu, Activity, RefreshCw, LayoutDashboard, ArrowRight } from "lucide-react";

export const ArchitectureFooter: React.FC = () => {
  const components = [
    {
      title: "1. Trained AI Model",
      icon: Cpu,
      badge: "navigation_ai.pkl",
      color: "border-cyan-300 dark:border-cyan-800 bg-cyan-50/80 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200",
      description:
        "Extracts prediction[0][0] (Correction X) and prediction[0][1] (Correction Y) based on stage inputs. Does NOT predict failure or defects directly.",
    },
    {
      title: "2. Diagnostic Engine",
      icon: Activity,
      badge: "Rule-Based",
      color: "border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200",
      description:
        "Analyzes temperature drift, vibration level, calibration age, and stage load to score root-cause error drivers separately from ML model.",
    },
    {
      title: "3. Recovery Engine",
      icon: RefreshCw,
      badge: "Iterative Loop",
      color: "border-blue-300 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200",
      description:
        "Applies predicted corrections, recalculates remaining Euclidean distance, and loops up to 3 attempts until remaining error ≤ 0.01 mm.",
    },
    {
      title: "4. Dashboard UI",
      icon: LayoutDashboard,
      badge: "Interactive UI",
      color: "border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200",
      description:
        "Displays real-time machine status, convergence charts, status badges (Recovered vs Safe Stop), and root cause diagnostic rankings.",
    },
  ];

  return (
    <footer className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-6 rounded-2xl shadow-sm mt-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
            System Architecture Components
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Explicit separation of machine learning inference, rule-based diagnostics, recovery control loop, and dashboard visualization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {components.map((comp, i) => {
          const Icon = comp.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border ${comp.color} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Icon className="w-4 h-4" />
                    <span>{comp.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200">
                    {comp.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed mt-2 font-medium">
                  {comp.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </footer>
  );
};
