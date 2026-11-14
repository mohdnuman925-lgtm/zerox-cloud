import React from 'react';

export const HowItWorks = () => {
  const steps = [
    {
      title: 'Choose your plan',
      desc: 'Pick a product, a region and the resources you need. No hidden fees.'
    },
    {
      title: 'Pay securely',
      desc: 'Check out with UPI or card through Razorpay. Your service is created as soon as payment clears.'
    },
    {
      title: 'Deploy & manage',
      desc: 'Open the control panel, install what you need and manage everything from one dashboard.'
    }
  ];

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {steps.map((st, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {st.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
