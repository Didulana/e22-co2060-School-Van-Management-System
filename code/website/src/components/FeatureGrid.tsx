import React from 'react';
import { FEATURES_DATA } from '../data/contentData';
import { MapPin, WifiOff, BellRing, AlertTriangle, CalendarX, CreditCard } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'MapPin': return <MapPin className="w-6 h-6 text-sky-400" />;
      case 'WifiOff': return <WifiOff className="w-6 h-6 text-amber-400" />;
      case 'BellRing': return <BellRing className="w-6 h-6 text-emerald-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-6 h-6 text-rose-400" />;
      case 'CalendarX': return <CalendarX className="w-6 h-6 text-indigo-400" />;
      case 'CreditCard': return <CreditCard className="w-6 h-6 text-cyan-400" />;
      default: return <MapPin className="w-6 h-6 text-sky-400" />;
    }
  };

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-sky-400 uppercase bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
            System Architecture Highlights
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Engineered for Safety, Speed & Resilience
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Built on Node.js, Express, React, PostgreSQL, and Socket.io with OpenStreetMap & Nominatim geocoding services.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_DATA.map((feature) => (
            <div 
              key={feature.id}
              className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-800/80 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(feature.iconName)}
                </div>
                {feature.tag && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {feature.tag}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
