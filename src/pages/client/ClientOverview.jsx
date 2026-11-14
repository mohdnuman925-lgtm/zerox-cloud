import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Server,
  LifeBuoy,
  CreditCard,
  Key,
  Plus,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

export const ClientOverview = () => {
  const { user, token } = useAuth();
  const { onOpenPanelModal } = useOutletContext();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [srvRes, tktRes, invRes] = await Promise.all([
          fetch('/api/services', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/tickets', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/billing/invoices', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const srvData = await srvRes.json();
        const tktData = await tktRes.json();
        const invData = await invRes.json();

        setServices(srvData.services || []);
        setTickets(tktData.tickets || []);
        setInvoices(invData.invoices || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const activeServersCount = services.filter((s) => s.status === 'active').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;
  const totalSpent = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Customer';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-0.5">
            Welcome back, {firstName}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPanelModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition border border-white/10"
          >
            <Key className="w-3.5 h-3.5 text-[#C5F36A]" />
            Panel Password
          </button>
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-[#C5F36A] transition shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New server
          </button>
        </div>
      </div>

      {/* 3 Metric Cards matching video frame 042 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Active Servers */}
        <div
          onClick={() => navigate('/client/servers')}
          className="p-6 rounded-3xl bg-[#121814]/90 border border-white/10 hover:border-[#C5F36A]/40 transition duration-200 cursor-pointer group shadow-xl flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:text-[#C5F36A] group-hover:border-[#C5F36A]/30 transition">
              <Server className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
          </div>

          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {activeServersCount}
            </div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mt-1">
              Active Servers
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {activeServersCount > 0 ? `${activeServersCount} instances running` : 'Services online now'}
            </p>
          </div>
        </div>

        {/* Card 2: Open Tickets */}
        <div
          onClick={() => navigate('/client/support')}
          className="p-6 rounded-3xl bg-[#121814]/90 border border-white/10 hover:border-[#C5F36A]/40 transition duration-200 cursor-pointer group shadow-xl flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:text-[#C5F36A] group-hover:border-[#C5F36A]/30 transition">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
          </div>

          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {openTicketsCount}
            </div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mt-1">
              Open Tickets
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {openTicketsCount > 0 ? `${openTicketsCount} waiting response` : 'Nothing pending'}
            </p>
          </div>
        </div>

        {/* Card 3: Total Spent */}
        <div
          onClick={() => navigate('/client/billing')}
          className="p-6 rounded-3xl bg-[#121814]/90 border border-white/10 hover:border-[#C5F36A]/40 transition duration-200 cursor-pointer group shadow-xl flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:text-[#C5F36A] group-hover:border-[#C5F36A]/30 transition">
              <CreditCard className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
          </div>

          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              ₹{totalSpent.toFixed(2)}
            </div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mt-1">
              Total Spent
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              No renewal scheduled
            </p>
          </div>
        </div>
      </div>

      {/* 4 Quick Action Cards matching video frame 042 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/client/servers')}
          className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer flex items-start gap-4 group"
        >
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 group-hover:text-[#C5F36A] transition">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#C5F36A] transition">
              Manage servers
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
              Open the panel, renew or review your services.
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate('/client/billing')}
          className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer flex items-start gap-4 group"
        >
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 group-hover:text-[#C5F36A] transition">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#C5F36A] transition">
              Invoices &amp; billing
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
              Download invoices and track payment history.
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate('/client/support')}
          className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer flex items-start gap-4 group"
        >
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 group-hover:text-[#C5F36A] transition">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#C5F36A] transition">
              Get support
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
              Open a ticket and our team will help you out.
            </p>
          </div>
        </div>

        <div
          onClick={onOpenPanelModal}
          className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer flex items-start gap-4 group"
        >
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 group-hover:text-[#C5F36A] transition">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#C5F36A] transition">
              Panel Credentials
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
              Sync your password with portal.zeroxcloud.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

