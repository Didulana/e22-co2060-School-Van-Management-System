import React, { useState } from 'react';
import { Send, CheckCircle2, Bus, ShieldCheck } from 'lucide-react';

export const DemoContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Parent',
    fleetSize: '1-3 Vans',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Left Content Side */}
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-sky-400 uppercase bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 inline-block">
                Schedule a Fleet Demo
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Transform Your School Van Operation Today
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect with our team to see how KidsRoute can be customized for your school fleet, driver routes, or transport association.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>14-day free trial with full feature access</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span>Free onboarding for drivers & parent accounts</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Dedicated support from Team AlphaWolves</span>
                </div>
              </div>
            </div>

            {/* Right Form Side */}
            <div>
              {submitted ? (
                <div className="h-full bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Demo Request Submitted!</h3>
                  <p className="text-xs text-slate-300">
                    Thank you, <span className="text-white font-semibold">{formData.fullName || 'there'}</span>. Our school transport specialist will contact you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/20 rounded-lg hover:bg-emerald-500/30"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Suneth Perera"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@school.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Role</label>
                      <select 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                      >
                        <option value="Parent">Parent</option>
                        <option value="Driver">Van Driver</option>
                        <option value="School Admin">School Admin</option>
                        <option value="Fleet Owner">Fleet Owner</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Fleet Size</label>
                      <select 
                        value={formData.fleetSize}
                        onChange={(e) => setFormData({...formData, fleetSize: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                      >
                        <option value="1-3 Vans">1-3 Vans</option>
                        <option value="4-10 Vans">4-10 Vans</option>
                        <option value="10+ Vans">10+ Vans</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Message / Notes</label>
                    <textarea 
                      rows={3}
                      placeholder="Tell us about your route or school transport requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Fleet Demo Request</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
