import React from 'react';
import { ScrollReveal } from '../common/ScrollReveal';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose your plan',
      desc: 'Pick a product, a region and the resources you need. No hidden fees.'
    },
    {
      step: '02',
      title: 'Pay securely',
      desc: 'Check out with UPI, QR, or cards via Cashfree & Razorpay. Your service is created as soon as payment clears.'
    },
    {
      step: '03',
      title: 'Deploy & manage',
      desc: 'Open panel.zeroxcloud.site, install your mods, and manage everything from one unified dashboard.'
    }
  ];

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {steps.map((st, i) => (
            <ScrollReveal
              key={i}
              animation="fade-up"
              delay={i * 120}
              className="space-y-2 group"
            >
              <div className="text-xs font-mono font-bold text-[#C5F36A] tracking-wider mb-1">
                STEP {st.step}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#C5F36A] transition-colors">
                {st.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                {st.desc}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
