import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Server, Check, ArrowRight, ShoppingCart, ShieldCheck } from 'lucide-react';

export const DedicatedServersPage = () => {
  const [plans, setPlans] = useState([]);
  const { addToCart, currency } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products/plans?category=dedicated')
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []));
  }, []);

  const handleOrder = (plan, direct = false) => {
    addToCart(plan, { game: 'Dedicated Server', software: 'Bare-Metal OS' });
    if (direct) navigate('/checkout');
  };

  const symbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            ENTERPRISE HARDWARE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
            Dedicated Bare-Metal Servers
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-300">
            Unshared hardware, IPMI remote KVM, clean IPv4 subnets, and unmetered network pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => {
            const price = currency === 'USD' ? plan.price_usd : plan.price_inr;
            return (
              <div
                key={plan.id}
                className="p-8 rounded-3xl bg-[#0c140f]/25 backdrop-blur-2xl border border-white/15 hover:border-emerald-400/50 transition duration-300 flex flex-col justify-between shadow-[0_16px_48px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.14)] hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-white/10 text-emerald-400 border border-white/10">
                      {plan.tag}
                    </span>
                    {plan.badge && (
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-400 text-black">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono text-white">
                      {symbol}{Number(price).toFixed(2)}
                    </span>
                    <span className="text-xs text-neutral-400">/month</span>
                  </div>

                  <div className="my-6 space-y-2 py-4 border-y border-white/10 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Processor</span>
                      <span className="font-bold text-white">{plan.cpu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">ECC RAM</span>
                      <span className="font-bold text-white">{plan.ram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">NVMe Array</span>
                      <span className="font-bold text-white">{plan.storage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Bandwidth</span>
                      <span className="font-bold text-white">{plan.bandwidth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Datacenter</span>
                      <span className="font-bold text-[#C5F36A]">{plan.location}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-neutral-300 mb-8">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOrder(plan, true)}
                    className="flex-1 py-3.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-emerald-400 transition flex items-center justify-center gap-1 shadow-md"
                  >
                    Provision Dedicated Server
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOrder(plan, false)}
                    className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
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

