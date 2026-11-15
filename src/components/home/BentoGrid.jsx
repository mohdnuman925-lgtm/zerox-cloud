import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const BentoGrid = () => {
  return (
    <section id="bento-grid" className="py-20 relative z-10 scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bento Grid matching reference video with staggered scroll reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Game servers (spans 2 columns) */}
          <ScrollReveal animation="fade-up" delay={0} className="md:col-span-2 h-full">
            <Link
              to="/games"
              className="group relative overflow-hidden rounded-3xl bg-[#0c140f]/5 backdrop-blur-2xl border border-white/15 hover:border-white/30 transition-all duration-300 min-h-[300px] sm:min-h-[340px] h-full flex flex-col justify-end p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.14)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.22)] block"
            >
              {/* Background Image from reference video */}
              <img
                src="/assets/games.jpg"
                alt="Game Servers"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              {/* Subtle dark gradient overlay so text is pristine */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:via-black/30 transition-colors" />

              <div className="relative z-10 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Game servers
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                    Instant Minecraft, Rust, CS2 and more.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shadow-lg flex-shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Card 2: Cloud servers (spans 1 column) */}
          <ScrollReveal animation="fade-up" delay={120} className="h-full">
            <Link
              to="/cloud"
              className="group relative overflow-hidden rounded-3xl bg-[#0c140f]/5 backdrop-blur-2xl border border-white/15 hover:border-white/30 transition-all duration-300 min-h-[300px] sm:min-h-[340px] h-full flex flex-col justify-end p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.14)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.22)] block"
            >
              <img
                src="/assets/vps.png"
                alt="Cloud Servers"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:via-black/25 transition-colors" />

              <div className="relative z-10 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Cloud servers
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                    NVMe, root access, any OS.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shadow-lg flex-shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Card 3: Dedicated servers */}
          <ScrollReveal animation="fade-up" delay={160} className="h-full">
            <Link
              to="/dedicated"
              className="group relative overflow-hidden rounded-3xl bg-[#0c140f]/5 backdrop-blur-2xl border border-white/15 hover:border-white/30 transition-all duration-300 min-h-[260px] sm:min-h-[290px] h-full flex flex-col justify-end p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.14)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.22)] block"
            >
              <img
                src="/assets/dedicated.webp"
                alt="Dedicated Servers"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:via-black/30 transition-colors" />

              <div className="relative z-10 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Dedicated servers
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                    Bare-metal power.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shadow-lg flex-shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Card 4: Web hosting (active highlighted white button in reference video) */}
          <ScrollReveal animation="fade-up" delay={220} className="h-full">
            <Link
              to="/web"
              className="group relative overflow-hidden rounded-3xl bg-[#0c140f]/5 backdrop-blur-2xl border border-white/15 hover:border-white/30 transition-all duration-300 min-h-[260px] sm:min-h-[290px] h-full flex flex-col justify-end p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.14)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.22)] block"
            >
              <img
                src="/assets/webhosting.png"
                alt="Web Hosting"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-[#0A1828]/50 to-transparent" />

              <div className="relative z-10 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Web hosting
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                    Fast sites with free SSL.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center transition-all shadow-lg flex-shrink-0 group-hover:bg-[#C5F36A]">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Card 5: Discord bots */}
          <ScrollReveal animation="fade-up" delay={280} className="h-full">
            <Link
              to="/bots"
              className="group relative overflow-hidden rounded-3xl bg-[#0c140f]/5 backdrop-blur-2xl border border-white/15 hover:border-white/30 transition-all duration-300 min-h-[260px] sm:min-h-[290px] h-full flex flex-col justify-end p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.14)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.22)] block"
            >
              {/* Discord Logo watermark background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#161B26]/10 via-[#101418]/5 to-[#0A0D0E]/5" />
              <div className="absolute top-1/2 right-4 -translate-y-1/2 w-48 h-48 opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>

              <div className="relative z-10 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Discord bots
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                    Always-on bot hosting.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shadow-lg flex-shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
