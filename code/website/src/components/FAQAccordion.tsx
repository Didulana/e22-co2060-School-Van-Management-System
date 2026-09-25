import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Does the driver need expensive specialized GPS hardware?',
      answer:
        'No! Drivers only need any standard Android or iOS smartphone running the KidsRoute app. The application utilizes native background geolocation services and power-optimized throttling to broadcast location without draining the phone battery or needing OBD-II dongles.',
    },
    {
      question: 'What happens when the driver enters a cellular dead zone?',
      answer:
        'KidsRoute employs an offline-first cache strategy. When cell coverage drops in hilly or suburban areas, the driver app records GPS points locally with high-precision timestamps. On the parent side, the interface visibly displays the "Last Known Location" with exact minutes elapsed, avoiding ambiguity. Once signal resumes, the backlogged telemetry syncs automatically.',
    },
    {
      question: 'How is student location data secured?',
      answer:
        'Telemetry is cryptographically signed and routed strictly over authenticated WebSocket sessions. Parents can solely view the specific vehicle their registered child is currently assigned to, and student home coordinates are masked from any unauthorized third parties.',
    },
    {
      question: 'Can parents mark a child absent for multiple upcoming days?',
      answer:
        "Yes. The parent app includes an absence calendar scheduler. Selecting a date range marks the student unavailable; the driver's morning checklist is immediately adjusted, pruning unnecessary stops and recalculating pick-up ETAs for everyone else along the route.",
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 md:py-24 bg-[#faf8ff]" id="faq">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider text-[#006948] font-bold">
            Clear Guidance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Technical and operational questions answered directly by Team AlphaWolves.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#f2f3ff] shadow-sm overflow-hidden transition-all border border-slate-200/60"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#eaedff] transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-[#131b2e] flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-[#006948] shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#006948]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-200/60 font-normal animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
