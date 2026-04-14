import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { toast } from "sonner";
import api from "../api/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("userRole", res.data.role);
      toast.success("Welcome back! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative w-full max-w-md">
        {/* Glow blob */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative bg-[#16181f] border border-white/[0.06] rounded-2xl shadow-2xl p-8">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <FiLogIn className="text-white text-lg" />
            </div>
            <div>
              <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
                Task Manager
              </p>
              <h1 className="text-xl font-bold text-white leading-tight">
                Sign In
              </h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-sm" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0f1117] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0f1117] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl py-3 pl-10 pr-11 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-sm" />
                  ) : (
                    <FiEye className="text-sm" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                <FiLogIn className="text-sm" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
