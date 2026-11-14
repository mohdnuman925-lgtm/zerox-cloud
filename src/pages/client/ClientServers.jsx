import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Server,
  Terminal,
  RotateCw,
  Power,
  Play,
  Key,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  X
} from 'lucide-react';

export const ClientServers = () => {
  const { token, user } = useAuth();
  const { onOpenPanelModal } = useOutletContext();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [consoleModal, setConsoleModal] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchServices();
  }, [token]);

  const handlePowerAction = async (serviceId, signal) => {
    setActionLoading(serviceId);
    try {
      const res = await fetch(`/api/services/${serviceId}/power`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ signal })
      });
      if (res.ok) {
        await fetchServices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenConsole = async (service) => {
    setConsoleModal(service);
    try {
      const res = await fetch(`/api/services/${service.id}/console`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setConsoleLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.node.toLowerCase().includes(search.toLowerCase()) ||
    s.status.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = services.filter((s) => s.status === 'active').length;
  const suspendedCount = services.filter((s) => s.status === 'suspended').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            SERVERS
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-0.5">
            Your services
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {activeCount} active • {suspendedCount} suspended
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPanelModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition border border-white/10"
          >
            <Key className="w-3.5 h-3.5 text-[#C5F36A]" />
            Panel Access &amp; Password
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

      {/* Pterodactyl Panel integration banner matching video frame 044 */}
      <div className="p-4 rounded-2xl bg-[#121814] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#C5F36A]">
            <Terminal className="w-4 h-4" />
          </div>
          <p className="text-xs text-neutral-300">
            <span className="font-bold text-white">Pterodactyl Panel (portal.zeroxcloud.com):</span> Log in with your ZEROX CLOUD email and your website password.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPanelModal}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-[#C5F36A]" />
            Sync / Change Password
          </button>
          <a
            href="https://portal.zeroxcloud.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-[#C5F36A] transition flex items-center gap-1.5"
          >
            Open Panel
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
            placeholder="Search by plan, node or status..."
            className="w-full bg-[#121814] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A]"
          />
        </div>
        <button
          onClick={fetchServices}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white border border-white/10 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Services List / Empty State */}
      {filtered.length === 0 ? (
        <div className="py-20 rounded-3xl bg-[#121814]/70 border border-white/10 text-center flex flex-col items-center justify-center p-8 space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-500">
            <Server className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No services yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm">
            Deploy your first server in under a minute with instant automated provisioning.
          </p>
          <button
            onClick={() => navigate('/games')}
            className="mt-2 px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition"
          >
            Browse plans
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((srv) => (
            <div
              key={srv.id}
              className="p-6 rounded-3xl bg-[#121814] border border-white/10 hover:border-white/20 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C5F36A] flex-shrink-0">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{srv.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        srv.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {srv.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 mt-1">
                    {srv.ip_address}:{srv.port} • {srv.game || srv.category}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Node: {srv.node} • Renewal: {new Date(srv.renewal_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Resource Dials */}
              <div className="flex items-center gap-4 text-center">
                <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block">CPU</span>
                  <span className="text-xs font-mono font-bold text-[#C5F36A]">{srv.cpu_usage || 0}%</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block">RAM</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {srv.ram_usage || 0} / {srv.ram_max || 4} GB
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block">DISK</span>
                  <span className="text-xs font-mono font-bold text-neutral-300">
                    {srv.disk_usage || 0} / {srv.disk_max || 30} GB
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <button
                  onClick={() => handleOpenConsole(srv)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition border border-white/10"
                >
                  <Terminal className="w-3.5 h-3.5 text-[#C5F36A]" />
                  Console
                </button>

                {srv.status === 'active' ? (
                  <button
                    onClick={() => handlePowerAction(srv.id, 'stop')}
                    disabled={actionLoading === srv.id}
                    className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition border border-red-500/30"
                    title="Stop server"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handlePowerAction(srv.id, 'start')}
                    disabled={actionLoading === srv.id}
                    className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition border border-emerald-500/30"
                    title="Start server"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handlePowerAction(srv.id, 'restart')}
                  disabled={actionLoading === srv.id}
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition border border-white/10"
                  title="Restart server"
                >
                  <RotateCw className={`w-4 h-4 ${actionLoading === srv.id ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Console Logs Modal */}
      {consoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-[#101512] border border-white/15 shadow-2xl overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 bg-[#151C17] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#C5F36A]" />
                <h3 className="text-sm font-bold text-white font-mono">
                  {consoleModal.name} ({consoleModal.ip_address}:{consoleModal.port})
                </h3>
              </div>
              <button
                onClick={() => setConsoleModal(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 bg-black/80 font-mono text-xs text-neutral-300 space-y-1.5 overflow-y-auto">
              {consoleLogs.map((log, idx) => (
                <p key={idx} className="leading-relaxed">
                  {log}
                </p>
              ))}
              <p className="text-[#C5F36A] animate-pulse">&gt; Terminal interactive session connected.</p>
            </div>

            <div className="p-3 bg-[#151C17] border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                placeholder="Send server command (e.g. say Hello, op player)..."
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setConsoleLogs((prev) => [
                      ...prev,
                      `[${new Date().toLocaleTimeString()}] [Console]: > ${e.target.value}`
                    ]);
                    e.target.value = '';
                  }
                }}
              />
              <button
                onClick={() => setConsoleModal(null)}
                className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

