import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  MapPin,
  Activity,
  Zap,
  Users,
  Award,
} from 'lucide-react';
import { PORTAL_URLS } from '../config';

export const Hero: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStep, setActiveStep] = useState(2); // 0 to 3

  const routeStops = [
    { name: "Piliyandala Town", time: "06:45 AM", eta: "Departed", students: "4 Boarded", status: "passed" },
    { name: "Nugegoda Junction", time: "07:05 AM", eta: "Departed", students: "6 Boarded", status: "passed" },
    { name: "Bambalapitiya Stop", time: "07:22 AM", eta: "At Stop Now", students: "Boarding 4", status: "current" },
    { name: "Royal College Colombo", time: "07:40 AM", eta: "ETA 12 mins", students: "Final Drop-off", status: "upcoming" },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % routeStops.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying, routeStops.length]);

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-brand-50/70 via-slate-50/50 to-canvasBg">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-brand-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-amber-400/10 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-sky-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag / Project Evaluation Header */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-brand-200/80 text-brand-800 text-xs font-bold mb-6 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping" />
            <Award className="w-3.5 h-3.5 text-brand-600" />
            <span>University of Peradeniya • 2YP CO2060 Project Evaluation</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-ink leading-[1.12]">
            Every Child's School Journey. <br />
            <span className="text-gradient">Tracked, Safe & Transparent.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Connecting Sri Lankan parents, drivers, and schools into one live ecosystem.
            Real-time GPS tracking, instant boarding alerts, and emergency coordination with zero guesswork.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a 
              href={PORTAL_URLS.signIn} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-black text-white bg-brand-600 hover:bg-brand-700 rounded-2xl shadow-lg shadow-brand-600/25 hover:shadow-brand-600/35 transition-all hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <span>Access Portal (Sign In)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href={PORTAL_URLS.getStarted} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow transition-all"
            >
              <span>Register New Account</span>
            </a>
          </div>

          {/* Trust Highlights Checklist */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Real-Time GPS Map</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Instant Boarding Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Digital Attendance Roster</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>One-Touch Emergency SOS</span>
            </div>
          </div>
        </div>

        {/* HERO INTERACTIVE SHOWCASE CARD: Live Simulated Van Journey */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative rounded-[2.5rem] bg-white border border-slate-200/80 shadow-2xl p-6 sm:p-8 overflow-hidden">
            {/* Subtle top decorative header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-inner">
                  <MapPin className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-ink">Van WP-CAB-1234</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live En Route
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Morning Run • Driver: Samantha Kumara (Toyota HiAce, 16 Seats)</p>
                </div>
              </div>

              {/* Simulation Play/Pause Controller */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pause Demo</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-brand-600" />
                      <span>Resume Demo</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Telemetry: Active</span>
              </div>
            </div>

            {/* Simulated Live Route Path */}
            <div className="mt-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 sm:p-6 relative">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-4">
                <span className="flex items-center gap-2 text-brand-700">
                  <Activity className="w-4 h-4 text-brand-600 animate-pulse" />
                  Live Route Telemetry Progress
                </span>
                <span className="text-slate-500 font-mono text-[11px]">Speed: 38 km/h • 24°C</span>
              </div>

              {/* Stepper with connecting line */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
                {routeStops.map((stop, index) => {
                  const isCurrent = index === activeStep;
                  const isPassed = index < activeStep;

                  return (
                    <div
                      key={stop.name}
                      className={`p-3.5 rounded-xl border transition-all relative ${
                        isCurrent
                          ? "bg-white border-brand-500 shadow-md ring-2 ring-brand-100"
                          : isPassed
                          ? "bg-white/80 border-slate-200 text-slate-700"
                          : "bg-slate-100/60 border-slate-200/60 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400">0{index + 1}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                            isCurrent
                              ? "bg-brand-500 text-white"
                              : isPassed
                              ? "bg-slate-200 text-slate-700"
                              : "bg-slate-200/60 text-slate-500"
                          }`}
                        >
                          {stop.eta}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold leading-tight ${isCurrent ? "text-brand-800 font-black" : "text-ink"}`}>
                        {stop.name}
                      </h4>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{stop.time}</span>
                        <span className="font-semibold text-brand-600">{stop.students}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Floating Live Telemetry Cards */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-ink text-xs">Student Boarding Synced</p>
                  <p className="text-[11px] text-slate-500 font-medium">14 of 14 students on-board</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-ink text-xs">Arrival Geofence Alert</p>
                  <p className="text-[11px] text-slate-500 font-medium">SMS & App alerts sent to parents</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-ink text-xs">Verified Vehicle</p>
                  <p className="text-[11px] text-slate-500 font-medium">Commercial insurance active</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Metric Counter Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all">
            <p className="text-3xl font-extrabold text-brand-600 font-display">10k+</p>
            <p className="text-xs text-slate-600 mt-1 font-bold">Protected Trips</p>
          </div>
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all">
            <p className="text-3xl font-extrabold text-amber-500 font-display">500+</p>
            <p className="text-xs text-slate-600 mt-1 font-bold">Active Drivers</p>
          </div>
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all">
            <p className="text-3xl font-extrabold text-sky-600 font-display">50+</p>
            <p className="text-xs text-slate-600 mt-1 font-bold">Partner Schools</p>
          </div>
          <div className="bg-white p-5 rounded-2xl text-center border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all">
            <p className="text-3xl font-extrabold text-emerald-600 font-display">100%</p>
            <p className="text-xs text-slate-600 mt-1 font-bold">Vetted Safety</p>
          </div>
        </div>

      </div>
    </section>
  );
};
