import React, { useState, useEffect } from 'react';
import { Bus, ShieldCheck, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">KidsRoute</span>
                <span className="bg-sky-500/10 text-sky-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-sky-500/20">PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">School Van Management</p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors">Features</a>
            <a href="#simulator" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1">
              <span>Live Simulator</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </a>
            <a href="#solutions" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors">Solutions</a>
            <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors">FAQ</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="http://localhost:5173" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-slate-700/60 hover:border-slate-500 transition-all"
            >
              Sign In to App
            </a>
            <a 
              href="#contact" 
              className="flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 px-4 py-2.5 rounded-lg shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all hover:-translate-y-0.5"
            >
              <span>Get Fleet Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-800 px-6 py-6 mt-3 space-y-4 animate-fadeIn">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-200">Features</a>
          <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-200">Live Simulator</a>
          <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-200">Solutions</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-200">Pricing</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-200">FAQ</a>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <a href="http://localhost:5173" className="w-full text-center py-2.5 text-sm font-semibold text-slate-200 border border-slate-700 rounded-lg">Sign In to App</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-sm font-bold text-white bg-sky-500 rounded-lg">Get Fleet Demo</a>
          </div>
        </div>
      )}
    </header>
  );
};
