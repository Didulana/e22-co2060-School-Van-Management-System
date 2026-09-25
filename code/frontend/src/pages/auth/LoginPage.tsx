import { FormEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../features/auth/api";
import { useAuth } from "../../features/auth/AuthContext";
import {
  BusFront,
  ArrowRight,
  Mail,
  Lock,
  Info,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  Activity,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

const emptyCredentials = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { session, login: contextLogin, logout: contextLogout } = useAuth();

  const [credentials, setCredentials] = useState(emptyCredentials);
  const [selectedRole, setSelectedRole] = useState<"parent" | "driver" | "admin">("parent");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        if (!active) return;
      } catch {
        // Silently fail
      } finally {
        if (active) setIsBootstrapping(false);
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (session && !isBootstrapping) {
      const roleHome: Record<string, string> = {
        admin: "/admin/dashboard",
        driver: "/driver",
        parent: "/parent",
      };
      navigate(roleHome[session.user.role] || "/login", { replace: true });
    }
  }, [session, isBootstrapping, navigate]);

  // Demo auto-fill helper
  const handleQuickDemoFill = (role: "parent" | "driver" | "admin") => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === "parent") {
      setCredentials({ email: "parent@test.com", password: "password123" });
    } else if (role === "driver") {
      setCredentials({ email: "driver@test.com", password: "password123" });
    } else if (role === "admin") {
      setCredentials({ email: "admin@schoolvan.local", password: "Admin@123" });
    }
  };

  function validateForm() {
    if (!credentials.email.trim()) {
      return "Email address is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return "Please enter a valid email address.";
    }
    if (!credentials.password.trim()) {
      return "Password is required.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const nextSession = await login(credentials.email, credentials.password);
      contextLogin(nextSession);
      const roleHome: Record<string, string> = {
        admin: "/admin/dashboard",
        driver: "/driver",
        parent: "/parent",
      };
      navigate(roleHome[nextSession.user.role] || "/login", { replace: true });
    } catch (error: any) {
      if (
        error?.code === "pending_approval" ||
        error?.message?.includes("pending admin approval") ||
        error?.message === "pending_approval"
      ) {
        navigate("/pending-approval", { state: { email: credentials.email } });
        return;
      }
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070b14] text-white">
        <div className="h-14 w-14 animate-pulse rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
          <div className="w-full h-full bg-[#0a111e] rounded-2xl flex items-center justify-center">
            <BusFront className="text-emerald-400 w-7 h-7 animate-bounce" />
          </div>
        </div>
        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-[0.25em] animate-pulse">
          Initializing Secure Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 grid lg:grid-cols-12 font-sans relative overflow-hidden">
      {/* Background Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px]" />
      </div>

      {/* Left Column: Rich Visual Brand Experience */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-12 xl:p-16 relative border-r border-white/10 bg-gradient-to-br from-[#0a111e] via-[#080d17] to-[#070a12] overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#0b121e] rounded-2xl flex items-center justify-center">
                <BusFront className="text-emerald-400 w-6 h-6" />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-2xl text-white tracking-tight">
                Kids<span className="text-emerald-400">Route</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                School Transit Network
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all border border-white/10"
          >
            <ChevronLeft size={14} /> Back to Website
          </Link>
        </div>

        {/* Centerpiece: Hero Message & Floating Status Widgets */}
        <div className="relative z-10 py-12 space-y-8 max-w-xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time Fleet Intelligence Active</span>
            </div>
            <h1 className="font-display text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Safety, visibility, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">peace of mind</span> on every school commute.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Log in to track your school van with live telemetry, verify student boarding status, or manage driver routes.
            </p>
          </div>

          {/* Interactive Live Status Widget Cards */}
          <div className="space-y-3.5 pt-2">
            {/* Widget 1 */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl flex items-center justify-between animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Activity size={20} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Van #04 • Bambalapitiya Route</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">Arriving at Ananda College in 4 mins</p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                Live GPS
              </span>
            </div>

            {/* Widget 2 */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl flex items-center justify-between animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Student Boarding Verified</p>
                  <p className="text-[11px] text-slate-400">14 of 14 students accounted for today</p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold uppercase tracking-wider">
                Synced
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Proof Quote */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Bank-grade 256-bit SSL encrypted connection</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">v2.4-stable</span>
        </div>
      </div>

      {/* Right Column: Modern Sign-In Form */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center p-6 sm:p-10 md:p-14 lg:p-12 xl:p-16 bg-[#0a101c]/60 backdrop-blur-xl">
        <div className="max-w-md mx-auto w-full space-y-8">
          {/* Header Mobile Brand (visible only on mobile) */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <BusFront size={20} />
              </div>
              <span className="font-display font-black text-xl text-white">
                Kids<span className="text-emerald-400">Route</span>
              </span>
            </Link>
            <Link to="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1">
              <ChevronLeft size={14} /> Website
            </Link>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-3">
              <Sparkles size={12} />
              <span>Portal Access</span>
            </div>
            <h2 className="font-display text-3xl font-black text-white tracking-tight">Sign In to KidsRoute</h2>
            <p className="mt-1.5 text-slate-400 text-sm font-medium">
              Select your role or enter your credentials below.
            </p>
          </div>

          {/* Interactive Role Switcher & 1-Click Demo Buttons */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Choose Your Role</span>
              <span className="text-emerald-400 text-[10px] font-bold">⚡ Click to auto-fill demo</span>
            </label>

            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => handleQuickDemoFill("parent")}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === "parent"
                    ? "bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Users size={16} />
                <span>Parent</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill("driver")}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === "driver"
                    ? "bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <BusFront size={16} />
                <span>Driver</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill("admin")}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === "admin"
                    ? "bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <ShieldCheck size={16} />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {!session ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    required
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    placeholder="e.g. parent@test.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">Password</label>
                  <span className="text-[11px] text-slate-500">Min 6 characters</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-md border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Remember my login</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("For password resets, please contact your school administrator or system hotline at +94 (11) 234-5678.")}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-xs font-bold text-red-400 animate-in fade-in">
                  <Info size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Signing In...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Registration Link */}
              <div className="pt-4 text-center border-t border-white/10">
                <p className="text-xs text-slate-400 font-medium">
                  Don't have an account yet?{" "}
                  <Link
                    to="/register"
                    className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4"
                  >
                    Register as Parent or Driver
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            /* Active Session View */
            <div className="space-y-6 p-6 rounded-3xl bg-white/5 border border-white/10 animate-in fade-in">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Active Session
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">Hi, {session.user.name}</h3>
                  <p className="text-xs text-slate-400 font-medium capitalize">{session.user.role} Account</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() =>
                    navigate(
                      {
                        admin: "/admin/dashboard",
                        driver: "/driver",
                        parent: "/parent",
                      }[session.user.role] || "/parent"
                    )
                  }
                  className="w-full py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue to {session.user.role} Dashboard</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={contextLogout}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-bold border border-white/10 hover:border-red-500/30 transition-all"
                >
                  Sign Out & Switch Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
