import React, { useState } from 'react';
import { Bus, Check, ArrowRight } from 'lucide-react';
import { PORTAL_URLS } from '../config';

export const PricingCalculator: React.FC = () => {
  const [vanCount, setVanCount] = useState<number>(3);

  const calculateCost = (count: number) => {
    if (count === 1) return { perVan: 15, total: 15, tier: 'Independent Driver' };
    if (count <= 10) return { perVan: 12, total: count * 12, tier: 'School Van Operator' };
    return { perVan: 9, total: count * 9, tier: 'Enterprise District' };
  };

  const cost = calculateCost(vanCount);

  return (
    <section id="pricing" className="py-20 relative bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Simple Plans That Scale With Your Fleet
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Zero upfront hardware fees. Use your existing smartphones and pay a low monthly subscription.
          </p>
        </div>

        {/* Interactive Pricing Estimator Box */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg">
          
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Estimate Your Fleet Cost
            </p>
            <div className="flex items-center justify-center gap-3">
              <Bus className="w-6 h-6 text-blue-600" />
              <span className="text-3xl font-extrabold text-slate-900">{vanCount} {vanCount === 1 ? 'School Van' : 'School Vans'}</span>
            </div>
          </div>

          {/* Slider Control */}
          <div className="mb-8 max-w-lg mx-auto">
            <input 
              type="range" 
              min="1" 
              max="25" 
              value={vanCount}
              onChange={(e) => setVanCount(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500 font-bold mt-2">
              <span>1 Van</span>
              <span>5 Vans</span>
              <span>10 Vans</span>
              <span>25+ Vans</span>
            </div>
          </div>

          {/* Result Card Display */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide bg-blue-100 px-2.5 py-1 rounded-full">
                {cost.tier}
              </span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                ${cost.total} <span className="text-xs font-semibold text-slate-500">/ month total</span>
              </p>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Just <span className="text-emerald-600 font-bold">${cost.perVan}</span> per van per month
              </p>
            </div>

            <a 
              href={PORTAL_URLS.getStarted}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              <span>Get Started - 14-Day Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Included Features List */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-semibold">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Unlimited Parent App Downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Resilient Offline Location Fallback</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Driver Attendance & SOS Panic Button</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Monthly Transport Fee Management</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
