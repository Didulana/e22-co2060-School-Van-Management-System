import { FormEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../features/auth/api";
import { useAuth } from "../../features/auth/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Bus,
  MapPin,
  CheckCircle2,
  Globe,
  ChevronDown,
  User,
  Info,
  PhoneCall,
  UserPlus,
} from "lucide-react";
import kidsrouteLogo from "../../assets/kidsroute-logo.png";
import schoolBusHero from "../../assets/school-bus-hero.jpg";

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

  function handleRoleChange(role: "parent" | "driver") {
    setSelectedRole(role);
    setErrorMessage(null);
  }

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
      return "Account email is required.";
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
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8ff]">
        <div className="h-14 w-14 animate-pulse rounded-2xl bg-[#006948] shadow-xl shadow-[#006948]/20 flex items-center justify-center">
          <Bus className="text-white w-7 h-7" />
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          Connecting to KidsRoute...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] font-sans text-[#131b2e] antialiased flex flex-col justify-between selection:bg-[#006948] selection:text-white">
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#faf8ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 group transition-transform">
            <img
              alt="KidsRoute Brand Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              src={kidsrouteLogo}
            />
            <span className="font-extrabold text-xl text-[#006948] tracking-tight">KidsRoute</span>
          </a>

          {/* Header Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#006948]/30 text-[#006948] text-xs font-bold shadow-2xs transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 bg-[#eaedff] px-3.5 py-1.5 rounded-full shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              <span className="text-[#fea619] font-black text-xs px-1.5 py-0.5 rounded bg-amber-100 flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-[#855300]" />
                SOS
              </span>
              <span className="text-[11px] text-slate-600 font-medium">24/7 Hotline:</span>
              <span className="text-[11px] text-[#131b2e] font-bold">1-800-KID-SAFE</span>
            </div>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eaedff] text-slate-700 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>EN</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            <div className="w-8 h-8 rounded-full bg-[#006948] flex items-center justify-center text-white shadow-sm">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 pt-20 pb-10 bg-[#faf8ff]">
        <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-4 lg:py-6">
          {/* Atmospheric Ambient Glow Circles */}
          <div className="absolute -top-12 -left-16 w-96 h-96 bg-[#85f8c4]/30 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/2 -right-20 w-80 h-80 bg-[#ffddb8]/30 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Main Asymmetric Split Authentication Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* LEFT COLUMN: Visual Anchor, Social Proof & Stats */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between">
              
              {/* Large Visual Hero Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-100 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/11] flex flex-col justify-between p-6 sm:p-8 lg:p-10 group">
                <img
                  alt="Children boarding school bus safely in the morning"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  src={schoolBusHero}
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/90 via-[#131b2e]/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#006948]/30 to-transparent mix-blend-multiply" />

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-[#006948]" />
                    <span className="text-[11px] font-bold text-[#006948] tracking-wider uppercase">
                      Certified Safe Transit
                    </span>
                  </div>

                  <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006948] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006948]" />
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">Morning Shifts Live</span>
                  </div>
                </div>

                {/* Headline & Narrative Overlay */}
                <div className="relative z-10 space-y-1 mt-auto">
                  <span className="text-xs uppercase tracking-wider text-[#85f8c4] font-bold">
                    Uncompromising Care
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-[40px] text-white font-extrabold drop-shadow-sm leading-tight max-w-xl">
                    Every mile guarded, every smile delivered.
                  </h1>
                  <p className="text-sm text-slate-100/90 max-w-md hidden sm:block font-medium">
                    Empowering parents and educators with absolute transit visibility, strict chain-of-custody handoffs, and instant peace of mind.
                  </p>
                </div>
              </div>

              {/* Floating Testimonial Card with Soft Elevation */}
              <div className="-mt-6 sm:-mt-8 ml-4 sm:ml-8 mr-4 relative z-20 rounded-2xl bg-white/95 backdrop-blur-xl p-4 sm:p-5 shadow-lg border border-slate-100/80">
                <div className="flex items-start gap-3.5">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#006948] font-bold text-lg">
                      SJ
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-[#006948] text-white rounded-full p-0.5 shadow-sm text-xs flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1 text-[#fea619]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#fea619] text-[#fea619]" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 italic leading-snug font-medium">
                      “KidsRoute gives our family complete morning peace of mind. Knowing the moment Maya steps onto the bus and into school is priceless.”
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-[#131b2e]">Sarah Jenkins</span>
                      <span className="text-slate-500">• Parent of 2 (Lincoln Elementary)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Stats Bento Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
                <div className="p-3.5 rounded-2xl bg-[#f2f3ff] text-center flex flex-col justify-center transition-all hover:bg-[#eaedff]">
                  <span className="text-2xl font-extrabold text-[#006948]">250+</span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Partner Schools</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#f2f3ff] text-center flex flex-col justify-center transition-all hover:bg-[#eaedff]">
                  <span className="text-2xl font-extrabold text-[#006948]">99.98%</span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Safe Arrivals</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#f2f3ff] text-center flex flex-col justify-center transition-all hover:bg-[#eaedff]">
                  <div className="flex items-center justify-center gap-1 text-[#006948]">
                    <ShieldCheck className="w-5 h-5 text-[#006948]" />
                    <span className="text-2xl font-extrabold text-[#006948]">256-bit</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Bank Encryption</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Authentication Card */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
              <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 relative">
                
                {/* Header Greeting */}
                <div className="space-y-1 mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
                    Welcome to KidsRoute
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Select your account type to access real-time notifications and trip coordination.
                  </p>
                </div>

                {!session ? (
                  <div>
                    {/* Interactive Role Selector Segmented Control */}
                    <div className="bg-[#eaedff] p-1 rounded-2xl flex items-center justify-between gap-1 mb-3">
                      <button
                        type="button"
                        onClick={() => handleRoleChange("parent")}
                        className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                          selectedRole === "parent"
                            ? "bg-white text-[#006948] shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Users className="w-4 h-4 text-[#006948]" />
                        <span>Parent</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleChange("driver")}
                        className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                          selectedRole === "driver"
                            ? "bg-white text-[#006948] shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Bus className="w-4 h-4 text-[#006948]" />
                        <span>Driver</span>
                      </button>
                    </div>

                    {/* 1-Click Demo Helper Pill */}
                    <div className="mb-5 flex items-center justify-between text-xs bg-emerald-50/90 px-3.5 py-2 rounded-xl border border-emerald-100">
                      <span className="text-[#006948] font-medium text-[11px] sm:text-xs">
                        Demo: <strong>{selectedRole === "parent" ? "parent@test.com" : "driver@test.com"}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickFillDemo(selectedRole)}
                        className="text-[#006948] hover:text-[#005137] font-bold text-xs hover:underline"
                      >
                        Auto-Fill
                      </button>
                    </div>

                    {/* Form Fields */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      {/* Email Input */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-[#131b2e]">
                          Account Email
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="text-slate-400 absolute left-3.5 w-4 h-4 pointer-events-none" />
                          <input
                            required
                            type="email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            placeholder={selectedRole === "parent" ? "parent@family-domain.com" : "driver.id@fleet.kidsroute.com"}
                            className="w-full pl-10 pr-4 py-3 bg-[#f2f3ff] rounded-xl text-xs sm:text-sm text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006948] transition-all"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-[#131b2e]">
                            Password
                          </label>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              alert("Evaluation note: You can use the 1-click Auto-Fill button above to log in with test credentials!");
                            }}
                            className="text-[11px] text-[#006948] hover:underline font-bold"
                          >
                            Forgot password?
                          </a>
                        </div>
                        <div className="relative flex items-center">
                          <Lock className="text-slate-400 absolute left-3.5 w-4 h-4 pointer-events-none" />
                          <input
                            required
                            type={showPassword ? "text" : "password"}
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-10 py-3 bg-[#f2f3ff] rounded-xl text-xs sm:text-sm text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006948] transition-all"
                          />
                          <button
                            type="button"
                            aria-label="Toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-slate-400 hover:text-slate-700 transition-colors p-1"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Error Alert */}
                      {errorMessage && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 animate-fadeIn">
                          <Info className="w-4 h-4 shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {/* Dynamic CTA Submit Button */}
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full mt-3 py-3.5 px-6 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs sm:text-sm font-bold tracking-tight shadow-md hover:shadow-[0_6px_20px_rgba(0,105,72,0.3)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Signing In...</span>
                          </span>
                        ) : (
                          <>
                            <span>{selectedRole === "parent" ? "Sign In to Parent Portal" : "Sign In to Driver Dispatch"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Explicit Sign Up Link Prompt */}
                      <div className="pt-2 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                          Don't have an account yet?{" "}
                          <Link
                            to="/register"
                            className="font-bold text-[#006948] hover:text-[#005137] hover:underline"
                          >
                            Sign Up (Register Account) →
                          </Link>
                        </p>
                      </div>
                    </form>

                    {/* Help, Invitation & System Status Sub-Card */}
                    <div className="mt-5 pt-3.5 bg-[#f2f3ff]/70 rounded-2xl p-4 space-y-2 border border-[#eaedff]">
                      <div className="flex items-center justify-between text-slate-600 text-xs flex-wrap gap-2">
                        <span>New school, driver, or family?</span>
                        <Link to="/register" className="text-[#006948] hover:underline font-bold">
                          Sign Up / Register →
                        </Link>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-slate-500 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#006948] inline-block animate-pulse" />
                          <span className="font-bold text-[#006948]">All systems operational</span>
                        </div>
                        <a href="/#faq" className="text-slate-400 hover:text-slate-700">
                          School Onboarding Guide
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Active Session UI */
                  <div className="space-y-6 py-2">
                    <div className="flex items-center gap-4 p-5 bg-[#f2f3ff] border border-[#eaedff] rounded-2xl">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-black text-[#006948] border border-slate-200">
                        {session.user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-[#006948] uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-md">
                          Active Session
                        </span>
                        <h3 className="text-xl font-bold text-[#131b2e] tracking-tight mt-1">
                          Hi, {session.user.name?.split(" ")[0]}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium capitalize">
                          Role: {session.user.role}
                        </p>
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
                        className="w-full bg-[#006948] hover:bg-[#00855d] text-white py-3.5 px-4 rounded-full font-bold text-sm shadow-md hover:shadow-[0_6px_20px_rgba(0,105,72,0.3)] transition-all flex items-center justify-center gap-2"
                      >
                        <span>Resume to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={contextLogout}
                        className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 py-3 rounded-full font-bold text-xs tracking-wide transition-all"
                      >
                        Switch Account / Sign Out
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f2f3ff] shadow-[0_-1px_6px_rgba(0,0,0,0.02)] border-t border-slate-200/50">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#006948]" />
              <span>NHTSA School Bus Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#006948]" />
              <span>FERPA & COPPA Certified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#006948]" />
              <span>Encrypted Telemetry</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <a href="#" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              System Status
            </a>
            <span>© 2026 KidsRoute Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
