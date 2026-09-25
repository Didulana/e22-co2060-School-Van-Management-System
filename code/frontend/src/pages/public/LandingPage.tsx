import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import {
  BusFront,
  ShieldCheck,
  MapPin,
  Bell,
  Users,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  Zap,
  Navigation,
  ChevronRight,
  Activity,
  ShieldAlert,
  Sparkles,
  School,
  HeartHandshake,
  Check,
  CreditCard,
  PhoneCall,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"parent" | "driver" | "school">("parent");
  
  // Interactive Simulation State
  const [simulating, setSimulating] = useState(true);
  const [simStep, setSimStep] = useState(1); // 0 to 3

  const simStops = [
    { name: "Piliyandala Terminal", time: "06:45 AM", eta: "Departed", status: "completed", students: "+4 boarded" },
    { name: "Nugegoda Junction", time: "07:05 AM", eta: "Departed", status: "completed", students: "+6 boarded" },
    { name: "Bambalapitiya", time: "07:22 AM", eta: "Current Stop", status: "active", students: "Boarding now" },
    { name: "Royal College Colombo", time: "07:40 AM", eta: "ETA 12 mins", status: "upcoming", students: "School Arrival" },
  ];

  useEffect(() => {
    if (!simulating) return;
    const interval = setInterval(() => {
      setSimStep((prev) => (prev + 1) % simStops.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [simulating, simStops.length]);

  const roleDashboardRoute = session
    ? {
        admin: "/admin/dashboard",
        driver: "/driver",
        parent: "/parent",
      }[session.user.role] || "/parent"
    : "/login";

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      {/* Background Mesh Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 -right-40 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-20 left-1/3 w-[650px] h-[650px] bg-sky-600/10 rounded-full blur-[170px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Modern Floating Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b14]/75 border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-[#0b121e] rounded-2xl flex items-center justify-center">
                  <BusFront className="w-6 h-6 text-emerald-400 group-hover:rotate-3 transition-transform" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-2xl tracking-tight text-white">Kids<span className="text-emerald-400">Route</span></span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide hidden sm:block">Smart School Van Platform</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="#live-demo" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              Live Demo <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              Portals
            </a>
            <a href="#safety" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              Safety First
            </a>
          </nav>

          {/* User Auth CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {session ? (
              <button
                onClick={() => navigate(roleDashboardRoute)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group"
              >
                <span>Dashboard ({session.user.role})</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 hover:border-white/20 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ChevronRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 bg-[#0b121e] border-b border-white/10 space-y-3 animate-in fade-in">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
            >
              Features
            </a>
            <a
              href="#live-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
            >
              Live Demo
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
            >
              Portals
            </a>
            <a
              href="#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
            >
              Safety First
            </a>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              {session ? (
                <button
                  onClick={() => navigate(roleDashboardRoute)}
                  className="w-full text-center py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl"
                >
                  Open Dashboard ({session.user.role})
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 bg-white/10 text-white font-bold rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl"
                  >
                    Register Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Next-Generation Student Transit Intelligence</span>
              <Sparkles size={14} className="text-amber-400" />
            </div>

            <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.08]">
              Smarter, Safer <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                School Van Journeys
              </span>{" "}
              Every Day.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Empowering Sri Lankan parents, drivers, and schools with <strong>real-time GPS van tracking</strong>,
              instant boarding alerts, digital attendance rosters, and emergency SOS coordination in one beautiful system.
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to={session ? roleDashboardRoute : "/register"}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 hover:scale-[1.02] hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 group"
              >
                <span>{session ? "Enter Your Dashboard" : "Register as Parent / Driver"}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-base border border-white/15 hover:border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Portal</span>
                <ChevronRight size={18} className="text-slate-400" />
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-display">100%</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Verified Drivers</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">Live</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">GPS Tracking</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-400 font-display">0 Sec</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">SOS Response</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card: Interactive Live Van Tracker Demo */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Background Behind Widget */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 -z-10" />

            <div className="relative rounded-[2.5rem] bg-[#0c1524]/90 border border-white/15 p-6 shadow-2xl backdrop-blur-2xl overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Navigation size={20} className="animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      Van #WP-CAB-1234
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">Standard Daily School Route</p>
                  </div>
                </div>

                <button
                  onClick={() => setSimulating(!simulating)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
                  title="Pause/Resume Simulation"
                >
                  {simulating ? <Pause size={12} className="text-amber-400" /> : <Play size={12} className="text-emerald-400" />}
                  <span>{simulating ? "Pause" : "Play"}</span>
                </button>
              </div>

              {/* Simulated Map Visual */}
              <div className="mt-4 rounded-2xl bg-[#080d17] border border-white/10 p-4 relative overflow-hidden">
                {/* Simulated Grid Road Map */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
                
                {/* Simulated Route Path Line */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Activity size={14} /> Journey Active
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">Speed: 38 km/h</span>
                  </div>

                  {/* Route Stops Stepper */}
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-400 before:to-slate-700">
                    {simStops.map((stop, idx) => {
                      const isActive = idx === simStep;
                      const isPassed = idx < simStep;

                      return (
                        <div key={stop.name} className="relative flex items-center justify-between text-xs">
                          <div
                            className={`absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all ${
                              isActive
                                ? "bg-emerald-400 border-white scale-125 shadow-lg shadow-emerald-400/50"
                                : isPassed
                                ? "bg-emerald-600 border-emerald-500"
                                : "bg-slate-800 border-slate-600"
                            }`}
                          />
                          <div>
                            <p className={`font-bold transition-colors ${isActive ? "text-emerald-300 font-black text-sm" : isPassed ? "text-slate-300" : "text-slate-500"}`}>
                              {stop.name}
                            </p>
                            <p className="text-[10px] text-slate-400">{stop.students}</p>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              isActive
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : isPassed
                                ? "text-slate-500"
                                : "text-slate-600"
                            }`}
                          >
                            {stop.eta}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Floating Live Event Badges */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-[11px]">Boarding Synced</p>
                    <p className="text-[10px] text-slate-400">14 Students on Board</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-[11px]">SOS Monitored</p>
                    <p className="text-[10px] text-slate-400">24/7 Safety Link</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars: For Parents, Drivers & Admins */}
      <section id="features" className="py-20 bg-[#0a101b] border-t border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">Unified Architecture</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display mt-2 tracking-tight">
              One Platform. Three Tailored Portals.
            </h2>
            <p className="mt-4 text-slate-400 text-base font-medium">
              Every role receives a dedicated, distraction-free interface built specifically for their daily commute needs.
            </p>

            {/* Portal Switcher Tabs */}
            <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-white/5 border border-white/10">
              {[
                { id: "parent", label: "Parents & Guardians", icon: Users },
                { id: "driver", label: "School Van Drivers", icon: BusFront },
                { id: "school", label: "Schools & Admins", icon: School },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 shadow-md font-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Tab Content Display */}
          <div className="grid lg:grid-cols-3 gap-8">
            {activeTab === "parent" && (
              <>
                <div className="p-8 rounded-3xl bg-[#0c1626] border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Live GPS Van Map</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Watch the school van moving in real-time along its designated path. Know precisely when the van is approaching your child's pickup point.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 500m geofence arrival alerts</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Interactive Leaflet map pins</li>
                  </ul>
                </div>

                <div className="p-8 rounded-3xl bg-[#0c1626] border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Bell size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Boarding & Drop-Off Alerts</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Get instant timestamped notifications the exact moment your child steps inside the van and when safely handed over at the school gate.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Multi-child family profile</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Absence & leave logger</li>
                  </ul>
                </div>

                <div className="p-8 rounded-3xl bg-[#0c1626] border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <CreditCard size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Contactless Fee Payments</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Review automated monthly van fee statements, settle payments, and download digital receipts directly in your parent dashboard.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> Complete transaction ledger</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> Zero manual cash friction</li>
                  </ul>
                </div>
              </>
            )}

            {activeTab === "driver" && (
              <>
                <div className="p-8 rounded-3xl bg-[#0c1626] border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Digital Attendance Roster</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Mark student check-ins with one tap on your mobile screen. Know who is boarding at the next stop and see reported absences in advance.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Eliminates paper attendance books</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Instant passenger head-count</li>
                  </ul>
                </div>

                <div className="p-8 rounded-3xl bg-[#0c1626] border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <ShieldAlert size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Emergency SOS Broadcast</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Encountered heavy traffic, a flat tire, or breakdown? Trigger an instant broadcast beacon that immediately notifies all parents.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> One-touch emergency trigger</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> School admin alert synchronization</li>
                  </ul>
                </div>

                <div className="p-8 rounded-3xl bg-[#0c1626] border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Navigation size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Route Wizard & Map Pins</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Custom drag-and-drop map markers allow drivers to set their daily morning and afternoon routes, intermediate pickup points, and covered schools.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Draggable pin coordinates</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Auto-assigns students to closest stops</li>
                  </ul>
                </div>
              </>
            )}

            {activeTab === "school" && (
              <>
                <div className="p-8 rounded-3xl bg-[#0c1626] border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                    <School size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Gate Arrival Logs</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    School administrators have complete visibility over incoming school vans, estimated arrival times, and registered vehicle capacities.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check size={14} className="text-sky-400" /> Real-time gate traffic distribution</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-sky-400" /> Complete student entry audit trail</li>
                  </ul>
                </div>

                <div className="p-8 rounded-3xl bg-[#0c1626] border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Driver Verification Workflow</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Admin verification queues require drivers to upload official driving licenses, vehicle revenue licenses, and identity credentials before approval.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 1-Click driver approvals</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Vehicle capacity validation</li>
                  </ul>
                </div>

                <div className="p-8 rounded-3xl bg-[#0c1626] border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Route Network Intelligence</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    View every route network crossing across Colombo, Kandy, Galle, and major education hubs with automated student matching.
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> Active journeys map overview</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> Exportable compliance reports</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Safety & Standards Section */}
      <section id="safety" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-[3rem] bg-gradient-to-b from-[#0f1b2d] to-[#09101b] border border-white/10 p-8 sm:p-14 relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">Zero Compromise</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
                Built Around Your Child's Physical & Digital Safety.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We believe that sending your child to school should never cause anxiety. KidsRoute enforces strict validation,
                end-to-end telemetry encryption, and continuous monitoring to guarantee trustworthy transport.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <ShieldCheck size={18} /> Verified Licences
                  </div>
                  <p className="text-xs text-slate-400">Every driver is manually vetted with valid commercial driving credentials.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Zap size={18} /> Sub-Second Updates
                  </div>
                  <p className="text-xs text-slate-400">WebSocket location streaming provides continuous, zero-lag position pings.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300">
                <HeartHandshake size={40} />
              </div>
              <h4 className="text-xl font-black text-white">Join the KidsRoute Safety Net</h4>
              <p className="text-xs text-slate-300 max-w-xs">
                Already protecting hundreds of school students across Sri Lanka every weekday morning.
              </p>
              <Link
                to="/register"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-white/10 bg-[#060a12] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
            {/* Col 1 */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                  <BusFront size={18} />
                </div>
                <span className="font-display font-black text-xl text-white">KidsRoute</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart school van management and real-time tracking system. Developed for Sri Lankan schools, parents, and drivers.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-3">Portals</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/login" className="hover:text-emerald-400 transition">Parent Portal</Link></li>
                <li><Link to="/login" className="hover:text-emerald-400 transition">Driver Portal</Link></li>
                <li><Link to="/admin" className="hover:text-emerald-400 transition">Admin Console</Link></li>
                <li><Link to="/register" className="hover:text-emerald-400 transition">Driver Registration</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-3">Features</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#live-demo" className="hover:text-emerald-400 transition">Live Van Tracking</a></li>
                <li><a href="#features" className="hover:text-emerald-400 transition">Digital Rosters</a></li>
                <li><a href="#safety" className="hover:text-emerald-400 transition">Emergency SOS</a></li>
                <li><a href="#features" className="hover:text-emerald-400 transition">Contactless Payments</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-3">Emergency</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                24/7 technical hotline & support line for drivers and guardians during active journey hours.
              </p>
              <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <PhoneCall size={14} /> +94 (11) 234-5678
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} KidsRoute. Faculty of Engineering, University of Peradeniya.</p>
            <div className="flex gap-4">
              <Link to="/login" className="hover:text-slate-400">Sign In</Link>
              <span>•</span>
              <Link to="/register" className="hover:text-slate-400">Register</Link>
              <span>•</span>
              <Link to="/admin" className="hover:text-slate-400">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
