import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Cloud, Check, ArrowRight, ShoppingCart, Shield, HardDrive, Cpu, Radio } from 'lucide-react';

export const CloudVPSPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedOS, setSelectedOS] = useState('Ubuntu 24.04 LTS');
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, India');
  const [loading, setLoading] = useState(true);

  const { addToCart, currency } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/products/plans?category=cloud');
        const data = await res.json();
        setPlans(data.plans || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleOrder = (plan, direct = false) => {
    addToCart(plan, {
      location: selectedLocation,
      software: selectedOS,
      game: 'Cloud VPS'
    });
    if (direct) navigate('/checkout');
  };

  const symbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            CLOUD INFRASTRUCTURE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
            High-Performance Cloud VPS
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-300">
            Deploy full root access NVMe virtual private servers on low-latency Tier-3 Indian backbones.
          </p>
        </div>

        {/* Configuration selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* OS Selector */}
          <div className="p-6 rounded-3xl bg-[#121814] border border-white/10 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">
              01 • Select Operating System
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['Ubuntu 24.04 LTS', 'Debian 12 Bookworm', 'AlmaLinux 9', 'Windows Server 2022'].map((os) => (
                <button
                  key={os}
                  onClick={() => setSelectedOS(os)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition ${
                    selectedOS === os
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-black/40 border-white/10 text-neutral-300 hover:text-white'
                  }`}
                >
                  {os}
                </button>
              ))}
            </div>
          </div>

          {/* Region Selector */}
          <div className="p-6 rounded-3xl bg-[#121814] border border-white/10 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">
              02 • Select Datacenter Region
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Mumbai, India', ping: 'sub-15ms' },
                { name: 'Noida, India', ping: 'sub-20ms' },
                { name: 'Singapore, Asia', ping: 'sub-45ms' }
              ].map((reg) => (
                <button
                  key={reg.name}
                  onClick={() => setSelectedLocation(reg.name)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition flex items-center justify-between ${
                    selectedLocation === reg.name
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-black/40 border-white/10 text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>{reg.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400">{reg.ping}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const price = currency === 'USD' ? plan.price_usd : plan.price_inr;
            const isRec = plan.badge === 'RECOMMENDED';

            return (
              <div
                key={plan.id}
                className={`p-8 rounded-3xl bg-[#121814] border flex flex-col justify-between transition-all duration-300 shadow-xl ${
                  isRec ? 'border-cyan-400 ring-1 ring-cyan-400/30' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-white/10 text-cyan-400 border border-white/10">
                      {plan.tag}
                    </span>
                    {plan.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-400 text-black">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      {symbol}{Number(price).toFixed(2)}
                    </span>
                    <span className="text-xs text-neutral-400">/month</span>
                  </div>

                  <div className="my-6 space-y-2 py-4 border-y border-white/10 text-xs">
                    <div className="flex justify-between text-neutral-300">
                      <span className="text-neutral-500">vCPU</span>
                      <span className="font-bold font-mono text-white">{plan.cpu}</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span className="text-neutral-500">Memory</span>
                      <span className="font-bold font-mono text-white">{plan.ram}</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span className="text-neutral-500">Storage</span>
                      <span className="font-bold font-mono text-white">{plan.storage}</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span className="text-neutral-500">Bandwidth</span>
                      <span className="font-bold font-mono text-white">{plan.bandwidth}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-neutral-300 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleOrder(plan, true)}
                    className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-cyan-400 transition flex items-center justify-center gap-1 shadow-md"
                  >
                    Deploy Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOrder(plan, false)}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
                    title="Add to cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

