import React from 'react';
import { ArrowRight, ChevronDown, CheckCircle2, Satellite, ShieldCheck } from 'lucide-react';
import { PORTAL_URLS } from '../config';
import sriLankanMomChild from '../assets/sri-lankan-mom-child.jpg';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#006948]/10 via-[#faf8ff] to-[#faf8ff] pt-28 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Hero Copy */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4 z-10">
            {/* Academic Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-pulse" />
              <span className="text-xs text-[#006948] font-bold tracking-tight">
                Faculty of Engineering • University of Peradeniya • CO2060
              </span>
            </div>

            {/* Inspiring Hero Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#131b2e] tracking-tight leading-[1.08] max-w-2xl">
              Every Child's School Journey. <br />
              <span className="text-[#006948]">Tracked, Safe & Transparent.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
              Connecting Sri Lankan parents, school van drivers, and schools into one dependable real-time ecosystem. Live GPS tracking, instant boarding alerts, and emergency coordination with zero guesswork.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href={PORTAL_URLS.getStarted}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>Sign Up (Register)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={PORTAL_URLS.signIn}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#131b2e] text-xs sm:text-sm font-bold border border-slate-200 shadow-xs transition-all"
              >
                <span>Sign In</span>
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 px-4 py-3.5 text-slate-600 hover:text-[#006948] text-xs sm:text-sm font-semibold transition-colors"
              >
                <span>Learn How It Works</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>

            {/* Authentic Proof Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 w-full">
              <div className="flex flex-col p-3 rounded-xl bg-white shadow-sm border border-slate-100">
                <span className="text-2xl font-bold text-[#006948]">10k+</span>
                <span className="text-[11px] text-slate-500 uppercase font-semibold mt-0.5">Protected Trips</span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-white shadow-sm border border-slate-100">
                <span className="text-2xl font-bold text-[#855300]">500+</span>
                <span className="text-[11px] text-slate-500 uppercase font-semibold mt-0.5">Active Drivers</span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-white shadow-sm border border-slate-100">
                <span className="text-2xl font-bold text-[#006860]">50+</span>
                <span className="text-[11px] text-slate-500 uppercase font-semibold mt-0.5">Partner Routes</span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-white shadow-sm border border-slate-100">
                <span className="text-2xl font-bold text-[#006948]">100%</span>
                <span className="text-[11px] text-slate-500 uppercase font-semibold mt-0.5">Vetted Safety</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase: Authentic Sri Lankan Mom & Child with Overlay Cards */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Glow circles */}
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[#006948]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-[#fea619]/15 blur-3xl pointer-events-none" />

            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white border border-slate-100 group">
              {/* Photo */}
              <img
                src={sriLankanMomChild}
                alt="Sri Lankan mother and child with school van in morning"
                className="w-full h-[460px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/70 via-transparent to-transparent pointer-events-none" />

              {/* Floating Pill 1: Live Geofence Telemetry */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-md flex items-center gap-2.5 border border-white/60">
                <div className="w-8 h-8 rounded-full bg-[#006948]/15 flex items-center justify-center text-[#006948]">
                  <Satellite className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#131b2e]">Live Geofence Telemetry</span>
                  <span className="text-[11px] text-[#006948] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006948] animate-ping" />
                    Active Socket.io Mesh
                  </span>
                </div>
              </div>

              {/* Floating Pill 2: Instant Boarding Verification */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-between border border-white/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006948] flex items-center justify-center text-white shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#131b2e]">Safe Arrival: Emma P.</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#006948]/15 text-[#006948] text-[10px] font-bold">
                        3:15 PM
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">Van WP-CAB-1234 • Liberty Park Stop completed</span>
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-[#006948]" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
