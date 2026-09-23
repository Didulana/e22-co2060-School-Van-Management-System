import React, { useState } from 'react';
import { Users, Bus, Building2, CheckCircle2, ShieldCheck, Map, AlertTriangle, CreditCard, BarChart3 } from 'lucide-react';

export const RoleSolutions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parents' | 'drivers' | 'schools'>('parents');

  return (
    <section id="solutions" className="py-20 relative bg-canvasBg border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-brand-700 uppercase bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Tailored Experience
          </span>
          <h2 className="text-3xl font-extrabold text-ink mt-3">
            Designed for Every Journey
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Explore dedicated features customized specifically for parents, drivers, and schools.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('parents')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'parents'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-ink'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>For Parents</span>
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'drivers'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-ink'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>For Drivers</span>
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'schools'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-ink'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>For Schools</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card">
          
          {activeTab === 'parents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-ink">Complete Peace of Mind on Every School Run</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Never worry about delays or missed pickups again. Track your child's van live on your smartphone, receive instant boarding notifications, and mark absences easily.
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Live tracking on an interactive map</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Instant alerts when your child boards or arrives</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>See the last known location even with a poor connection</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Easily inform drivers if your child is absent</span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Map className="w-4 h-4 text-brand-600" /> Parent Dashboard
                  </span>
                  <span className="text-[10px] bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded font-mono">LIVE TRACKING</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 shadow-sm">
                  <p className="font-bold text-ink">Child Status: Boarded (Seat #03)</p>
                  <p className="text-slate-500 text-[11px] font-medium">Van #04 ETA to School: 8 minutes</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 shadow-sm">
                  <p className="font-bold text-ink">Last Known Location</p>
                  <p className="text-slate-500 text-[11px] font-medium">Kandy Clock Tower</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drivers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Bus className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-ink">Streamlined Journeys & Easy Management</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Focus on safe driving while KidsRoute handles attendance, navigation, and keeping parents updated automatically.
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Simple daily trip controls (Start, Board, Complete)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Digital attendance checklist updated in real-time</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>One-tap emergency alerts for immediate assistance</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Easy monthly fee collection tracking</span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-amber-600" /> Driver App
                  </span>
                  <span className="text-[10px] bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded font-mono">TRIP ACTIVE</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-bold text-ink">Nuwan Perera (Stop #2)</p>
                    <p className="text-[10px] text-brand-600 font-bold">Boarded at 07:18 AM</p>
                  </div>
                  <span className="px-2 py-1 bg-brand-100 text-brand-800 rounded text-[10px] font-bold">Checked</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs flex justify-between items-center text-rose-800 shadow-sm">
                  <span className="font-bold flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-4 h-4" /> Emergency SOS
                  </span>
                  <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded font-bold">Ready</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schools' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-ink">Centralized Oversight & Better Communication</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Oversee all school vans, verify driver credentials, and ensure student safety through a unified dashboard.
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Monitor all arriving vans on a single map</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Approve driver registrations and check compliance</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Maintain detailed records of daily student transport</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Improve communication with parents and drivers</span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-brand-600" /> School Dashboard
                  </span>
                  <span className="text-[10px] bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded font-mono">15 VANS ACTIVE</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 shadow-sm">
                  <div className="flex justify-between font-bold text-ink">
                    <span>Morning Arrival Status</span>
                    <span className="text-brand-600">All On-Time</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Total Arriving Students: 340 Kids</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex justify-between items-center shadow-sm">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" /> Driver Compliance
                  </span>
                  <span className="text-xs font-bold text-brand-600">100% Verified</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
