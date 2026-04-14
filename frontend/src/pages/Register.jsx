import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiShield,
} from "react-icons/fi";
import { toast } from "sonner";
import api from "../api/axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      toast.error("Username must be at least 3 characters, no spaces.");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password needs 8+ characters with at least one letter and one number.",
      );
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    setLoading(true);
    try {
      await api.post("/auth/register", { username, password, role });
      toast.success("Account created! Please sign in.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative w-full max-w-md">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative bg-[#16181f] border border-white/[0.06] rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/40">
              <FiUserPlus className="text-white text-lg" />
            </div>
            <div>
              <p className="text-xs text-violet-400 font-semibold tracking-widest uppercase">
                Task Manager
              </p>
              <h1 className="text-xl font-bold text-white leading-tight">
                Create Account
              </h1>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors text-sm" />
                <input
                  type="text"
                  placeholder="Choose a username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0f1117] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-600">
                Min. 3 characters, letters, numbers and underscores only
              </p>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0f1117] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl py-3 pl-10 pr-11 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-400 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-sm" />
                  ) : (
                    <FiEye className="text-sm" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-600">
                Min. 8 characters with at least one letter and one number
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["user", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex items-center gap-2 rounded-xl border py-2.5 px-3 text-sm font-medium transition-all ${
                      role === r
                        ? "border-violet-500/60 bg-violet-600/10 text-violet-300"
                        : "border-white/[0.08] bg-[#0f1117] text-slate-500 hover:border-white/20"
                    }`}
                  >
                    <FiShield
                      className={`text-base ${role === r ? "text-violet-400" : "text-slate-600"}`}
                    />
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                    {role === r && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all duration-200 shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 flex items-center justify-center gap-2"
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
                <FiUserPlus className="text-sm" />
              )}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
