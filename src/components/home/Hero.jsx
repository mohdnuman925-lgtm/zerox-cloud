import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Cloud,
  Server,
  Globe,
  Bot,
  ArrowRight,
  Check,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { scrollTo } from '../../hooks/useLenis';

export const Hero = () => {
  const [activeTab, setActiveTab] = useState('games');
  const [scrollY, setScrollY] = useState(0);
  const [siteSettings, setSiteSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products/settings')
      .then((r) => r.json())
      .then((d) => setSiteSettings(d.settings || null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY || 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0e1611]/60 border border-white/15 text-xs font-mono font-medium text-neutral-300 mb-8 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wider uppercase">
            {siteSettings?.announcement_text || 'ALL SYSTEMS OPERATIONAL'}
          </span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
          {siteSettings?.hero_title || 'Global cloud & game server hosting.'}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {siteSettings?.hero_subtitle || 'Experience lightning-fast performance, unbeatable reliability, and 24/7 support for all your favorite games.'}
        </p>

        {/* Segmented Category Tabs */}
        <div className="mt-10 inline-flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-[#0e1611]/60 border border-white/15 backdrop-blur-2xl gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.14)]">
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
        <div className="mt-6 max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#0e1611]/60 border border-white/15 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-[0_12px_36px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.14)]">
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

        {/* Server Panel Preview Mockup with Floating Badges and Scroll Parallax */}
        <ScrollReveal animation="zoom-in" delay={120} duration={850} className="mt-14 max-w-5xl mx-auto relative [perspective:1000px]">
          {/* Floating SLA Badges with Parallax Drift */}
          <div
            className="hidden sm:flex absolute -top-4 left-6 z-20 items-center gap-2 px-4 py-1.5 rounded-full bg-[#0e1611]/85 border border-white/20 text-xs font-semibold text-white backdrop-blur-xl shadow-2xl transition-transform duration-100 ease-out"
            style={{
              transform: `translateY(${-Math.min(scrollY * 0.08, 16)}px)`
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5F36A]" />
            99.9% Uptime SLA
          </div>
          <div
            className="hidden sm:flex absolute -top-4 right-6 z-20 items-center gap-2 px-4 py-1.5 rounded-full bg-[#0e1611]/85 border border-white/20 text-xs font-semibold text-white backdrop-blur-xl shadow-2xl transition-transform duration-100 ease-out"
            style={{
              transform: `translateY(${-Math.min(scrollY * 0.08, 16)}px)`
            }}
          >
            <span className="text-[#C5F36A]">⚡</span>
            Sub-15ms Latency
          </div>

          {/* Browser Window Frame with subtle scroll perspective */}
          <div
            className="rounded-3xl bg-[#090f0b]/70 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.16)] overflow-hidden text-left backdrop-blur-2xl transition-transform duration-100 ease-out"
            style={{
              transform: `translateY(${Math.min(scrollY * 0.04, 20)}px) scale(${Math.max(0.97, 1 - scrollY * 0.00008)})`
            }}
          >
            {/* Browser Top Bar */}
            <div className="px-5 py-3.5 bg-[#0e1611]/80 border-b border-white/10 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block opacity-90" />
                <span className="w-3 h-3 rounded-full bg-[#EAB308] inline-block opacity-90" />
                <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block opacity-90" />
              </div>
              <div className="px-5 py-1 rounded-lg bg-black/50 text-[11px] font-mono text-neutral-400 border border-white/5">
                panel.zeroxcloud.site / server / live-console
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
        </ScrollReveal>

        {/* Scroll To Explore Animated Indicator */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={() => scrollTo('#bento-grid')}
            className="group flex flex-col items-center gap-2.5 text-neutral-400 hover:text-white transition-all cursor-pointer focus:outline-none"
            aria-label="Scroll to explore"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 group-hover:text-[#C5F36A] transition-colors">
              Scroll to explore
            </span>
            <div className="w-5 h-8 rounded-full border border-white/20 group-hover:border-[#C5F36A]/60 flex items-start justify-center p-1 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5F36A] animate-scroll-wheel" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
