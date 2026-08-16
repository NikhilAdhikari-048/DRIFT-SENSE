import React, { useState } from "react";
import { Cpu, Lock, User, LogIn, AlertTriangle, ShieldCheck, Sun, Moon, CheckSquare, Square, Loader2 } from "lucide-react";

// TODO: replace with real authentication (SSO / DB / auth API)
const DEMO_USERS: Record<string, string> = {
  admin: "admin123",
  operator: "wafer2026",
};

interface SignInProps {
  onLogin: (username: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onLogin, theme, onToggleTheme }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setWarningMsg(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    // Light input validation: don't allow empty submission
    if (!trimmedUser || !trimmedPass) {
      setWarningMsg("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    // Brief artificial delay for Streamlit spinner feel
    setTimeout(() => {
      // TODO: replace with real authentication (SSO / DB / auth API)
      const expectedPassword = DEMO_USERS[trimmedUser];

      if (expectedPassword && expectedPassword === trimmedPass) {
        onLogin(trimmedUser);
      } else {
        // Don't reveal which field was wrong
        setErrorMsg("Invalid username or password.");
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Navbar with Theme Toggle */}
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 rounded-lg text-cyan-700 dark:text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm tracking-tight text-stone-900 dark:text-stone-100">
            AI Wafer Navigation Recovery
          </span>
        </div>

        <button
          id="login-theme-toggle-btn"
          onClick={onToggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium text-xs rounded-lg border border-stone-300 dark:border-stone-800 transition-all cursor-pointer shadow-2xs"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-stone-700" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Centered Streamlit-Style Form Layout */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Spacer column left (Streamlit col 1) */}
          <div className="hidden md:block md:col-span-3 lg:col-span-4" />

          {/* Middle column form container (Streamlit col 2) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-md transition-colors duration-200">
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800/80 rounded-2xl text-cyan-700 dark:text-cyan-400 mb-3 shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                AI Wafer Navigation Recovery
              </h1>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Sign in to access the recovery dashboard.
              </p>
            </div>

            {/* Error / Warning Alert Banners */}
            {warningMsg && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{warningMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    disabled={isLoading}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={isLoading}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer select-none"
                >
                  {rememberMe ? (
                    <CheckSquare className="w-4 h-4 text-cyan-600 dark:text-cyan-400 fill-cyan-100 dark:fill-cyan-950" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400" />
                  )}
                  <span>Remember me</span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                id="sign-in-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400 dark:text-cyan-200" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* TODO: replace with real authentication comment & demo hint box */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800/80 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 block mb-1">
                Demo Accounts
              </span>
              <div className="bg-stone-100 dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800 rounded-lg p-2 font-mono text-[11px] text-stone-700 dark:text-stone-300 space-y-0.5">
                <div><span className="text-cyan-700 dark:text-cyan-400 font-bold">admin</span> : admin123</div>
                <div><span className="text-cyan-700 dark:text-cyan-400 font-bold">operator</span> : wafer2026</div>
              </div>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 italic mt-2">
                # TODO: replace with real authentication (SSO / DB / auth API)
              </p>
            </div>
          </div>

          {/* Spacer column right (Streamlit col 3) */}
          <div className="hidden md:block md:col-span-3 lg:col-span-4" />
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center py-4 text-xs text-stone-500 dark:text-stone-500 border-t border-stone-200 dark:border-stone-900">
        AI Wafer Navigation Recovery &copy; 2026 Semiconductor AI Systems
      </div>
    </div>
  );
};
