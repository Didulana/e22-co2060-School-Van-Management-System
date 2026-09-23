import React from 'react';
import { ShieldCheck, Play, ArrowRight, Zap, CheckCircle2, Navigation, Bell } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/15 to-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold mb-6 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Powered by PERN Stack & Socket.io Real-Time Telemetry</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Every Child's School Journey. <br />
            <span className="text-gradient">Tracked, Safe & Transparent.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Empowering parents, drivers, and school administrators with real-time GPS van tracking, instant boarding alerts, emergency SOS triggers, and resilient connection drop protection.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#simulator" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Explore Live Simulator</span>
            </a>
            <a 
              href="#contact" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition-all"
            >
              <span>Book Fleet Demo</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Key Value Props Checklist */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Extra Hardware Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Offline Location Fallback</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Role-Based Access Control</span>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Counter Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-5 rounded-2xl text-center border border-slate-800/80 hover:border-sky-500/30 transition-all">
            <p className="text-3xl font-extrabold text-sky-400">99.9%</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">GPS Telemetry Uptime</p>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <p className="text-3xl font-extrabold text-emerald-400">10,000+</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Safe Daily Journeys</p>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center border border-slate-800/80 hover:border-indigo-500/30 transition-all">
            <p className="text-3xl font-extrabold text-indigo-400">500+</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Connected School Vans</p>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center border border-slate-800/80 hover:border-amber-500/30 transition-all">
            <p className="text-3xl font-extrabold text-amber-400">&lt; 1 sec</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Socket Broadcast Latency</p>
          </div>
        </div>

      </div>
    </section>
  );
};
