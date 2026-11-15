import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Server,
  Key,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Calendar,
  Clock,
  Copy,
  Check,
  CreditCard,
  HardDrive,
  Cpu,
  Layers,
  Terminal,
  AlertCircle
} from 'lucide-react';

export const ClientServers = () => {
  const { token, user } = useAuth();
  const { onOpenPanelModal } = useOutletContext();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchServices();
  }, [token]);

  const handleCopyAddress = (id, address) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getRepaymentInfo = (renewalDateStr) => {
    if (!renewalDateStr) return { dateStr: 'Monthly', daysRemaining: null, isOverdue: false, isDueSoon: false };
    const renewalDate = new Date(renewalDateStr);
    const now = new Date();
    const diffTime = renewalDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      dateStr: renewalDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      daysRemaining: diffDays,
      isOverdue: diffDays < 0,
      isDueSoon: diffDays <= 5 && diffDays >= 0
    };
  };

  const filtered = services.filter((s) =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.node || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.ip_address || '').includes(search) ||
    (s.game || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.status || '').toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = services.filter((s) => s.status === 'active').length;
  const suspendedCount = services.filter((s) => s.status === 'suspended').length;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            MY SERVICES &amp; SUBSCRIPTIONS
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-0.5">
            Your services
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {activeCount} active • {suspendedCount} suspended • Server power &amp; console are managed in the Game Panel
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPanelModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition"
          >
            <Key className="w-3.5 h-3.5 text-[#C5F36A]" />
            Panel Password
          </button>
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-[#C5F36A] transition shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New server
          </button>
        </div>
      </div>

      {/* Pterodactyl Panel Information Banner */}
      <div className="p-4 rounded-2xl  backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 text-[#C5F36A] shrink-0">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-neutral-300">
              <span className="font-bold text-white">External Game Panel:</span> Server power actions (Start / Stop / Restart), live console logs, and file management are handled in Pterodactyl.
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Log in at <span className="text-white font-mono">panel.zeroxcloud.site</span> using your account email and website password.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://panel.zeroxcloud.site"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-[#C5F36A] transition flex items-center gap-1.5 shadow"
          >
            Open Game Panel
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Search & Refresh bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by server name, game, IP or node..."
            className="w-full  backdrop-blur-2xl rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>
        <button
          onClick={fetchServices}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Services List / Empty State */}
      {filtered.length === 0 ? (
        <div className="py-20 rounded-3xl  backdrop-blur-2xl text-center flex flex-col items-center justify-center p-8 space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-500">
            <Server className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No active services found</h3>
          <p className="text-xs text-neutral-400 max-w-sm">
            You do not have any active servers or subscriptions assigned to this account.
          </p>
          <button
            onClick={() => navigate('/games')}
            className="mt-2 px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition"
          >
            Explore Game Hosting Plans
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filtered.map((srv) => {
            const repayment = getRepaymentInfo(srv.renewal_date);
            const connectionAddress = `${srv.ip_address || '103.174.102.45'}:${srv.port || 25565}`;

            return (
              <div
                key={srv.id}
                className="p-6 rounded-3xl  backdrop-blur-2xl transition space-y-5 shadow-xl"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 -b pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#C5F36A] flex-shrink-0">
                      <Server className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-white">{srv.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            srv.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400  '
                              : 'bg-red-500/20 text-red-400  '
                          }`}
                        >
                          {srv.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                        {srv.game || srv.category} • ID: {srv.service_id}
                      </p>
                    </div>
                  </div>

                  {/* Panel Link Button */}
                  <a
                    href="https://panel.zeroxcloud.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition"
                  >
                    Open in Game Panel
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                </div>

                {/* Details Grid (What they have & Repayment Date) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Item 1: Connection IP & Port */}
                  <div className="p-4 rounded-2xl bg-black/40 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                        SERVER ADDRESS (IP:PORT)
                      </span>
                      <p className="font-mono text-sm font-bold text-white mt-1 break-all">
                        {connectionAddress}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyAddress(srv.id, connectionAddress)}
                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 hover:text-white transition w-fit"
                    >
                      {copiedId === srv.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied to clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy connection address</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Item 2: Node & Location */}
                  <div className="p-4 rounded-2xl bg-black/40 space-y-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                        DATACENTER NODE
                      </span>
                      <p className="font-mono text-xs font-bold text-white mt-1">
                        {srv.node || 'delhi-node-01.zeroxcloud.com'}
                      </p>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Tier-3 Sub-15ms Low Latency Edge
                    </p>
                  </div>

                  {/* Item 3: Hardware Allocation (What they have) */}
                  <div className="p-4 rounded-2xl bg-black/40 space-y-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                        HARDWARE RESOURCES
                      </span>
                      <p className="text-xs font-bold text-white mt-1">
                        {srv.ram_max || 4} GB RAM • {srv.disk_max || 30} GB NVMe
                      </p>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Dedicated high-frequency compute cores
                    </p>
                  </div>

                  {/* Item 4: Repayment Date & Status */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] space-y-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5F36A] block font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        REPAYMENT / RENEWAL DATE
                      </span>
                      <p className="font-mono text-sm font-extrabold text-white mt-1">
                        {repayment.dateStr}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      {repayment.daysRemaining !== null && (
                        <span className={`font-mono font-bold ${repayment.isOverdue ? 'text-red-400' : 'text-neutral-400'}`}>
                          {repayment.isOverdue
                            ? 'Overdue'
                            : repayment.daysRemaining === 0
                            ? 'Due today'
                            : `${repayment.daysRemaining} days left`}
                        </span>
                      )}
                      <Link
                        to="/client/billing"
                        className="text-white hover:text-[#C5F36A] underline font-medium transition"
                      >
                        Billing history →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Helper Bar */}
                <div className="pt-3 -t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-neutral-400">
                  <p>
                    <span>Server control &amp; terminal:</span> Use the <a href="https://panel.zeroxcloud.site" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-[#C5F36A]">Pterodactyl Panel</a> to start, stop, restart, upload mods, and view console logs.
                  </p>
                  <Link
                    to="/client/support"
                    className="hover:text-white transition underline"
                  >
                    Need assistance? Open ticket
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
