import React from 'react';
import { Bus, ExternalLink, Github, Globe, GraduationCap } from 'lucide-react';
import { PORTAL_URLS } from '../config';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                <Bus className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">KidsRoute</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Real-time school transport tracking and vehicle management system. Built with PERN Stack, Socket.io telemetry, and OpenStreetMap geocoding.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="bg-brand-900/60 text-brand-300 px-2.5 py-1 rounded-md text-[10px] font-bold border border-brand-700/50">
                CO2060 Design Project
              </span>
              <span className="text-slate-400 text-[11px] font-medium">Team AlphaWolves</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Core Modules</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-brand-400 transition-colors">Live GPS Tracking Map</a></li>
              <li><a href="#features" className="hover:text-brand-400 transition-colors">Resilient Offline Mode</a></li>
              <li><a href="#solutions" className="hover:text-brand-400 transition-colors">Driver Attendance Checklist</a></li>
              <li><a href="#solutions" className="hover:text-brand-400 transition-colors">One-Tap Emergency SOS</a></li>
              <li><a href="#solutions" className="hover:text-brand-400 transition-colors">Transport Fee Receipts</a></li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">User Portals</h4>
            <ul className="space-y-2.5">
              <li><a href={PORTAL_URLS.signIn} className="hover:text-brand-400 transition-colors flex items-center gap-1"><span>Sign In</span> <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href={PORTAL_URLS.getStarted} className="hover:text-brand-400 transition-colors flex items-center gap-1"><span>Get Started</span> <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href={PORTAL_URLS.parent} className="hover:text-brand-400 transition-colors flex items-center gap-1"><span>Parent Dashboard</span> <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href={PORTAL_URLS.driver} className="hover:text-brand-400 transition-colors flex items-center gap-1"><span>Driver Portal</span> <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Academic & University Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Academic Links</h4>
            <ul className="space-y-2.5">
              <li>
                <a 
                  href="https://github.com/cepdnaclk/e22-co2060-School-Van-Management-System" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a 
                  href="http://www.ce.pdn.ac.lk/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dept. of Computer Engineering</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://eng.pdn.ac.lk/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>University of Peradeniya</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 Team AlphaWolves (Project 48). All rights reserved.</p>
          <p className="flex items-center gap-1 font-medium">
            <span>Faculty of Engineering, University of Peradeniya</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
