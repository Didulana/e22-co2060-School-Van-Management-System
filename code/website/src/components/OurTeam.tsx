import React from 'react';
import { GraduationCap, Github, Linkedin, Terminal, ExternalLink } from 'lucide-react';
import member1Img from '../assets/member1.png';
import member2Img from '../assets/member2.png';
import member3Img from '../assets/member3.png';
import member4Img from '../assets/member4.png';

const teamMembers = [
  {
    name: 'Didulana Lokugamage',
    field: 'Computer Engineering',
    institution: 'Univ. of Peradeniya',
    image: member1Img,
    github: 'https://github.com/didulana',
    linkedin: 'https://linkedin.com/in/didulanalokugamage',
  },
  {
    name: 'Dilan Sandeepa',
    field: 'Computer Engineering',
    institution: 'Univ. of Peradeniya',
    image: member2Img,
    github: 'https://github.com/dilansandeepa131',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Imasha Sewmini',
    field: 'Computer Engineering',
    institution: 'Univ. of Peradeniya',
    image: member3Img,
    github: 'https://github.com/imasha284',
    linkedin: 'https://linkedin.com/in/imasha-sewmini-7583b543a/',
  },
  {
    name: 'Samara Gunawardhana',
    field: 'Computer Engineering',
    institution: 'Univ. of Peradeniya',
    image: member4Img,
    github: 'https://github.com/samara328',
    linkedin: 'https://linkedin.com/in/samara-gunawardhana-184633398/',
  },
];

export const OurTeam: React.FC = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-[#f2f3ff]" id="engineering-team">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Academic Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 mb-3">
            <GraduationCap className="w-4 h-4 text-[#006948]" />
            <span className="text-xs font-bold text-[#006948]">
              Faculty of Engineering • University of Peradeniya
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight">
            Meet Team AlphaWolves
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-medium">
            Computer Engineering Undergraduates engineering resilient, community-first transit software for the CO2060 Software Systems Development Project.
          </p>
        </div>

        {/* 4 Authentic Member Profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex flex-col justify-between p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-all border border-slate-100 group"
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar with Halo Ring */}
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-[#006948]/20 transition-all duration-300 group-hover:ring-[#006948]/40 shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-bold text-base text-[#131b2e] group-hover:text-[#006948] transition-colors">
                  {member.name}
                </h3>
                <span className="text-xs font-semibold text-[#006948] mt-0.5">
                  {member.field}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {member.institution}
                </span>
              </div>

              {/* Social Links */}
              <div className="mt-5 pt-3.5 flex items-center justify-center gap-3 border-t border-slate-100">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] flex items-center justify-center text-[#131b2e] transition-colors shadow-2xs"
                  title={`${member.name} GitHub`}
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] flex items-center justify-center text-[#006948] transition-colors shadow-2xs"
                  title={`${member.name} LinkedIn`}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Verified Open Source Project Repository Card */}
        <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5 text-[#006948]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#131b2e]">
                CO2060 Software Systems Development Project - GitHub Repository
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Department of Computer Engineering, University of Peradeniya • PERN Stack (PostgreSQL, Express, React, Node.js) & OpenStreetMap
              </p>
            </div>
          </div>

          <a
            href="https://github.com/cepdnaclk/e22-co2060-School-Van-Management-System"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] text-xs font-bold transition-all shrink-0 shadow-xs"
          >
            <Github className="w-4 h-4" />
            <span>View Source on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>

      </div>
    </section>
  );
};
