import React from 'react';
import { Hero } from '../components/home/Hero';
import { BentoGrid } from '../components/home/BentoGrid';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { HowItWorks } from '../components/home/HowItWorks';
import { GlobalInfrastructure } from '../components/home/GlobalInfrastructure';
import { FAQSection } from '../components/home/FAQSection';
import { DiscordBanner } from '../components/home/DiscordBanner';

export const HomePage = () => {
  return (
    <div className="relative">
      <Hero />
      <BentoGrid />
      <FeaturesSection />
      <HowItWorks />
      <GlobalInfrastructure />
      <FAQSection />
      <DiscordBanner />
    </div>
  );
};

