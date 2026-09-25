import React, { useState } from 'react';
import { Menu, X, ArrowRight, User } from 'lucide-react';
import { PORTAL_URLS } from '../config';
import kidsrouteLogo from '../assets/kidsroute-logo.png';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('features');

  const navLinks = [
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'Solutions', href: '#solutions', id: 'solutions' },
    { label: 'Engineering Team', href: '#engineering-team', id: 'engineering-team' },
    { label: 'FAQ', href: '#faq', id: 'faq' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        
        {/* Brand Logo & Team Tag */}
        <a href="#" className="flex items-center gap-3 group">
          <img 
            src={kidsrouteLogo} 
            alt="KidsRoute Logo" 
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-[#131b2e] tracking-tight leading-none">
              KidsRoute
            </span>
            <span className="text-[10px] text-[#006948] tracking-wider uppercase font-bold mt-1">
              Team AlphaWolves
            </span>
          </div>
        </a>

        {/* Center Pill Nav (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 p-1.5 bg-[#f2f3ff] rounded-full">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setActiveSection(link.id)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  isActive
                    ? 'bg-[#006948] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA & Account Controls */}
        <div className="flex items-center gap-3">
          <a
            href={PORTAL_URLS.signIn}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-sm transition-all hover:scale-[0.99] active:scale-[0.98]"
          >
            <span>Sign In / Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <a
            href={PORTAL_URLS.signIn}
            className="w-8 h-8 rounded-full bg-[#006948] flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity"
            title="User Portal"
          >
            <User className="w-4 h-4" />
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-700 hover:text-[#006948] p-1.5"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-5 space-y-3 shadow-lg animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => {
                setActiveSection(link.id);
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-semibold text-slate-800 py-1.5 hover:text-[#006948]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={PORTAL_URLS.signIn}
              className="w-full text-center py-2.5 text-xs font-bold text-white bg-[#006948] rounded-full shadow-sm"
            >
              Sign In to Portal
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
