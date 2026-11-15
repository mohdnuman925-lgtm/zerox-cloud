import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Gamepad2,
  Cpu,
  Zap,
  Gift,
  MapPin,
  Check,
  ShoppingCart,
  ArrowRight,
  Flame,
  Crosshair
} from 'lucide-react';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { GameComingSoon } from '../components/games/GameComingSoon';
import { GameLogo } from '../components/common/GameLogo';
import minecraftPlanImage from '../assets/minecraft-plan-card.jpg';

export const GameHostingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { gameSlug } = useParams();

  // Normalize game from route param (/games/:gameSlug), pathname, or query param (?game=...)
  const getNormalizedGame = () => {
    const raw = (gameSlug || searchParams.get('game') || '').toLowerCase();
    if (raw === 'cs' || raw === 'cs2') return 'cs2';
    if (raw === 'rust') return 'rust';
    if (raw === 'minecraft') return 'minecraft';

    const pathParts = location.pathname.toLowerCase().split('/').filter(Boolean);
    if (pathParts[0] === 'games' && pathParts[1]) {
      const g = pathParts[1];
      if (g === 'cs' || g === 'cs2') return 'cs2';
      if (g === 'rust') return 'rust';
      if (g === 'minecraft') return 'minecraft';
    }
    return 'minecraft';
  };

  const [selectedLocation, setSelectedLocation] = useState('India (Noida & Mumbai)');
  const [selectedProcessor, setSelectedProcessor] = useState('intel');
  const [selectedGame, setSelectedGame] = useState(getNormalizedGame);
  const [selectedSoftware, setSelectedSoftware] = useState('Paper');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, currency } = useCart();
  const navigate = useNavigate();

  // Sync state whenever URL pathname or searchParams change
  useEffect(() => {
    const normalized = getNormalizedGame();
    if (normalized !== selectedGame) {
      setSelectedGame(normalized);
    }
  }, [gameSlug, location.pathname, searchParams]);

  useEffect(() => {
    if (selectedGame !== 'minecraft') {
      setPlans([]);
      setLoading(false);
      return;
    }

    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/plans?category=games&game=${selectedGame}`);
        const data = await res.json();
        setPlans(data.plans || []);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [selectedGame]);

  const handleGameSelect = (gameKey) => {
    setSelectedGame(gameKey);
    setSearchParams({ game: gameKey });
  };

  const filteredPlans = plans.filter((p) => {
    if (selectedProcessor === 'intel') return p.processor === 'intel';
    if (selectedProcessor === 'amd') return p.processor === 'amd';
    if (selectedProcessor === 'ryzen') return p.processor === 'ryzen';
    if (selectedProcessor === 'offer') return p.processor === 'offer';
    return true;
  });

  const handleOrderNow = (plan) => {
    addToCart(plan, {
      location: selectedLocation,
      game: selectedGame === 'minecraft' ? 'Minecraft' : selectedGame.toUpperCase(),
      software: selectedSoftware
    });
    navigate('/checkout');
  };

  const handleAddToCart = (plan) => {
    addToCart(plan, {
      location: selectedLocation,
      game: selectedGame === 'minecraft' ? 'Minecraft' : selectedGame.toUpperCase(),
      software: selectedSoftware
    });
  };

  const symbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header matching video frame 024 */}
        <div className="text-left mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            — GAME SERVERS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
            Choose your game server
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-300">
            Optimised, pre-configured game servers with DDoS protection and instant activation.
          </p>
        </div>

        {/* 5-Step Configurator matching video frames 024-030 */}
        <div className="space-y-8">
          {/* STEP 01: LOCATION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px]">
                01
              </span>
              LOCATION
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedLocation('India (Noida & Mumbai)')}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#0e1611]/5 border border-white/20 text-xs sm:text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl hover:border-white/35 transition"
              >
                <img src="/assets/india.png" alt="India" className="w-5 h-3.5 object-cover rounded-sm shadow" />
                <span>India (Noida &amp; Mumbai)</span>
              </button>
            </div>
          </div>

          {/* STEP 02: PLAN TYPE / SELECT YOUR PROCESSOR */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px]">
                02
              </span>
              PLAN TYPE
            </div>

            {/* Processor box container */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1611]/5 border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.14)] space-y-3">
              <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 block">
                • SELECT YOUR PROCESSOR
              </span>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedProcessor('intel')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all backdrop-blur-md ${
                    selectedProcessor === 'intel'
                      ? 'bg-white/20 border-white/40 text-white shadow-[0_4px_20px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Intel Xeon E5 2699 v4
                </button>

                <button
                  onClick={() => setSelectedProcessor('amd')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all backdrop-blur-md ${
                    selectedProcessor === 'amd'
                      ? 'bg-white/20 border-white/40 text-white shadow-[0_4px_20px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  <Zap className="w-4 h-4 text-orange-400" />
                  AMD EPYC 7C13
                </button>

                <button
                  onClick={() => setSelectedProcessor('ryzen')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all backdrop-blur-md ${
                    selectedProcessor === 'ryzen'
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_4px_20px_rgba(244,63,94,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  <Flame className="w-4 h-4 text-rose-400" />
                  AMD Ryzen 9 7950X
                </button>

                <button
                  onClick={() => setSelectedProcessor('offer')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all backdrop-blur-md ${
                    selectedProcessor === 'offer'
                      ? 'bg-[#C5F36A]/20 border-[#C5F36A]/40 text-[#C5F36A] shadow-[0_4px_20px_rgba(197,243,106,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  <Gift className="w-4 h-4 text-[#C5F36A]" />
                  Offer Plan
                </button>
              </div>
            </div>
          </div>

          {/* STEP 03: GAME / SOFTWARE */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px]">
                03
              </span>
              GAME / SOFTWARE
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Minecraft (Live) */}
              <button
                type="button"
                onClick={() => handleGameSelect('minecraft')}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl ${
                  selectedGame === 'minecraft'
                    ? 'bg-[#0e1812]/15 border-white/35 ring-1 ring-[#C5F36A]/50 text-white shadow-[0_0_25px_-5px_rgba(197,243,106,0.3)]'
                    : 'bg-[#0c120e]/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 bg-emerald-950/80 p-1.5 flex items-center justify-center shrink-0 shadow-md">
                  <GameLogo game="minecraft" className="w-full h-full" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Minecraft</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-normal">Paper, Purpur, Bedrock</span>
                </div>
              </button>

              {/* Rust (Coming Soon) */}
              <button
                type="button"
                onClick={() => handleGameSelect('rust')}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl ${
                  selectedGame === 'rust'
                    ? 'bg-[#18110b]/15 border-orange-500/50 ring-1 ring-orange-500/50 text-white shadow-[0_0_25px_-5px_rgba(249,115,22,0.3)]'
                    : 'bg-[#0c120e]/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-orange-500/40 bg-orange-950/80 p-1.5 flex items-center justify-center shrink-0 shadow-md">
                  <GameLogo game="rust" className="w-full h-full" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Rust</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      SOON
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-normal">Oxide / uMod high-tick</span>
                </div>
              </button>

              {/* Counter-Strike 2 (Coming Soon) */}
              <button
                type="button"
                onClick={() => handleGameSelect('cs2')}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl ${
                  selectedGame === 'cs2'
                    ? 'bg-[#0b1419]/15 border-sky-500/50 ring-1 ring-sky-500/50 text-white shadow-[0_0_25px_-5px_rgba(56,189,248,0.3)]'
                    : 'bg-[#0c120e]/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-sky-500/40 bg-sky-950/80 p-1.5 flex items-center justify-center shrink-0 shadow-md">
                  <GameLogo game="cs2" className="w-full h-full" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Counter-Strike 2</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      SOON
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-normal">128-tick tournament nodes</span>
                </div>
              </button>
            </div>
          </div>

          {/* IF RUST OR CS2: SHOW HIGH-PRODUCTION COMING SOON VIEW */}
          {selectedGame !== 'minecraft' ? (
            <GameComingSoon
              game={selectedGame}
              onSelectMinecraft={() => handleGameSelect('minecraft')}
            />
          ) : (
            <>
              {/* STEP 04: INSTANCE TYPE */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px]">
                    04
                  </span>
                  INSTANCE TYPE
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {[
                    'Paper',
                    'Bungeecord',
                    'Forge Minecraft',
                    'Vanilla Minecraft',
                    'Sponge (SpongeVanilla)',
                    'Vanilla Bedrock'
                  ].map((inst) => {
                    const isSelected = selectedSoftware === inst;
                    return (
                      <button
                        key={inst}
                        onClick={() => setSelectedSoftware(inst)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all backdrop-blur-md ${
                          isSelected
                            ? 'bg-white/20 text-white border-white/40 shadow-[0_4px_16px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]'
                            : 'bg-[#0c140f]/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/25 hover:bg-white/5'
                        }`}
                      >
                        {inst}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 05: CHOOSE A PLAN */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px]">
                      05
                    </span>
                    CHOOSE A PLAN
                  </div>
                  <span className="text-xs text-neutral-400">
                    Showing {filteredPlans.length} packages
                  </span>
                </div>

                {/* Featured Minecraft Plans Showcase Banner */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/10 via-[#0e1611]/5 to-black/5 border border-emerald-500/30 backdrop-blur-2xl flex flex-col sm:flex-row items-center gap-5 shadow-[0_16px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)]">
                  <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden border border-white/20 shadow-xl shrink-0">
                    <img
                      src={minecraftPlanImage}
                      alt="Minecraft Server Plans"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        OFFICIAL MINECRAFT HOSTING
                      </span>
                      <span className="text-xs font-mono text-neutral-400">
                        • 20 TPS HIGH-FREQUENCY NODES
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white">
                      High-Performance Minecraft Server Packages
                    </h2>
                    <p className="text-xs text-neutral-300 max-w-xl">
                      Ultra-low latency Paper, Purpur, Forge, Fabric &amp; Bedrock servers with 1-click modpack installer, automated NVMe cloud backups, and sub-10ms Indian routing.
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="py-20 text-center text-neutral-400">
                    <div className="w-8 h-8 border-2 border-[#C5F36A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Loading packages...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredPlans.map((plan, idx) => {
                      const price = currency === 'USD' ? plan.price_usd : plan.price_inr;
                      const isFeatured = plan.badge === 'MOST SOLD' || plan.badge === 'LIMITED STOCK';

                      return (
                        <ScrollReveal
                          key={plan.id}
                          animation="fade-up"
                          delay={idx * 60}
                          className="h-full"
                        >
                        <div
                          className={`relative rounded-3xl bg-[#0b130e]/5 backdrop-blur-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.14)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_25px_rgba(197,243,106,0.15),inset_0_1px_1px_rgba(255,255,255,0.22)] hover:border-[#C5F36A]/45 hover:-translate-y-1 h-full ${
                            isFeatured
                              ? 'border-white/35 ring-1 ring-white/20'
                              : 'border-white/15 hover:border-white/30'
                          }`}
                        >
                          {/* Top Card Graphic Banner Header */}
                          <div className="h-48 relative overflow-hidden bg-black/40 rounded-t-3xl flex flex-col justify-between group">
                            {/* Minecraft Character illustration artwork */}
                            <img
                              src={plan.image || minecraftPlanImage}
                              alt={plan.name}
                              className="absolute inset-0 w-full h-full object-cover object-top opacity-100 group-hover:scale-105 transition-all duration-500"
                              loading="eager"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b130e]/30 via-transparent to-transparent pointer-events-none" />

                            <div className="relative z-10 flex flex-wrap items-center gap-1.5 p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-md border border-white/15">
                                {plan.tag || 'GAMES'}
                              </span>
                              {plan.badge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-black/80 text-[#C5F36A] backdrop-blur-md border border-[#C5F36A]/40">
                                  {plan.badge}
                                </span>
                              )}
                              {plan.save_badge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur-sm">
                                  {plan.save_badge}
                                </span>
                              )}
                            </div>

                            <div className="relative z-10 p-3 pt-0">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5F36A] font-bold block drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                                MINECRAFT
                              </span>
                              <h3 className="text-base font-extrabold text-white tracking-tight leading-tight truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                                {plan.name}
                              </h3>
                            </div>
                          </div>

                          {/* Card Content & Specs */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            {/* Price */}
                            <div>
                              {plan.original_price_inr && (
                                <span className="text-xs text-neutral-500 line-through font-mono block">
                                  {symbol}{currency === 'USD' ? (plan.original_price_inr * 0.012).toFixed(2) : plan.original_price_inr.toFixed(2)}
                                </span>
                              )}
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-white font-mono">
                                  {symbol}{Number(price).toFixed(2)}
                                </span>
                                <span className="text-xs text-neutral-400">/mo</span>
                              </div>
                            </div>

                            {/* Resource Grid: RAM, CPU, SSD */}
                            <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center">
                              <div className="p-2 rounded-xl bg-black/10 backdrop-blur-sm border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                                  RAM
                                </span>
                                <span className="text-xs font-bold text-white font-mono">
                                  {plan.ram}
                                </span>
                              </div>
                              <div className="p-2 rounded-xl bg-black/10 backdrop-blur-sm border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                                  CPU
                                </span>
                                <span className="text-xs font-bold text-[#C5F36A] font-mono">
                                  {plan.cpu}
                                </span>
                              </div>
                              <div className="p-2 rounded-xl bg-black/10 backdrop-blur-sm border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                                  SSD
                                </span>
                                <span className="text-xs font-bold text-white font-mono truncate block">
                                  {plan.storage}
                                </span>
                              </div>
                            </div>

                            {/* Features List */}
                            <div className="space-y-1.5 text-xs text-neutral-300">
                              <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                                <MapPin className="w-3.5 h-3.5 text-[#C5F36A]" />
                                <span>{selectedLocation}</span>
                              </div>
                              {plan.features.slice(0, 4).map((f, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px]">
                                  <Check className="w-3.5 h-3.5 text-[#C5F36A]" />
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2">
                              <button
                                onClick={() => handleOrderNow(plan)}
                                className="flex-1 py-2.5 px-4 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition-all flex items-center justify-center gap-1 shadow-md active:scale-95"
                              >
                                Order now
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleAddToCart(plan)}
                                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
                                title="Add to cart"
                                aria-label="Add to cart"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
