import React from 'react';
import { FEATURES_DATA } from '../data/contentData';
import { MapPin, WifiOff, BellRing, AlertTriangle, CalendarX, CreditCard } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'MapPin': return <MapPin className="w-6 h-6 text-brand-600" />;
      case 'WifiOff': return <WifiOff className="w-6 h-6 text-amber-600" />;
      case 'BellRing': return <BellRing className="w-6 h-6 text-emerald-600" />;
      case 'AlertTriangle': return <AlertTriangle className="w-6 h-6 text-rose-600" />;
      case 'CalendarX': return <CalendarX className="w-6 h-6 text-indigo-600" />;
      case 'CreditCard': return <CreditCard className="w-6 h-6 text-cyan-600" />;
      default: return <MapPin className="w-6 h-6 text-brand-600" />;
    }
  };

  return (
    <section id="features" className="py-20 relative bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-700 uppercase bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Why KidsRoute?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mt-3">
            Designed for Safety and Convenience
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Everything you need to manage school transportation efficiently.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_DATA.map((feature) => (
            <div 
              key={feature.id}
              className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(feature.iconName)}
                </div>
                {feature.tag && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    {feature.tag}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-brand-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
