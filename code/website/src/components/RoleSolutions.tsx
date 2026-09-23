import React, { useState } from 'react';
import { Users, Bus, Building2, CheckCircle2, ShieldCheck, Map, Bell, CalendarX, AlertTriangle, CreditCard, BarChart3 } from 'lucide-react';

export const RoleSolutions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parents' | 'drivers' | 'schools'>('parents');

  return (
    <section id="solutions" className="py-20 relative bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Tailored Experience
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3">
            Designed for Every Transport Stakeholder
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Explore dedicated workflows customized specifically for parents, drivers, and school fleet managers.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl glass-card border border-slate-800">
            <button
              onClick={() => setActiveTab('parents')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'parents'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>For Parents</span>
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'drivers'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>For Drivers</span>
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'schools'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>For Schools & Fleets</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-slate-800">
          
          {activeTab === 'parents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Complete Peace of Mind on Every School Run</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Never worry about delays or missed pickups again. Track your child's van live on your smartphone, receive instant boarding notifications, and mark absences with a single tap.
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Real-time live map tracking with sub-second position updates</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Instant push & web socket alerts when child boards or alights</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Resilient offline mode with reverse-geocoded last known city</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>One-tap sickness / absence declaration before pickup times</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#0c1324] p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Map className="w-4 h-4 text-sky-400" /> Parent Dashboard View
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">LIVE TRACKING</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white">Child Status: Boarded (Seat #03)</p>
                  <p className="text-slate-400 text-[11px]">Van #04 ETA to School: 8 minutes</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white">Last Passed City</p>
                  <p className="text-slate-400 text-[11px]">Kandy Clock Tower (Geocoded via Nominatim)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drivers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Bus className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Streamlined Journeys & Emergency Readiness</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Focus on safe driving while KidsRoute handles attendance management, background GPS broadcasts, and instant emergency broadcasts to parents.
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>One-tap journey lifecycle (Start, Board, Arrive, Complete)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Digital student checklist auto-updated with parent absences</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>One-tap SOS Panic Button broadcasting emergency alerts</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Driver announcement broadcaster for route traffic updates</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#0c1324] p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-amber-400" /> Driver App Roster
                  </span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-mono">TRIP ACTIVE</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">Nuwan Perera (Stop #2)</p>
                    <p className="text-[10px] text-emerald-400">Boarded at 07:18 AM</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">Checked</span>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/30 text-xs flex justify-between items-center text-rose-300">
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> SOS Emergency Button
                  </span>
                  <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded">Ready</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schools' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Centralized Fleet Oversight & Administrative Control</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Oversee all active routes, verify driver credentials, audit journey logs, and manage transport payments through a unified Web Admin portal.
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Multi-vehicle live map monitoring across all school routes</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Monthly transport fee approval and digital receipt audit</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Driver licensing & vehicle safety compliance verification</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Historical journey playback and punctuality reporting</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#0c1324] p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-indigo-400" /> Admin Fleet Monitor
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">15 VANS ACTIVE</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between font-semibold text-white">
                    <span>Fleet Status: Operational</span>
                    <span className="text-emerald-400">100% On-Time</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Total Active Students: 340 Kids</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 flex justify-between items-center">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-sky-400" /> Transport Fees Collected
                  </span>
                  <span className="text-xs font-bold text-emerald-400">98.4%</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
