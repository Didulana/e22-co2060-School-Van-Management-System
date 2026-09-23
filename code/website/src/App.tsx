import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoleSolutions } from './components/RoleSolutions';
import { FeatureGrid } from './components/FeatureGrid';
import { Testimonials } from './components/Testimonials';
import { OurTeam } from './components/OurTeam';
import { FAQAccordion } from './components/FAQAccordion';
import { DemoContactForm } from './components/DemoContactForm';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvasBg text-ink selection:bg-brand-500 selection:text-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <RoleSolutions />
        <FeatureGrid />
        <OurTeam />
        <Testimonials />
        <FAQAccordion />
        <DemoContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default App;
