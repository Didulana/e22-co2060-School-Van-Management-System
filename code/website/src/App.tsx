import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureGrid } from './components/FeatureGrid';
import { RoleSolutions } from './components/RoleSolutions';
import { OurTeam } from './components/OurTeam';
import { FAQAccordion } from './components/FAQAccordion';
import { DemoContactForm } from './components/DemoContactForm';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] selection:bg-[#006948] selection:text-white font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <FeatureGrid />
        <RoleSolutions />
        <OurTeam />
        <FAQAccordion />
        <DemoContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default App;
