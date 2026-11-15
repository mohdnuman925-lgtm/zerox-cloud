import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do I get started with game server hosting?',
      a: 'Getting started is simple! Choose your game, select a server location, and follow our easy setup wizard. Your server will be up and running in minutes with our instant deployment system.'
    },
    {
      q: 'What kind of performance can I expect?',
      a: 'All ZEROX CLOUD game instances run on enterprise AMD EPYC 7C13 and Intel Xeon processors paired with PCIe Gen4 NVMe storage. You can expect sub-15ms local latency across South Asia, consistent 20 TPS on Minecraft, and zero tick drops.'
    },
    {
      q: 'Can I install custom mods, plugins, and modpacks?',
      a: 'Yes, absolutely! We provide full SFTP access, an integrated web file manager, and MySQL databases. For Minecraft, you can run Paper, Purpur, Forge, Fabric, Vanilla, and Bedrock with 1-click installer support.'
    },
    {
      q: 'How does instant server deployment work?',
      a: 'As soon as your payment is verified on our server through Razorpay or international card checkout, our provisioning adapter immediately creates your user account, configures Docker containers on the target node, and emails your login credentials.'
    },
    {
      q: 'What payment methods do you support?',
      a: 'We accept Indian UPI (Google Pay, PhonePe, Paytm, BHIM), Indian NetBanking & Debit/Credit Cards via Razorpay, as well as international Visa, MasterCard, and American Express cards.'
    },
    {
      q: 'Is enterprise DDoS protection included?',
      a: 'Yes, all ZEROX CLOUD servers include multi-layer DDoS filtering up to 3.2 Tbps capacity at no additional cost. Traffic is scrubbed automatically before hitting your server port.'
    }
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" className="text-center mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5F36A]">
            KNOWLEDGE BASE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Got questions? We've got answers. If you need more help, our team is live 24/7.
          </p>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <ScrollReveal
                key={i}
                animation="fade-up"
                delay={i * 60}
              >
                <div className="rounded-2xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-lg overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-[#C5F36A] transition"
                  >
                  <span>{faq.q}</span>
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-neutral-400">
                    {isOpen ? <Minus className="w-4 h-4 text-[#C5F36A]" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
        </div>
      </div>
    </section>
  );
};

