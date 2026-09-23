import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Wifi, WifiOff, Bell, UserCheck, Play, Pause, ShieldCheck } from 'lucide-react';

export const LiveDemoSimulator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [step, setStep] = useState(0);

  const routeSteps = [
    { city: 'Pickup Stop #1: Ampitiya Road', speed: '32 km/h', status: 'On Route', progress: 20, time: '07:10 AM' },
    { city: 'Pickup Stop #2: Kandy Lake Round', speed: '28 km/h', status: 'Student Boarded', progress: 45, time: '07:18 AM' },
    { city: 'Kandy City Center (Passing Clock Tower)', speed: '35 km/h', status: 'On Route', progress: 70, time: '07:28 AM' },
    { city: 'School Gate #02 (Hillwood College)', speed: '0 km/h', status: 'Arrived at School', progress: 100, time: '07:38 AM' }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % routeSteps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = routeSteps[step];

  return (
    <section id="simulator" className="py-20 relative bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Interactive Experience
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            Real-Time Van Telemetry & Offline Fallback
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Try our live simulator to see how parents and drivers experience real-time tracking, student boarding updates, and network disconnect resilience.
          </p>
        </div>

        {/* Simulator Card Container */}
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative overflow-hidden">
          
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Van #04 — Toyota HiAce</span>
                  <span className="text-xs font-semibold text-slate-500">(Driver: Suneth Perera)</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Route: Kandy Town → Hillwood & Kingswood Schools</p>
              </div>
            </div>

            {/* Interactive Toggle Switches */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isPlaying ? 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-100' : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Simulation' : 'Resume'}</span>
              </button>

              <button 
                onClick={() => setIsOfflineMode(!isOfflineMode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isOfflineMode 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{isOfflineMode ? 'Signal Lost (Offline)' : 'Signal Online'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Visualizer Box */}
          <div className="mt-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            
            {/* Connection Status Banner */}
            {isOfflineMode ? (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-pulse">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-amber-600" />
                  <span className="font-bold">Driver Connection Dropped: Showing Last Known Location</span>
                </div>
                <span className="bg-amber-200/80 px-2 py-0.5 rounded text-[10px] font-bold text-amber-900">Nominatim Geocoded</span>
              </div>
            ) : (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="font-bold">Live GPS Telemetry Active (Socket.io)</span>
                </div>
                <span className="text-slate-500 font-semibold">Speed: {current.speed}</span>
              </div>
            )}

            {/* Simulated Route Progress Bar */}
            <div className="relative pt-2 pb-6">
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Start: Ampitiya</span>
                <span className="text-blue-600">Current: {current.city}</span>
                <span>Destination: School</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    isOfflineMode ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-600 to-sky-500'
                  }`}
                  style={{ width: `${current.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Van Pin Display */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isOfflineMode ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  <MapPin className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Last Known City Name</p>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{current.city}</span>
                    {isOfflineMode && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">Cached</span>}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold">Timestamp</p>
                <p className="text-sm font-bold text-slate-800">{current.time}</p>
              </div>
            </div>
          </div>

          {/* Simulated Live Parent Notification Feed */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulated Parent Phone Notification Stream</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Boarding Confirmed</p>
                  <p className="text-[11px] text-slate-600">Nuwan Perera boarded Van #04 at Stop #2 (07:18 AM)</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Safety Check Passed</p>
                  <p className="text-[11px] text-slate-600">Van completed geo-fence arrival at School Gate #02</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
