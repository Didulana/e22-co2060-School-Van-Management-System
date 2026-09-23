import React, { useState, useEffect } from 'react';
import { Bus, Menu, X, ArrowRight } from 'lucide-react';
import { PORTAL_URLS } from '../config';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-ink">KidsRoute</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">School Van Management</p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Solutions</a>
            <a href="#team" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Our Team</a>
            <a href="#faq" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">FAQ</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href={PORTAL_URLS.signIn} 
              className="text-xs font-bold text-slate-700 hover:text-brand-600 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-brand-300 bg-white shadow-sm transition-all"
            >
              Sign In
            </a>
            <a 
              href={PORTAL_URLS.getStarted}
              className="flex items-center gap-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2.5 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 hover:text-brand-600 p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-6 mt-3 space-y-4 shadow-xl animate-fadeIn">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-base font-semibold text-slate-800">Features</a>
          <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="block text-base font-semibold text-slate-800">Solutions</a>
          <a href="#team" onClick={() => setMobileMenuOpen(false)} className="block text-base font-semibold text-slate-800">Our Team</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-base font-semibold text-slate-800">FAQ</a>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <a 
              href={PORTAL_URLS.signIn}
              className="w-full text-center py-2.5 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl"
            >
              Sign In
            </a>
            <a 
              href={PORTAL_URLS.getStarted}
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full text-center py-2.5 text-sm font-bold text-white bg-brand-600 rounded-xl shadow-md"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
