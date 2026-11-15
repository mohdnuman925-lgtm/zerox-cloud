import React from 'react';
import { Cpu, Zap, Shield, Heart, Settings, Clock } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const FeaturesSection = () => {
  const features = [
    {
      title: 'High Performance',
      desc: 'Powered by latest generation processors for performance',
      icon: Cpu
    },
    {
      title: 'Low Latency',
      desc: 'Optimized network infrastructure for minimal lag and delay',
      icon: Zap
    },
    {
      title: 'DDoS Protection',
      desc: 'Our system is protected by advanced, multi-layered security protocols designed to detect, isolate, and neutralize threats in real time — ensuring your data remains safe around the clock.',
      icon: Shield
    },
    {
      title: 'Auto Recovery',
      desc: 'Automatic server recovery and backup systems',
      icon: Heart
    },
    {
      title: 'Full Control',
      desc: 'Complete server control panel with advanced configuration options',
      icon: Settings
    },
    {
      title: 'Instant Setup',
      desc: 'Instant automated provisioning as soon as payment clears. Play in under a minute.',
      icon: Clock
    }
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with smooth scroll reveal */}
        <ScrollReveal animation="fade-up" className="text-left mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            — WE WON'T DISAPPOINT
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
            Advanced Features
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-400">
            Everything you need for professional game server hosting
          </p>
        </ScrollReveal>

        {/* Features Grid with cascading scroll reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <ScrollReveal
                key={index}
                animation="fade-up"
                delay={index * 80}
                className="h-full"
              >
                <div className="p-8 rounded-3xl bg-[#0c140f]/5 backdrop-blur-2xl transition-all duration-300 group shadow-xl flex flex-col justify-between h-full hover:-translate-y-1">
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-black transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
