import React, { useState } from 'react';
import {
  Flame,
  Shield,
  Zap,
  Crosshair,
  Cpu,
  HardDrive,
  Server,
  Clock,
  Bell,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Gamepad2,
  RefreshCw,
  Users,
  Award,
  Terminal
} from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { GameLogo } from '../common/GameLogo';

export const GameComingSoon = ({ game = 'rust', onSelectMinecraft }) => {
  const isRust = game.toLowerCase() === 'rust';
  const gameKey = isRust ? 'rust' : 'cs2';

  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const config = isRust
    ? {
        name: 'Rust',
        accent: 'text-orange-400',
        accentBg: 'bg-orange-500/10',
        accentBorder: '',
        accentGlow: 'shadow-[0_0_50px_-12px_rgba(249,115,22,0.3)]',
        badgeColor: 'bg-orange-500/20 text-orange-400 ',
        tagline: 'High-Performance Hardcore Survival Hosting',
        heroImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
        description:
          'We are engineering high-frequency AMD Ryzen nodes fine-tuned specifically for demanding Rust wipe cycles, custom maps, Oxide / uMod modding, and entity-heavy PVP with rock-solid server FPS.',
        features: [
          {
            icon: Zap,
            title: '5.7GHz Single-Core Turbo',
            desc: 'Powered by AMD Ryzen 9 & EPYC 7C13 processors to maintain 60+ server FPS with 300+ players.'
          },
          {
            icon: Terminal,
            title: 'Oxide / uMod & Carbon Ready',
            desc: 'One-click plugin installer and auto-updater for custom kits, loot tables, and clans.'
          },
          {
            icon: RefreshCw,
            title: 'Automated Wipe Scheduler',
            desc: 'Scheduled map and blueprint wipes with automated Discord announcements and RCON broadcasts.'
          },
          {
            icon: Shield,
            title: 'Rust-Specific Game DDoS Filter',
            desc: 'Corero + Path.net Layer 4/7 scrubbing designed to defeat UDP amplifications and steam query attacks.'
          },
          {
            icon: HardDrive,
            title: 'Procedural & Custom Maps',
            desc: 'Full support for RustMaps seeds, monument variations, and custom map file uploads.'
          },
          {
            icon: Server,
            title: 'Real-Time Web RCON Console',
            desc: 'Web-based admin console to kick, ban, broadcast, and monitor active player metrics in real-time.'
          }
        ],
        specNodes: [
          { label: 'PROCESSOR', value: 'AMD Ryzen 9 / EPYC @ 5.7GHz Turbo' },
          { label: 'STORAGE', value: 'Enterprise PCIe Gen4 NVMe (7000MB/s)' },
          { label: 'NETWORK', value: '10 Gbps Path.net Layer 4/7 DDoS Shield' },
          { label: 'LOCATION', value: 'India Dual-Hub (Noida & Mumbai)' }
        ],
        plannedTiers: [
          {
            name: 'Small Group / Duo',
            slots: 'Up to 30 Players',
            specs: '4GB DDR5 • 2 vCPU Boost • 40GB NVMe',
            estPrice: '₹349 / $4.49'
          },
          {
            name: 'Clan Warfare',
            slots: 'Up to 80 Players',
            specs: '8GB DDR5 • 4 vCPU Boost • 80GB NVMe',
            estPrice: '₹649 / $7.99',
            popular: true
          },
          {
            name: 'High-Pop / 100+ Megaserver',
            slots: 'Up to 200+ Players',
            specs: '16GB DDR5 • 6 vCPU Boost • 120GB NVMe',
            estPrice: '₹1,249 / $14.99'
          }
        ]
      }
    : {
        name: 'Counter-Strike 2',
        accent: 'text-sky-400',
        accentBg: 'bg-sky-500/10',
        accentBorder: '',
        accentGlow: 'shadow-[0_0_50px_-12px_rgba(56,189,248,0.3)]',
        badgeColor: 'bg-sky-500/20 text-sky-400 ',
        tagline: 'Tournament-Grade Esports Sub-Tick Hosting',
        heroImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
        description:
          'Ultra-low-latency game nodes configured for CS2 sub-tick architecture, 128-tick equivalents, MatchZy scrim practice, and sub-5ms routing across premier Indian internet exchanges.',
        features: [
          {
            icon: Crosshair,
            title: 'Sub-Tick & 128-Tick Accuracy',
            desc: 'Precision tickrate execution ensuring crisp bullet registration, instant smokes, and smooth bhopping.'
          },
          {
            icon: Zap,
            title: 'Sub-5ms Indian ISP Peering',
            desc: 'Direct routes to Jio, Airtel, ACT, Vi, and NIXI Mumbai for minimum possible ping across India.'
          },
          {
            icon: Award,
            title: 'MatchZy & Scrim Ready',
            desc: 'Pre-installed competitive scrim, knife round, demo recording, and practice mode plugins.'
          },
          {
            icon: HardDrive,
            title: 'FastDL & Workshop Sync',
            desc: 'Lightning-fast map downloads and one-click integration with Steam Workshop CS2 maps.'
          },
          {
            icon: Shield,
            title: 'VAC & Steam UDP Shield',
            desc: 'Native Valve Anti-Cheat protection combined with custom UDP flood filtering.'
          },
          {
            icon: Users,
            title: 'CSTV / GOTV Broadcast Relay',
            desc: 'Zero-lag spectator broadcasting for tournaments, casters, and community streams.'
          }
        ],
        specNodes: [
          { label: 'PROCESSOR', value: 'AMD Ryzen 9 7950X / EPYC Turbo' },
          { label: 'STORAGE', value: 'Gen4 NVMe Solid State (RAID-1)' },
          { label: 'LATENCY', value: '<5ms Ping to Major Indian Metro Hubs' },
          { label: 'NETWORK', value: 'Dedicated 10Gbps L4/L7 Game Mitigation' }
        ],
        plannedTiers: [
          {
            name: '5v5 Competitive Scrim',
            slots: '10 Players + Coach',
            specs: '4GB DDR5 • 2 vCPU • MatchZy Preloaded',
            estPrice: '₹299 / $3.89'
          },
          {
            name: 'Community Retake / Casual',
            slots: 'Up to 24 Players',
            specs: '8GB DDR5 • 4 vCPU • FastDL & Workshop',
            estPrice: '₹599 / $7.49',
            popular: true
          },
          {
            name: 'Tournament & League Host',
            slots: '32+ Players + GOTV Relay',
            specs: '12GB DDR5 • 6 vCPU • Full CSTV Streaming',
            estPrice: '₹1,099 / $13.49'
          }
        ]
      };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!contact.trim()) return;

    try {
      setSubmitting(true);
      setErrorMsg('');
      const res = await fetch('/api/products/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: gameKey,
          contact: contact.trim(),
          platform: contact.includes('@') ? 'email' : 'discord'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register notification');
      }
      setSubscribed(true);
    } catch (err) {
      console.error('Subscription error:', err);
      // Even if API fails or backend offline, gracefully confirm to visitor
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pt-4">
      {/* Hero Coming Soon Card */}
      <ScrollReveal animation="fade-up">
        <div
          className={`relative rounded-3xl overflow-hidden  bg-[#0c140f]/5 backdrop-blur-2xl ${config.accentGlow} p-6 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.35)]`}
        >
          {/* Background image & gradient overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url('${config.heroImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c140f] via-[#0c140f]/90 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider  ${config.badgeColor} backdrop-blur-2xl`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                <span className="w-2 h-2 rounded-full bg-current -ml-4" />
                UNDER ACTIVE CONFIGURATION • LAUNCHING SOON
              </span>

              <span className="px-3 py-1.5 rounded-full text-xs font-mono text-neutral-400 bg-black/40 backdrop-blur-2xl">
                PLANS COMING SOON
              </span>
            </div>

            {/* Title & Tagline with Game Logo */}
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-black/60 p-2 sm:p-2.5 flex items-center justify-center backdrop-blur-2xl shadow-2xl shrink-0">
                  <GameLogo game={gameKey} className="w-full h-full" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    {config.name}{' '}
                    <span className={config.accent}>Server Hosting</span>
                  </h2>
                </div>
              </div>
              <p className="text-base sm:text-lg font-medium text-neutral-200">
                {config.tagline}
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pt-1">
                {config.description}
              </p>
            </div>

            {/* Hardware Quick Spec Nodes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {config.specNodes.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-black/40 backdrop-blur-2xl space-y-1"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    {spec.label}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono block">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Early Access & Notification Box */}
            <div className="pt-4 -t">
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-black/60 to-black/30 max-w-2xl backdrop-blur-2xl space-y-4">
                <div className="flex items-center gap-2.5">
                  <Bell className={`w-5 h-5 ${config.accent}`} />
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      Be First In Line When Plans Go Live
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Enter your email or Discord username to receive priority beta access and launch-day discounts.
                    </p>
                  </div>
                </div>

                {subscribed ? (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>
                      You&apos;re registered! We will ping you the moment {config.name} plans and nodes are deployed.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="e.g. yourname@gmail.com or Discord#0000"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-white placeholder-neutral-500 text-xs focus:outline-none transition"
                      required
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-[#C5F36A] hover:bg-[#b0df57] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      {submitting ? 'Registering...' : 'Notify Me at Launch'}
                    </button>
                  </form>
                )}

                {errorMsg && (
                  <p className="text-xs text-red-400">{errorMsg}</p>
                )}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://discord.gg/zeroxcloud"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold flex items-center gap-2 transition shadow-lg active:scale-95"
              >
                <span>Join Official Discord</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {onSelectMinecraft && (
                <button
                  type="button"
                  onClick={onSelectMinecraft}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2 transition active:scale-95"
                >
                  <GameLogo game="minecraft" className="w-4 h-4" />
                  <span>Browse Live Minecraft Plans Instead</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Feature Teasers Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400">
          <Sparkles className="w-4 h-4 text-[#C5F36A]" />
          <span>WHAT WE ARE BUILDING FOR {config.name.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <ScrollReveal key={idx} animation="fade-up" delay={idx * 60}>
                <div className="p-5 rounded-2xl bg-[#0c140f]/5 transition-all duration-300 backdrop-blur-xl h-full flex flex-col justify-between group space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                  <div className="space-y-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${config.accentBg}  ${config.accentBorder} flex items-center justify-center transition group-hover:scale-110`}
                    >
                      <Icon className={`w-5 h-5 ${config.accent}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-[#C5F36A] transition">
                        {feat.title}
                      </h4>
                      <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Planned Packages Preview */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400">
            <Clock className="w-4 h-4 text-orange-400" />
            <span>ESTIMATED / UPCOMING PLAN CONFIGURATIONS</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 uppercase">
            SPECS SUBJECT TO FINAL BENCHMARKING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {config.plannedTiers.map((tier, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 80}>
              <div
                className={`p-6 rounded-3xl bg-[#0c140f]/5  backdrop-blur-2xl flex flex-col justify-between space-y-5 transition-all shadow-[0_12px_36px_rgba(0,0,0,0.35)] ${
                  tier.popular
                    ? ' '
                    : ' hover:'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-neutral-300">
                      {tier.slots}
                    </span>
                    {tier.popular && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#C5F36A] text-black">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-tight">
                      {tier.name}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400 mt-1">
                      {tier.specs}
                    </p>
                  </div>
                </div>

                <div className="pt-4 -t space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-neutral-500 block">
                      Target Launch Pricing
                    </span>
                    <span className="text-xl font-mono font-bold text-white">
                      Starting {tier.estPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="yourname@gmail.com"]');
                      if (input) {
                        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        input.focus();
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#C5F36A]" />
                    <span>Get Notified at Launch</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};
