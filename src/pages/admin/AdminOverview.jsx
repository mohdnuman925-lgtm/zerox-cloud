import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  ShoppingBag,
  Server,
  LifeBuoy,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';

export const AdminOverview = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/admin/metrics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMetrics(data.metrics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchMetrics();
  }, [token]);

  if (loading || !metrics) {
    return (
      <div className="py-20 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-[#C5F36A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading real database metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
          SUPER ADMIN CONTROL CENTER
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-0.5">
          Platform Overview
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Real-time metrics calculated directly from active database records.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Customers */}
        <div className="p-6 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              Registered Customers
            </span>
            <Users className="w-4 h-4 text-[#C5F36A]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {metrics.totalCustomers}
          </div>
          <p className="text-[11px] text-neutral-500">
            {metrics.activeCustomers} accounts active
          </p>
        </div>

        {/* Total Revenue */}
        <div className="p-6 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              Total Revenue
            </span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            ₹{metrics.revenue.INR.toFixed(2)}
          </div>
          <p className="text-[11px] text-neutral-500">
            + ${metrics.revenue.USD.toFixed(2)} USD international
          </p>
        </div>

        {/* Active Servers */}
        <div className="p-6 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              Active Servers
            </span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {metrics.activeServices}
          </div>
          <p className="text-[11px] text-neutral-500">
            {metrics.failedJobs} failed provisioning jobs
          </p>
        </div>

        {/* Open Support Tickets */}
        <div className="p-6 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              Support Desk
            </span>
            <LifeBuoy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {metrics.openTickets}
          </div>
          <p className="text-[11px] text-neutral-500">
            Awaiting staff response
          </p>
        </div>
      </div>

      {/* Orders & System Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#121814] border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#C5F36A]" />
            Order Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Total Orders</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                {metrics.totalOrders}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Pending Orders</span>
              <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                {metrics.pendingOrders}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#121814] border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Infrastructure Gateway
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span>Pterodactyl Panel API</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-[#C5F36A]">
                Adapter Ready (Sandbox/Live)
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span>Razorpay Payments Gateway</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-emerald-400">
                Webhook Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

