import React from 'react';
import { ShieldCheck, Cpu, Globe2, Award, Zap } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="py-16 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5F36A]">
            ABOUT ZEROX CLOUD
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
            Built for competitive gamers and cloud developers.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            ZEROX CLOUD was engineered from the ground up to eliminate the frustrating latency, sluggish hardware, and poor customer support that plagues standard shared hosting providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0c140f]/5 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl space-y-3">
            <Zap className="w-6 h-6 text-[#C5F36A]" />
            <h3 className="text-lg font-bold text-white">Sub-15ms Local Edge</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We peer directly with leading Indian and Asian telecom internet exchanges (NIXI, Extreme IX) to give your players the lowest ping possible.
            </p>
          </div>

          <div className="bg-[#0c140f]/5 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl space-y-3">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">High Single-Core Speeds</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Games like Minecraft and Rust are heavily dependent on single-threaded frequency. Our nodes run AMD EPYC 7C13 and Ryzen processors clocking up to 5.7GHz.
            </p>
          </div>

          <div className="bg-[#0c140f]/5 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Active DDoS Scrubbing</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Never worry about targeted IP booters or UDP flood attacks. Traffic is filtered before reaching your container.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

