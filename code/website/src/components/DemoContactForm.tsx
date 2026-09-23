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
    <section id="contact" className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Left Content Side */}
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-brand-700 uppercase bg-brand-100 px-3 py-1 rounded-full border border-brand-200 inline-block">
                Get In Touch
              </span>
              <h2 className="text-3xl font-extrabold text-ink">
                Transform Your School Van Operation Today
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Connect with our team to see how KidsRoute can be customized for your school fleet, driver routes, or transport association.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-700 font-semibold">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>14-day free trial with full feature access</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700 font-semibold">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span>Free onboarding for drivers & parent accounts</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700 font-semibold">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Dedicated support from our team</span>
                </div>
              </div>
            </div>

            {/* Right Form Side */}
            <div>
              {submitted ? (
                <div className="h-full bg-emerald-50 border border-emerald-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-ink">Request Submitted!</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Thank you, <span className="text-ink font-bold">{formData.fullName || 'there'}</span>. Our team will contact you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="mt-4 px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-200/80 rounded-xl hover:bg-emerald-200"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Suneth Perera"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-ink text-xs focus:outline-none focus:border-brand-600 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@school.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-ink text-xs focus:outline-none focus:border-brand-600 shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Role</label>
                      <select 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-ink text-xs focus:outline-none focus:border-brand-600 shadow-sm"
                      >
                        <option value="Parent">Parent</option>
                        <option value="Driver">Van Driver</option>
                        <option value="School Admin">School Admin</option>
                        <option value="Fleet Owner">Fleet Owner</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Fleet Size</label>
                      <select 
                        value={formData.fleetSize}
                        onChange={(e) => setFormData({...formData, fleetSize: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-ink text-xs focus:outline-none focus:border-brand-600 shadow-sm"
                      >
                        <option value="1-3 Vans">1-3 Vans</option>
                        <option value="4-10 Vans">4-10 Vans</option>
                        <option value="10+ Vans">10+ Vans</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message / Notes</label>
                    <textarea 
                      rows={3}
                      placeholder="Tell us about your route or school transport requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-ink text-xs focus:outline-none focus:border-brand-600 shadow-sm resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 px-4 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request</span>
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
