import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PORTAL_URLS } from '../config';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-white">
      {/* Background Soft Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-400/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Safety First. Always.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-tight">
            Every Child's School Journey. <br />
            <span className="text-gradient">Tracked, Safe & Transparent.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Connecting parents, drivers, and schools. Experience peace of mind with real-time tracking, seamless communication, and efficient school van management.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={PORTAL_URLS.getStarted} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href={PORTAL_URLS.signIn} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-sm transition-all"
            >
              <span>Sign In</span>
            </a>
          </div>

          {/* Key Value Props Checklist */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-2">
               <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Real-Time GPS Tracking</span>
            </div>
            <div className="flex items-center gap-2">
               <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Instant Notifications</span>
            </div>
            <div className="flex items-center gap-2">
               <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Secure Payments</span>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Counter Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <p className="text-3xl font-extrabold text-brand-600">10k+</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Happy Parents</p>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <p className="text-3xl font-extrabold text-amber-500">500+</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Trusted Drivers</p>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <p className="text-3xl font-extrabold text-blue-500">50+</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Partner Schools</p>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <p className="text-3xl font-extrabold text-rose-500">100%</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Commitment to Safety</p>
          </div>
        </div>

      </div>
    </section>
  );
};

