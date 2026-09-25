import React from 'react';
import {
  MapPin,
  WifiOff,
  BellRing,
  AlertTriangle,
  CalendarX,
  Receipt,
  RefreshCw,
  History,
  CheckCircle2,
  PhoneCall,
  Navigation,
  CheckSquare,
  ShieldCheck,
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const pillars = [
    {
      id: 'gps',
      title: 'Live GPS Tracking',
      tag: 'Real-Time',
      tagColor: 'bg-[#006948]/10 text-[#006948]',
      icon: <MapPin className="w-6 h-6 text-[#006948]" />,
      iconBg: 'bg-[#006948]/10',
      description:
        'Continuous van telemetry streamed through lightweight WebSockets with responsive route polylines over OpenStreetMap.',
      footerIcon: <RefreshCw className="w-4 h-4 text-[#006948]" />,
      footerText: 'Sub-second position updates',
      footerTextColor: 'text-[#006948]',
    },
    {
      id: 'offline',
      title: 'Offline-Resilient Telemetry',
      tag: 'High Resilience',
      tagColor: 'bg-amber-100 text-[#855300]',
      icon: <WifiOff className="w-6 h-6 text-[#855300]" />,
      iconBg: 'bg-amber-100',
      description:
        'Passing through cell dead zones? Last verified coordinates and timestamps remain cached on the parent interface until signal re-establishes.',
      footerIcon: <History className="w-4 h-4 text-[#855300]" />,
      footerText: 'Transparent timestamp caching',
      footerTextColor: 'text-[#855300]',
    },
    {
      id: 'alerts',
      title: 'Instant Boarding Alerts',
      tag: 'Instant Alert',
      tagColor: 'bg-teal-50 text-[#006860]',
      icon: <BellRing className="w-6 h-6 text-[#006860]" />,
      iconBg: 'bg-teal-50',
      description:
        'Parents receive high-priority push notifications and optional SMS notifications the second a student hops aboard or enters the school perimeter.',
      footerIcon: <CheckCircle2 className="w-4 h-4 text-[#006860]" />,
      footerText: 'Automated geofence triggers',
      footerTextColor: 'text-[#006860]',
    },
    {
      id: 'sos',
      title: 'One-Tap Emergency SOS',
      tag: 'Safety SOS',
      tagColor: 'bg-rose-100 text-[#ba1a1a]',
      icon: <AlertTriangle className="w-6 h-6 text-[#ba1a1a]" />,
      iconBg: 'bg-rose-100',
      description:
        'During breakdowns or road accidents, drivers trigger an urgent broadcast notifying all assigned parents and local authorities synchronously.',
      footerIcon: <PhoneCall className="w-4 h-4 text-[#ba1a1a]" />,
      footerText: 'Synchronous emergency dispatch',
      footerTextColor: 'text-[#ba1a1a]',
    },
    {
      id: 'absence',
      title: 'Digital Absence Sync',
      tag: 'Smart Sync',
      tagColor: 'bg-[#006948]/10 text-[#006948]',
      icon: <CalendarX className="w-6 h-6 text-[#006948]" />,
      iconBg: 'bg-[#006948]/10',
      description:
        'Parents mark sick leave beforehand with one tap. The driver pickup queue automatically removes that stop, saving transit fuel and delays.',
      footerIcon: <Navigation className="w-4 h-4 text-[#006948]" />,
      footerText: 'Optimized morning schedules',
      footerTextColor: 'text-[#006948]',
    },
    {
      id: 'fees',
      title: 'Simple Fee Tracking',
      tag: 'Ledger',
      tagColor: 'bg-[#e2e7ff] text-[#131b2e]',
      icon: <Receipt className="w-6 h-6 text-[#131b2e]" />,
      iconBg: 'bg-[#e2e7ff]',
      description:
        'Parents log bank slips or cash receipts; drivers confirm payment with a tap. Eliminates lost paper chits and billing disputes completely.',
      footerIcon: <CheckSquare className="w-4 h-4 text-[#131b2e]" />,
      footerText: 'Clear payment histories',
      footerTextColor: 'text-[#131b2e]',
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-[#f2f3ff]" id="features">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs uppercase tracking-wider text-[#006948] font-bold">
              Real-World Transit Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight">
              Built Specifically for Sri Lankan Road Conditions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              KidsRoute bypasses costly fleet blackboxes. Built with low-power smartphone GPS, WebSocket streaming, and persistent local storage.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#131b2e] text-xs font-semibold shadow-sm border border-slate-200 self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-[#006948]" />
            <span>Zero Specialized Hardware Required</span>
          </div>
        </div>

        {/* 6 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-slate-100 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${pillar.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                    {pillar.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full ${pillar.tagColor} text-[10px] font-bold uppercase tracking-wider`}>
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#131b2e] mb-2 group-hover:text-[#006948] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>

              <div className={`mt-6 pt-3 flex items-center gap-2 ${pillar.footerTextColor} text-xs font-semibold border-t border-slate-100`}>
                {pillar.footerIcon}
                <span>{pillar.footerText}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
