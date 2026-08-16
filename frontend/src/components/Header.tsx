import React from "react";
import { Cpu, Activity, RefreshCw, Sun, Moon, User, LogOut } from "lucide-react";

interface HeaderProps {
  onRunRecovery: () => void;
  isProcessing: boolean;
  status?: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  currentUser?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRunRecovery,
  isProcessing,
  status,
  theme,
  onToggleTheme,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="bg-white dark:bg-stone-900 border-b border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 py-4 px-6 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 rounded-lg text-cyan-700 dark:text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  AI Wafer Navigation Recovery
                </h1>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
                Semiconductor inspection tool recovery system demonstrating AI regression inference for corrective X/Y stage movements coupled with rule-based root cause diagnostics.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {status && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border ${
              status === "Recovered"
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/50 border-rose-400 dark:border-rose-700 text-rose-900 dark:text-rose-300"
            }`}>
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Status: {status}</span>
            </div>
          )}

          {/* User Status Label */}
          {currentUser && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300">
              <User className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
              <span>Signed in as <strong className="text-stone-900 dark:text-stone-100">{currentUser}</strong></span>
            </div>
          )}

          {/* Theme Switcher Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium text-xs rounded-lg border border-stone-300 dark:border-stone-700 transition-all cursor-pointer shadow-2xs"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          <button
            id="header-run-btn"
            onClick={onRunRecovery}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-medium text-sm rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? "animate-spin" : ""}`} />
            <span>{isProcessing ? "Executing..." : "Run Recovery"}</span>
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              id="header-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-medium text-xs rounded-lg border border-rose-300 dark:border-rose-800 transition-all cursor-pointer shadow-2xs"
              title="Logout from session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

