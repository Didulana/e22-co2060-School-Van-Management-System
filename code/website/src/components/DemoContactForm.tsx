import React, { useState } from 'react';
import { Send, CheckCircle2, Headphones, Check } from 'lucide-react';

export const DemoContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'parent',
    vanCount: '1',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="w-full py-16 md:py-24 bg-[#f2f3ff]" id="contact">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="rounded-3xl bg-white shadow-xl p-6 sm:p-10 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Contact Left Info */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wider text-[#006948] font-bold">
                  Pilot Demonstration
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] leading-snug">
                  Ready to Trial KidsRoute on Your Local Route?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mt-1">
                  Connect with our Peradeniya engineering team. We provide complimentary onboarding and technical demonstration for school van operators, parent associations, and transport coordinators.
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs sm:text-sm text-[#131b2e]">
                      100% Free Academic Trial
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Zero hidden contracts or hardware costs
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs sm:text-sm text-[#131b2e]">
                      Direct Engineering Support
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Guided driver setup in Sinhalese and English
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pilot Inquiry Form */}
            <div className="md:col-span-7 bg-[#f2f3ff] p-5 sm:p-6 rounded-2xl shadow-inner border border-slate-200/60">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#006948] flex items-center justify-center">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#131b2e]">
                    Inquiry Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm">
                    Thank you, <strong className="text-[#131b2e]">{formData.fullName || 'there'}</strong>. Team AlphaWolves has received your pilot inquiry and will be in touch shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-3 px-5 py-2 text-xs font-bold text-[#006948] bg-white rounded-full hover:bg-slate-50 border border-slate-200 shadow-xs"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1">
                      Your Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g., Suneth Perera"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#006948]/40 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#006948]/40 border border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#131b2e] mb-1">
                        Your Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#006948]/40 border border-slate-200"
                      >
                        <option value="parent">Parent</option>
                        <option value="driver">Van Driver</option>
                        <option value="school-rep">School Coordinator</option>
                        <option value="fleet-operator">Fleet Operator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#131b2e] mb-1">
                        Fleet or Van Count
                      </label>
                      <select
                        value={formData.vanCount}
                        onChange={(e) => setFormData({ ...formData, vanCount: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#006948]/40 border border-slate-200"
                      >
                        <option value="1">1 Van</option>
                        <option value="2-5">2 - 5 Vans</option>
                        <option value="6-15">6 - 15 Vans</option>
                        <option value="15+">15+ Vans</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1">
                      Route Location or Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Kandy to Peradeniya school van route with 14 students..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs font-medium shadow-sm outline-none resize-none focus:ring-2 focus:ring-[#006948]/40 border border-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-1 py-3 px-6 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Submit Pilot Request</span>
                    <Send className="w-3.5 h-3.5" />
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
