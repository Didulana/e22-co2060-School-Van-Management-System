import React from 'react';
import { Play, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white">
      {/* Background Soft Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold mb-6 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Powered by PERN Stack & Real-Time Socket Telemetry</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Every Child's School Journey. <br />
            <span className="text-gradient">Tracked, Safe & Transparent.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Empowering parents, drivers, and school administrators with real-time GPS van tracking, instant boarding alerts, emergency SOS triggers, and resilient connection drop protection.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#simulator" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Explore Live Simulator</span>
            </a>
            <a 
              href="#contact" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-sm transition-all"
            >
              <span>Book Fleet Demo</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Key Value Props Checklist */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No Extra Hardware Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Offline Location Fallback</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Role-Based Access Control</span>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Counter Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <p className="text-3xl font-extrabold text-blue-600">99.9%</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">GPS Telemetry Uptime</p>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <p className="text-3xl font-extrabold text-emerald-600">10,000+</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Safe Daily Journeys</p>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <p className="text-3xl font-extrabold text-indigo-600">500+</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Connected School Vans</p>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <p className="text-3xl font-extrabold text-amber-600">&lt; 1 sec</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Socket Broadcast Latency</p>
          </div>
        </div>

      </div>
    </section>
  );
};
