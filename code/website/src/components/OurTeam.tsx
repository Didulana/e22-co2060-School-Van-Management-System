import React from 'react';
import { Github, Linkedin, GraduationCap, Code2, Sparkles, ExternalLink } from 'lucide-react';
import member1Img from '../assets/member1.png';
import member2Img from '../assets/member2.png';
import member3Img from '../assets/member3.png';
import member4Img from '../assets/member4.png';

const teamMembers = [
  {
    name: 'Didulana Lokugamage',
    institution: 'University of Peradeniya',
    role: 'Computer Engineering Undergraduate',
    focus: 'Full-Stack Architecture & Real-Time Telemetry',
    image: member1Img,
    github: 'https://github.com/didulana',
    linkedin: 'https://linkedin.com/in/didulanalokugamage',
  },
  {
    name: 'Dilan Sandeepa',
    institution: 'University of Peradeniya',
    role: 'Computer Engineering Undergraduate',
    focus: 'Driver Portal & Journey Lifecycle Workflow',
    image: member2Img,
    github: 'https://github.com/dilansandeepa131',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Imasha Sewmini',
    institution: 'University of Peradeniya',
    role: 'Computer Engineering Undergraduate',
    focus: 'Parent Experience & Notification Services',
    image: member3Img,
    github: 'https://github.com/imasha284',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Samara Gunawardhana',
    institution: 'University of Peradeniya',
    role: 'Computer Engineering Undergraduate',
    focus: 'Database Modeling & Geocoding Integration',
    image: member4Img,
    github: 'https://github.com/samara328',
    linkedin: 'https://linkedin.com',
  },
];

export const OurTeam: React.FC = () => {
  return (
    <section id="team" className="py-24 bg-gradient-to-b from-canvasBg via-brand-50/20 to-white relative overflow-hidden border-t border-slate-200/80">
      {/* Subtle background ambient lights */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-800 font-bold text-xs mb-4 border border-brand-200 shadow-sm">
            <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
            <span>Faculty of Engineering • University of Peradeniya</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-ink mb-4 tracking-tight">
            Meet Team AlphaWolves
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            The engineering undergraduates designing and building KidsRoute for the 2YP CO2060 Software Engineering project evaluation.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/90 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-emerald-400 to-amber-400 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Avatar with Halo Ring */}
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-brand-400 to-amber-300 opacity-60 blur-xs group-hover:opacity-100 transition-all duration-300" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Member Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-ink group-hover:text-brand-700 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-brand-600 mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {member.institution}
                  </p>

                  {/* Specialization Badge */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl">
                      {member.focus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-ink transition-colors shadow-xs"
                  title={`${member.name} GitHub`}
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-[#0077b5]/10 border border-slate-200 hover:border-[#0077b5]/30 flex items-center justify-center text-slate-600 hover:text-[#0077b5] transition-colors shadow-xs"
                  title={`${member.name} LinkedIn`}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Project Evaluation Banner */}
        <div className="mt-14 max-w-3xl mx-auto p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-200 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-ink text-xs">2YP CO2060 Software Engineering Project</p>
              <p className="text-[11px] text-slate-500 font-medium">Department of Computer Engineering, University of Peradeniya</p>
            </div>
          </div>
          <a
            href="https://github.com/cepdnaclk/e22-co2060-School-Van-Management-System"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-ink font-bold text-xs shrink-0 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>View Source on GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

      </div>
    </section>
  );
};
