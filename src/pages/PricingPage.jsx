import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Check, ArrowRight, ShoppingCart } from 'lucide-react';
import { ScrollReveal } from '../components/common/ScrollReveal';
import minecraftPlanImage from '../assets/minecraft-plan-card.jpg';

export const PricingPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, currency } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products/plans')
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? plans
    : plans.filter((p) => p.category === activeCategory);

  const symbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" className="text-center mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5F36A]">
            TRANSPARENT PRICING
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
            Compare Hosting Packages
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto">
            Choose the perfect resource allocation for your community, startup, or enterprise workload.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-[#121814] border border-white/10 gap-1">
            {[
              { id: 'all', label: 'All Packages' },
              { id: 'games', label: 'Game Servers' },
              { id: 'cloud', label: 'Cloud VPS' },
              { id: 'dedicated', label: 'Dedicated' },
              { id: 'web', label: 'Web Hosting' },
              { id: 'discord-bots', label: 'Discord Bots' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeCategory === cat.id
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Plans Table / Cards */}
        {loading ? (
          <div className="py-20 text-center text-neutral-400">Loading catalog pricing...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((plan, idx) => {
              const price = currency === 'USD' ? plan.price_usd : plan.price_inr;
              return (
                <ScrollReveal
                  key={plan.id}
                  animation="fade-up"
                  delay={idx * 60}
                  className="h-full"
                >
                <div
                  className="p-6 rounded-3xl bg-[#121814] border border-white/10 hover:border-[#C5F36A]/40 transition duration-300 flex flex-col justify-between shadow-xl h-full hover:-translate-y-1 overflow-hidden"
                >
                  <div>
                    {(plan.game_slug === 'minecraft' || plan.category === 'games') && (
                      <div className="h-32 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                        <img
                          src={minecraftPlanImage}
                          alt="Minecraft"
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121814] via-black/20 to-transparent" />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 text-white">
                        {plan.category}
                      </span>
                      {plan.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#C5F36A] text-black">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-white">{plan.name}</h3>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold font-mono text-white">
                        {symbol}{Number(price).toFixed(2)}
                      </span>
                      <span className="text-xs text-neutral-400">/mo</span>
                    </div>

                    <div className="my-5 space-y-1.5 py-3 border-y border-white/10 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">RAM</span>
                        <span className="font-bold text-white font-mono">{plan.ram}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">CPU</span>
                        <span className="font-bold text-[#C5F36A] font-mono">{plan.cpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Storage</span>
                        <span className="font-bold text-white font-mono">{plan.storage}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-neutral-300 mb-6">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#C5F36A]" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        addToCart(plan);
                        navigate('/checkout');
                      }}
                      className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition flex items-center justify-center gap-1 shadow-md"
                    >
                      Configure &amp; Buy
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => addToCart(plan)}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
                      title="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

