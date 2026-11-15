import React from 'react';
import { ArrowRight, MessageSquare, Users, Radio } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const DiscordBanner = () => {
  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal
          animation="zoom-in"
          duration={800}
          className="bg-[#0c140f]/5 border border-white/15 relative overflow-hidden rounded-3xl backdrop-blur-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-2xl shadow-2xl"
        >
          <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              — COMMUNITY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Join Our Discord
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Get instant support, share experiences, and stay updated with the latest news
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 pt-2 text-xs text-neutral-300 font-medium">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-white" /> Ticket help
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-white" /> Global users
              </span>
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-white" /> Live updates
              </span>
            </div>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <a
              href="https://discord.gg/zeroxcloud"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-black font-bold text-xs sm:text-sm hover:bg-[#C5F36A] transition-all shadow-xl active:scale-95 whitespace-nowrap"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Discord
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
