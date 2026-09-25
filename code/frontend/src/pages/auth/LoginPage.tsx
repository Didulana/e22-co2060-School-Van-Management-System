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
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Activity, 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Bus,
  Award
} from "lucide-react";

const emptyCredentials = {
  email: "",
  password: "",
};

export function LoginPage() {
  const navigate = useNavigate();
  const { session, login: contextLogin, logout: contextLogout } = useAuth();

  const [credentials, setCredentials] = useState(emptyCredentials);
  const [selectedRole, setSelectedRole] = useState<"parent" | "driver">("parent");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!active) return;
      } catch {
        // Silently fail or log
      } finally {
        if (active) setIsBootstrapping(false);
      }
    }
    void bootstrap();
    return () => { active = false; };
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

  function handleQuickFillDemo(role: "parent" | "driver") {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === "parent") {
      setCredentials({
        email: "parent@test.com",
        password: "password123",
      });
    } else {
      setCredentials({
        email: "driver@test.com",
        password: "password123",
      });
    }
  }

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
      if (error?.code === "pending_approval" || error?.message?.includes("pending admin approval") || error?.message === "pending_approval") {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="h-14 w-14 animate-pulse rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-500/25 flex items-center justify-center">
          <BusFront className="text-white w-7 h-7" />
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          Connecting to KidsRoute...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex items-center justify-between">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-sm hover:shadow transition-all group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to KidsRoute Overview</span>
        </a>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Award className="w-3.5 h-3.5 text-emerald-600 hidden sm:inline" />
          <span className="hidden sm:inline">University of Peradeniya • </span>
          <span>CO2060 Project</span>
        </div>
      </header>

      {/* Main Split Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Visual & Telemetry Showcase (Cols: 7) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-8 pr-4">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-xs border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time School Transport Intelligence</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-display font-black text-slate-900 tracking-tight leading-[1.12]">
              Safe school journeys, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                monitored in real-time.
              </span>
            </h1>

            <p className="text-slate-600 text-base leading-relaxed max-w-xl font-medium">
              Log in to track your child's van live on the map, receive instant boarding notifications, or manage daily school pickup routes with zero friction.
            </p>
          </div>

          {/* Interactive Simulated Telemetry Preview Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            {/* Top Widget Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">Van WP-CAB-1234</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Route
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Driver: Samantha Kumara • Colombo South Route</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                  Speed: 38 km/h
                </span>
              </div>
            </div>

            {/* Live Progress Path Bar */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Next Stop: Bambalapitiya</span>
                </span>
                <span className="text-slate-500 font-mono text-[11px]">ETA: 6 mins</span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[68%] rounded-full animate-pulse" />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 font-semibold pt-1">
                <span>Piliyandala (06:45)</span>
                <span className="text-emerald-700 font-bold">Nugegoda (07:05)</span>
                <span>Royal College (07:40)</span>
              </div>
            </div>

            {/* Notification Badge Example */}
            <div className="mt-4 flex items-center gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-slate-700 text-[11px] font-medium">
                <span className="font-bold text-slate-900">Student Boarding Synced:</span> Asha Perera boarded safely at Stop #2 (07:18 AM)
              </p>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">RBAC Secured</p>
                <p className="text-[11px] text-slate-500">Encrypted JWT Sessions</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Offline Resilient</p>
                <p className="text-[11px] text-slate-500">Last GPS Coordinates Cached</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Form Card (Cols: 5) */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-xl shadow-slate-200/50 relative">
            
            {/* Top Brand & Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <BusFront className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-xl text-slate-900 tracking-tight">KidsRoute</span>
                  <span className="text-[10px] block font-bold text-emerald-600 uppercase tracking-wider">Portal Access</span>
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter your credentials to access your live portal.
              </p>
            </div>

            {!session ? (
              <div>
                {/* Role Switcher & 1-Click Demo Fill Tabs */}
                <div className="mb-6">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Select Your Portal
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => handleQuickFillDemo("parent")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        selectedRole === "parent"
                          ? "bg-white text-emerald-800 shadow-sm border border-slate-200/70"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Parent Portal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickFillDemo("driver")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        selectedRole === "driver"
                          ? "bg-white text-emerald-800 shadow-sm border border-slate-200/70"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Bus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Driver Portal</span>
                    </button>
                  </div>

                  {/* 1-Click Demo Auto-Fill Pill */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] bg-emerald-50/70 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                    <span className="text-emerald-800 font-medium">
                      Demo: <strong className="font-bold">{selectedRole === "parent" ? "parent@test.com" : "driver@test.com"}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickFillDemo(selectedRole)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                    >
                      Auto-Fill
                    </button>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        required
                        type="email"
                        value={credentials.email}
                        onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                        placeholder={selectedRole === "parent" ? "parent@test.com" : "driver@test.com"}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Input with Show/Hide Toggle */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                        onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Option */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                      />
                      <span>Remember this device</span>
                    </label>
                  </div>

                  {/* Error Notification Alert */}
                  {errorMessage && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-fadeIn">
                      <Info className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full mt-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </span>
                    ) : (
                      <>
                        <span>Sign In to {selectedRole === "parent" ? "Parent" : "Driver"} Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Register Link */}
                  <div className="pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                      Don't have an account yet?{" "}
                      <Link 
                        to="/register" 
                        className="text-emerald-700 font-bold hover:text-emerald-800 hover:underline"
                      >
                        Register New Account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* Already Logged In Session State */
              <div className="space-y-6 animate-fadeIn py-2">
                <div className="flex items-center gap-4 p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-black text-emerald-700 border border-emerald-200/80">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      Active Session
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                      Hi, {session.user.name?.split(" ")[0]}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium capitalize">Role: {session.user.role}</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <button
                    onClick={() => {
                      const roleHome: Record<string, string> = {
                        admin: "/admin/dashboard",
                        driver: "/driver",
                        parent: "/parent",
                      };
                      navigate(roleHome[session.user.role] || "/login");
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Resume to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={contextLogout}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs tracking-wide transition-all"
                  >
                    Switch Account / Sign Out
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* Bottom Footer Note */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Team AlphaWolves • KidsRoute School Van Management</p>
        <p className="font-medium text-slate-500">
          Faculty of Engineering • University of Peradeniya
        </p>
      </footer>
    </div>
  );
}

export default LoginPage;
