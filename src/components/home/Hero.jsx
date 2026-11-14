import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Cloud,
  Server,
  Globe,
  Bot,
  ArrowRight,
  Check,
  Sparkles
} from 'lucide-react';

export const Hero = () => {
  const [activeTab, setActiveTab] = useState('games');
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'games',
      label: 'Game servers',
      icon: Gamepad2,
      desc: 'Minecraft, Rust, CS2 and more — pick a game, pick a region, play in about a minute.',
      cta: 'Explore game servers',
      link: '/games'
    },
    {
      id: 'cloud',
      label: 'Cloud',
      icon: Cloud,
      desc: 'Ultra-fast NVMe cloud instances with root access, automated backups, and 10Gbps uplinks.',
      cta: 'Explore cloud servers',
      link: '/cloud'
    },
    {
      id: 'dedicated',
      label: 'Dedicated',
      icon: Server,
      desc: '100% bare-metal performance powered by AMD Ryzen 9 and Intel Xeon enterprise chips.',
      cta: 'Explore dedicated servers',
      link: '/dedicated'
    },
    {
      id: 'web',
      label: 'Web hosting',
      icon: Globe,
      desc: 'Lightning-quick web hosting with free wildcard SSL, cPanel, and unmetered SSD bandwidth.',
      cta: 'Explore web hosting',
      link: '/web'
    },
    {
      id: 'bots',
      label: 'Discord bots',
      icon: Bot,
      desc: 'High-availability bot hosting with zero sleep time, Python/Node.js runtime, and Git sync.',
      cta: 'Explore discord bots',
      link: '/bots'
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section className="relative pt-8 pb-20 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Systems Operational Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-neutral-300 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wider uppercase">ALL SYSTEMS OPERATIONAL</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
          Global cloud &amp; game server hosting.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Experience lightning-fast performance, unbeatable reliability, and 24/7 support for all your favorite games.
        </p>

        {/* Segmented Category Tabs */}
        <div className="mt-10 inline-flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-[#121814]/90 border border-white/10 backdrop-blur-md gap-1 shadow-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Glass Callout Box */}
        <div className="mt-6 max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#121814]/80 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-2xl">
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
            {currentTab.desc}
          </p>
          <button
            onClick={() => navigate(currentTab.link)}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs sm:text-sm font-bold hover:bg-[#C5F36A] transition-all shadow-lg active:scale-95"
          >
            {currentTab.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Checklist Trust Marks */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-300 font-medium">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-white" /> No setup fees
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-white" /> Instant activation
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-white" /> Pay with UPI &amp; cards
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-white" /> 24/7 support
          </span>
        </div>

        {/* Server Panel Preview Mockup with Floating Badges matching video frame 008 */}
        <div className="mt-14 max-w-5xl mx-auto relative">
          {/* Floating SLA Badges */}
          <div className="hidden sm:flex absolute -top-4 left-6 z-20 items-center gap-2 px-4 py-1.5 rounded-full bg-[#121814]/95 border border-white/15 text-xs font-semibold text-white backdrop-blur-md shadow-2xl">
            <Sparkles className="w-3.5 h-3.5 text-[#C5F36A]" />
            99.9% Uptime SLA
          </div>
          <div className="hidden sm:flex absolute -top-4 right-6 z-20 items-center gap-2 px-4 py-1.5 rounded-full bg-[#121814]/95 border border-white/15 text-xs font-semibold text-white backdrop-blur-md shadow-2xl">
            <span className="text-[#C5F36A]">⚡</span>
            Sub-15ms Latency
          </div>

          {/* Browser Window Frame */}
          <div className="rounded-3xl bg-[#0D120F]/90 border border-white/15 shadow-2xl overflow-hidden text-left backdrop-blur-md">
            {/* Browser Top Bar */}
            <div className="px-5 py-3.5 bg-[#121814]/90 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block opacity-90" />
                <span className="w-3 h-3 rounded-full bg-[#EAB308] inline-block opacity-90" />
                <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block opacity-90" />
              </div>
              <div className="px-5 py-1 rounded-lg bg-black/50 text-[11px] font-mono text-neutral-400 border border-white/5">
                portal.zeroxcloud.com / server / live-console
              </div>
              <div className="w-12" />
            </div>

            {/* High-Resolution Live Console Artwork matching reference video */}
            <div className="relative group cursor-pointer overflow-hidden">
              <img
                src="/assets/shell.png"
                alt="Pterodactyl Panel Preview"
                className="w-full h-auto object-cover select-none"
              />
              {/* Subtle hover overlay hint */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
