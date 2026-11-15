import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { scrollTo } from '../../hooks/useLenis';

export const Hero = () => {
  const [activeTab, setActiveTab] = useState('games');
  const [scrollY, setScrollY] = useState(0);
  const [siteSettings, setSiteSettings] = useState(null);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const panelUrl = siteSettings?.pterodactyl_panel_url || 'https://portal.zorixcloud.com';
  const displayPanelUrl = (panelUrl || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');

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

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    // Interactive 3D tilt physics matching reference recording
    const rotateX = -yPct * 24;
    const rotateY = xPct * 26;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

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

        {/* Server Panel Preview Mockup with 3D Mouse Tilt & Floating Badges matching video */}
        <ScrollReveal animation="zoom-in" delay={120} duration={850} className="mt-14 max-w-5xl mx-auto relative select-none">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative py-6 px-2"
            style={{
              perspective: '1200px'
            }}
          >
            {/* 3D Tilted Card Wrapper */}
            <div
              className="relative rounded-3xl transition-transform ease-out will-change-transform cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
                transform: isHovered
                  ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                  : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                transitionDuration: isHovered ? '120ms' : '650ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Floating SLA Badges with 3D Parallax Depth */}
              <div
                className="hidden sm:flex absolute -top-3 left-6 z-30 items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 border border-white/20 text-xs font-semibold text-white backdrop-blur-xl shadow-2xl transition-transform"
                style={{
                  transform: 'translateZ(38px)'
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                99.9% Uptime SLA
              </div>

              <div
                className="hidden sm:flex absolute -top-3 right-6 z-30 items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 border border-white/20 text-xs font-semibold text-white backdrop-blur-xl shadow-2xl transition-transform"
                style={{
                  transform: 'translateZ(38px)'
                }}
              >
                <span className="text-[#C5F36A] text-xs">⚡</span>
                Sub-15ms Latency
              </div>

              {/* Browser Window Frame */}
              <div className="relative rounded-3xl bg-[#090f0b]/80 border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.18)] overflow-hidden text-left backdrop-blur-2xl">
                {/* Browser Top Bar */}
                <div className="px-5 py-3.5 bg-[#0e1611]/90 border-b border-white/10 backdrop-blur-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block opacity-90 shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#EAB308] inline-block opacity-90 shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block opacity-90 shadow-sm" />
                  </div>
                  <div className="px-4 py-1 rounded-lg bg-black/60 text-[11px] font-mono text-neutral-300 border border-white/10">
                    {displayPanelUrl} / server / live-console
                  </div>
                  <div className="w-12" />
                </div>

                {/* High-Resolution Live Console Artwork matching reference video */}
                <div className="relative overflow-hidden">
                  <img
                    src="/assets/shell.png"
                    alt="Pterodactyl Panel Preview"
                    className="w-full h-auto object-cover select-none block"
                    loading="eager"
                  />

                  {/* Dynamic Specular Light Glare Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      opacity: isHovered ? 0.35 : 0,
                      background: `radial-gradient(circle 420px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)`
                    }}
                  />
                </div>
              </div>

              {/* Floating Bottom Game Panel Pill Button */}
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center transition-transform"
                style={{
                  transform: 'translateX(-50%) translateZ(42px)'
                }}
              >
                <a
                  href={panelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-black/90 hover:bg-neutral-900 border border-white/25 hover:border-[#C5F36A]/50 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-200 active:scale-95 group"
                >
                  <Gamepad2 className="w-4 h-4 text-white group-hover:text-[#C5F36A] transition-colors" />
                  <span className="tracking-wide">Game Panel: {displayPanelUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                </a>
              </div>
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
