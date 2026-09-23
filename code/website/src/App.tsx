import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LiveDemoSimulator } from './components/LiveDemoSimulator';
import { RoleSolutions } from './components/RoleSolutions';
import { FeatureGrid } from './components/FeatureGrid';
import { PricingCalculator } from './components/PricingCalculator';
import { Testimonials } from './components/Testimonials';
import { FAQAccordion } from './components/FAQAccordion';
import { DemoContactForm } from './components/DemoContactForm';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 selection:bg-sky-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <LiveDemoSimulator />
        <RoleSolutions />
        <FeatureGrid />
        <PricingCalculator />
        <Testimonials />
        <FAQAccordion />
        <DemoContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default App;
