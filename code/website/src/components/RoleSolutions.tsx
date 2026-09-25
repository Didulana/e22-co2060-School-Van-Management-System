import React, { useState } from 'react';
import { Users, Bus, CheckCircle2, ArrowRight, HeartHandshake } from 'lucide-react';
import { PORTAL_URLS } from '../config';
import parentTrackingMockup from '../assets/parent-tracking-3d-mockup.png';

export const RoleSolutions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parents' | 'drivers'>('parents');

  return (
    <section className="w-full py-16 md:py-24 bg-[#faf8ff]" id="solutions">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider text-[#006948] font-bold">
            Targeted Portals
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight mt-1">
            Engineered for Daily Utility
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Every feature is designed around the morning reality of Sri Lankan families and dependable school van operators.
          </p>
        </div>

        {/* Tab Switcher (Parents vs Drivers Only) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-[#f2f3ff] shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('parents')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'parents'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#131b2e]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>For Parents</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('drivers')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'drivers'
                  ? 'bg-[#855300] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#131b2e]'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>For Van Drivers</span>
            </button>
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-white shadow-md p-6 sm:p-10 border border-slate-100">
          
          {/* TAB 1: PARENTS VIEW */}
          {activeTab === 'parents' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-fadeIn">
              {/* Left Column */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#006948]/10 text-[#006948] flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6 text-[#006948]" />
                </div>
                <h3 className="text-2xl font-bold text-[#131b2e]">
                  Unconditional Reassurance for Working Parents
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Never wonder if the van is stuck in city center traffic or already past your lane. With live map telemetry and instant boarding confirmations, your morning routine stays calm.
                </p>

                <ul className="flex flex-col gap-3 pt-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#006948] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#131b2e]">
                      <strong>Live Route Progression:</strong> Watch the vehicle icon advance stop-by-stop toward your gate.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#006948] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#131b2e]">
                      <strong>Boarding Confirmation:</strong> Immediate ping when your child steps aboard safely.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#006948] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#131b2e]">
                      <strong>One-Tap Absent Mode:</strong> Notify the driver with one click if your child has a fever or holiday.
                    </span>
                  </li>
                </ul>

                <div className="pt-3">
                  <a
                    href={PORTAL_URLS.parent}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <span>Open Parent Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: 3D Isometric Mobile App Snapshot */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-lg bg-[#f2f3ff] p-4 border border-slate-100">
                  <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
                    <img
                      src={parentTrackingMockup}
                      alt="KidsRoute Mobile App 3D Route Map Mockup"
                      className="w-full h-80 object-cover"
                    />
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-[#131b2e]">Van Route #04</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-[10px] font-bold">
                          ETA: 6 Mins
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Samantha Kumara (Toyota HiAce) • Approach to Galle Road
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRIVERS VIEW */}
          {activeTab === 'drivers' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-fadeIn">
              {/* Left Column */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#855300] flex items-center justify-center">
                  <Bus className="w-6 h-6 text-[#855300]" />
                </div>
                <h3 className="text-2xl font-bold text-[#131b2e]">
                  Streamlined Student Manifest for Drivers
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  No expensive tracking hardware or complicated setups. The KidsRoute Driver Portal runs smoothly on any smartphone with a clean, high-contrast, thumb-friendly pickup manifest.
                </p>

                <ul className="flex flex-col gap-3 pt-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#855300] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#131b2e]">
                      <strong>Automated Pickup Roster:</strong> Absences are excluded automatically before your vehicle rolls out.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#855300] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#131b2e]">
                      <strong>One-Tap Check-In:</strong> Mark boarding in half a second without looking away from the doorway.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#855300] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#131b2e]">
                      <strong>Delay Broadcasts:</strong> Stuck at a railway gate? Tap once to let all waiting parents know.
                    </span>
                  </li>
                </ul>

                <div className="pt-3">
                  <a
                    href={PORTAL_URLS.driver}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#855300] hover:bg-[#684000] text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <span>Open Driver Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: Driver Console Mockup */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-sm rounded-3xl bg-[#f2f3ff] p-5 shadow-inner border border-slate-200/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-pulse" />
                      <span className="font-bold text-sm text-[#131b2e]">Morning Route 02</span>
                    </div>
                    <span className="text-[11px] font-bold bg-white text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                      14 / 16 Boarded
                    </span>
                  </div>

                  {/* Student row 1 */}
                  <div className="p-3 rounded-xl bg-white shadow-sm flex items-center justify-between border border-slate-100">
                    <div>
                      <h4 className="font-bold text-xs text-[#131b2e]">Kavindu Dias</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Stop #04 • Temple Road</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#006948]/10 text-[#006948] text-[10px] font-bold">
                      Boarded
                    </span>
                  </div>

                  {/* Student row 2 */}
                  <div className="p-3 rounded-xl bg-white shadow-sm flex items-center justify-between border border-slate-100">
                    <div>
                      <h4 className="font-bold text-xs text-[#131b2e]">Senuri Silva</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Stop #05 • Lake Crescent</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#fea619] text-[#131b2e] text-[10px] font-bold shadow-xs">
                      Tap Check-In
                    </span>
                  </div>

                  {/* Student row 3 (Absent) */}
                  <div className="p-3 rounded-xl bg-[#e2e7ff]/60 flex items-center justify-between opacity-75 border border-slate-200/60">
                    <div>
                      <h4 className="font-bold text-xs text-slate-500 line-through">Nethmi Perera</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Reported Sick (Auto-Skipped)</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                      Absent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
