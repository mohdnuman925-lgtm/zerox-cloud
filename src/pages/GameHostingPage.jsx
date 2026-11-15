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
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#121814]/90 border border-white/20 text-xs sm:text-sm font-semibold text-white shadow-lg backdrop-blur-md"
              >
                <img src="/assets/india.png" alt="India" className="w-5 h-3.5 object-cover rounded-sm" />
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
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121814]/80 border border-white/10 backdrop-blur-md space-y-3">
              <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 block">
                • SELECT YOUR PROCESSOR
              </span>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedProcessor('intel')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                    selectedProcessor === 'intel'
                      ? 'bg-white/15 border-white text-white shadow-md'
                      : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Intel Xeon E5 2699 v4
                </button>

                <button
                  onClick={() => setSelectedProcessor('amd')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                    selectedProcessor === 'amd'
                      ? 'bg-white/15 border-white text-white shadow-md'
                      : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Zap className="w-4 h-4 text-orange-400" />
                  AMD EPYC 7C13
                </button>

                <button
                  onClick={() => setSelectedProcessor('offer')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                    selectedProcessor === 'offer'
                      ? 'bg-white/15 border-white text-white shadow-md'
                      : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
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
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all shadow-lg backdrop-blur-md ${
                  selectedGame === 'minecraft'
                    ? 'bg-[#121814] border-white/40 ring-1 ring-[#C5F36A]/50 text-white'
                    : 'bg-[#121814]/70 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-emerald-950/80 border border-emerald-500/30">
                  <Gamepad2 className="w-5 h-5 text-emerald-400" />
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
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all shadow-lg backdrop-blur-md ${
                  selectedGame === 'rust'
                    ? 'bg-[#121814] border-orange-500/50 ring-1 ring-orange-500/50 text-white shadow-[0_0_25px_-5px_rgba(249,115,22,0.3)]'
                    : 'bg-[#121814]/70 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-orange-950/80 border border-orange-500/30">
                  <Flame className="w-5 h-5 text-orange-400" />
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
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all shadow-lg backdrop-blur-md ${
                  selectedGame === 'cs2'
                    ? 'bg-[#121814] border-sky-500/50 ring-1 ring-sky-500/50 text-white shadow-[0_0_25px_-5px_rgba(56,189,248,0.3)]'
                    : 'bg-[#121814]/70 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-sky-950/80 border border-sky-500/30">
                  <Crosshair className="w-5 h-5 text-sky-400" />
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
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                          isSelected
                            ? 'bg-white/20 text-white border-white shadow-md'
                            : 'bg-[#121814]/80 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
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
                          className={`relative rounded-3xl bg-[#121814]/90 backdrop-blur-md border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl h-full ${
                            isFeatured
                              ? 'border-white/30 ring-1 ring-white/20'
                              : 'border-white/10 hover:border-white/25'
                          }`}
                        >
                          {/* Top Card Graphic Banner Header matching video frame 030 */}
                          <div className="h-36 relative overflow-hidden bg-gradient-to-br from-[#2D3A2F] via-[#1A261D] to-[#0D1510] p-4 flex flex-col justify-between group">
                            {/* Minecraft Character illustration artwork background */}
                            <div
                              className="absolute inset-0 bg-cover bg-[center_top_15%] opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                              style={{
                                backgroundImage: `url('${plan.image || '/assets/minecraft-plan-card.jpg'}')`
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121814] via-black/40 to-black/25" />

                            <div className="relative z-10 flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm border border-white/10">
                                {plan.tag || 'GAMES'}
                              </span>
                              {plan.badge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 text-[#C5F36A] backdrop-blur-sm border border-[#C5F36A]/30">
                                  {plan.badge}
                                </span>
                              )}
                              {plan.save_badge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/80 text-white backdrop-blur-sm">
                                  {plan.save_badge}
                                </span>
                              )}
                            </div>

                            <div className="relative z-10">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 block">
                                MINECRAFT
                              </span>
                              <h3 className="text-base font-extrabold text-white tracking-tight leading-tight truncate">
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
                              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                                  RAM
                                </span>
                                <span className="text-xs font-bold text-white font-mono">
                                  {plan.ram}
                                </span>
                              </div>
                              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                                  CPU
                                </span>
                                <span className="text-xs font-bold text-[#C5F36A] font-mono">
                                  {plan.cpu}
                                </span>
                              </div>
                              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
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
