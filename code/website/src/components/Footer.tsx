import React from 'react';
import { Bus, ExternalLink, Code2 } from 'lucide-react';
import { PORTAL_URLS } from '../config';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f2f3ff] shadow-[0_-1px_12px_rgba(0,0,0,0.03)] border-t border-slate-200/60 mt-12">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#006948] text-white flex items-center justify-center shadow-sm">
                <Bus className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-[#131b2e] tracking-tight">KidsRoute</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed font-normal">
              Intelligent real-time school van tracking, geo-fencing, and safety orchestration designed with tactile reassurance for parents and fleet operators.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[11px] font-bold text-[#006860] border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#006860] animate-pulse" />
                Live Transit Mesh
              </span>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#131b2e] mb-4 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
              <li>
                <a href="#features" className="hover:text-[#006948] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-[#006948] transition-colors">
                  Solutions
                </a>
              </li>
              <li>
                <a href={PORTAL_URLS.signIn} className="hover:text-[#006948] transition-colors">
                  Portal Access
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#006948] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Project */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#131b2e] mb-4 uppercase tracking-wider">
              Academic Project
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
              <li>
                <a href="#engineering-team" className="hover:text-[#006948] transition-colors">
                  Team AlphaWolves
                </a>
              </li>
              <li>
                <span className="text-slate-500">2YP CO2060 Project</span>
              </li>
              <li>
                <span className="text-slate-500">Faculty of Engineering</span>
              </li>
              <li>
                <span className="text-slate-500">Univ. of Peradeniya</span>
              </li>
              <li>
                <a
                  href="https://github.com/cepdnaclk/e22-co2060-School-Van-Management-System"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#006948] hover:underline font-bold"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Trust */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#131b2e] mb-4 uppercase tracking-wider">
              Support & Trust
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
              <li>
                <a href="#contact" className="hover:text-[#006948] transition-colors">
                  Contact Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#006948] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#006948] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <span className="text-slate-500">Emergency Dispatch Ready</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <p className="text-center md:text-left">
            © 2026 KidsRoute • Team AlphaWolves. Faculty of Engineering, University of Peradeniya. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <a href="#" className="hover:text-[#006948] transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#006948] transition-colors">Terms</a>
            <span>•</span>
            <span className="text-[#006860]">CO2060 Engineering Excellence</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
