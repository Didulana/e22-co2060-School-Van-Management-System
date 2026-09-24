import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import member1Img from '../assets/member1.png';
import member2Img from '../assets/member2.png';
import member3Img from '../assets/member3.png';
import member4Img from '../assets/member4.png';

const teamMembers = [
  {
    name: 'Didulana Lokugamage',
    role: 'Computer Engineering Undergraduate @ University of Peradeniya',
    image: member1Img
    github: 'https://github.com/didulana',
    linkedin: 'https://linkedin.com/in/didulanalokugamage',
  },
  {
    name: 'Dilan Sandeepa',
    role: 'Computer Engineering Undergraduate @ University of Peradeniya',
    image: member2Img
    github: 'https://github.com/dilansandeepa131',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Imasha Sewmini',
    role: 'Computer Engineering Undergraduate @ University of Peradeniya',
    image: member3Img
    github: 'https://github.com/imasha284',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Samara Gunawardhana',
    role: 'Computer Engineering Undergraduate @ University of Peradeniya',
    image: member4Img
    github: 'https://github.com/samara328',
    linkedin: 'https://linkedin.com',
  },
];

export const OurTeam: React.FC = () => {
  return (
    <section id="team" className="py-24 bg-canvasBg relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-50/50 skew-y-3 origin-top-left -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 font-semibold text-sm mb-6 border border-brand-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
            </span>
            Meet the Creators
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-ink mb-6 tracking-tight">
            Our Team
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            The passionate individuals behind KidsRoute, dedicated to making school transportation safer and more efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-[2rem] p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 border border-slate-100 text-center"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-brand-50 shadow-inner group-hover:border-brand-100 transition-colors">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-display font-bold text-ink mb-1">{member.name}</h3>
              <p className="text-brand-600 text-sm font-medium mb-4">{member.role}</p>

              <div className="flex justify-center gap-4">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#0077b5] hover:bg-[#0077b5]/10 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
