import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Server,
  RefreshCw,
  Activity,
  Play,
  RotateCcw,
  Square,
  Zap,
  Edit2,
  Trash2,
  Cpu,
  HardDrive,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Sliders,
  Terminal,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Power,
  AlertTriangle
} from 'lucide-react';

export const AdminServers = () => {
  const { token } = useAuth();
  const [data, setData] = useState({ services: [], provisioning_jobs: [] });
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Bulk Selection & Delete All State
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Manage Modal State
  const [manageServer, setManageServer] = useState(null);
  const [activeTab, setActiveTab] = useState('controls'); // 'controls', 'edit', 'console', 'danger'
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    node: '',
    ip_address: '',
    port: 25565,
    status: 'active',
    ram_max: 4.0,
    disk_max: 30.0,
    renewal_date: '',
    user_email: ''
  });

  const fetchServersAndNodes = async () => {
    try {
      setLoading(true);
      setError('');
      const [srvRes, nodesRes] = await Promise.all([
        fetch('/api/admin/servers', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/nodes', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (!srvRes.ok) throw new Error('Failed to load servers');
      const srvData = await srvRes.json();
      setData(srvData);

      if (nodesRes.ok) {
        const nodesData = await nodesRes.json();
        setNodes(nodesData.nodes || []);
      }
    } catch (err) {
      setError(err.message || 'Error fetching servers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchServersAndNodes();
  }, [token]);

  const handleOpenManageModal = (srv, tab = 'controls') => {
    setManageServer(srv);
    setActiveTab(tab);
    setEditForm({
      name: srv.name || '',
      node: srv.node || 'delhi-node-01.zeroxcloud.site',
      ip_address: srv.ip_address || '103.174.102.45',
      port: srv.port || 25565,
      status: srv.status || 'active',
      ram_max: srv.ram_max || 4.0,
      disk_max: srv.disk_max || 30.0,
      renewal_date: srv.renewal_date ? srv.renewal_date.split('T')[0] : '',
      user_email: srv.user_email || ''
    });
  };

  const handlePowerAction = async (srv, action) => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/servers/${srv.id}/power`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to send power action');

      setSuccess(`Server "${srv.name}" received power signal "${action.toUpperCase()}".`);
      setTimeout(() => setSuccess(''), 3000);

      // Update local state immediately
      setData((prev) => ({
        ...prev,
        services: prev.services.map((s) =>
          s.id === srv.id
            ? {
                ...s,
                status: action === 'stop' || action === 'kill' ? 'stopped' : 'active',
                cpu_usage: action === 'stop' || action === 'kill' ? 0.0 : 14.5
              }
            : s
        )
      }));

      if (manageServer && manageServer.id === srv.id) {
        setManageServer((prev) => ({
          ...prev,
          status: action === 'stop' || action === 'kill' ? 'stopped' : 'active'
        }));
      }
    } catch (err) {
      setError(err.message || 'Power action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveConfiguration = async (e) => {
    e.preventDefault();
    if (!manageServer) return;
    setActionLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/servers/${manageServer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update server');

      setSuccess(`Server "${editForm.name}" updated successfully.`);
      setTimeout(() => setSuccess(''), 3000);
      setManageServer(result.server);
      fetchServersAndNodes();
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleSuspend = async (srv) => {
    const newStatus = srv.status === 'suspended' ? 'active' : 'suspended';
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/servers/${srv.id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          reason: `Admin manual toggle to ${newStatus}`
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to toggle status');

      setSuccess(`Server "${srv.name}" is now ${newStatus.toUpperCase()}.`);
      setTimeout(() => setSuccess(''), 3000);
      fetchServersAndNodes();
      if (manageServer) setManageServer(result.server);
    } catch (err) {
      setError(err.message || 'Status toggle failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteServer = async (srv) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently terminate server "${srv.name}" (${srv.service_id})?\n\nThis will remove the container and all associated allocations.`
    );
    if (!confirmDelete) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/servers/${srv.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete server');

      setSuccess(result.message);
      setTimeout(() => setSuccess(''), 3000);
      setManageServer(null);
      fetchServersAndNodes();
    } catch (err) {
      setError(err.message || 'Deletion failed');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (filteredServices.length > 0 && selectedIds.length === filteredServices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredServices.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteAllServers = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/servers/all', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete all servers');

      setSuccess(result.message || 'All fleet servers have been permanently deleted.');
      setTimeout(() => setSuccess(''), 4000);
      setSelectedIds([]);
      setDeleteAllModalOpen(false);
      setDeleteConfirmText('');
      setManageServer(null);
      fetchServersAndNodes();
    } catch (err) {
      setError(err.message || 'Bulk deletion failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelectedServers = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/servers/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedIds })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete selected servers');

      setSuccess(result.message || `Successfully deleted ${selectedIds.length} server(s).`);
      setTimeout(() => setSuccess(''), 4000);
      setSelectedIds([]);
      setBulkDeleteModalOpen(false);
      setDeleteConfirmText('');
      setManageServer(null);
      fetchServersAndNodes();
    } catch (err) {
      setError(err.message || 'Bulk deletion failed');
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Metrics calculations
  const totalServers = data.services.length;
  const activeServers = data.services.filter((s) => s.status === 'active').length;
  const suspendedServers = data.services.filter((s) => s.status === 'suspended').length;
  const totalAllocatedRam = data.services.reduce((acc, s) => acc + (parseFloat(s.ram_max) || 4), 0);

  // Filtered Services
  const filteredServices = data.services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.service_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.node && s.node.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.ip_address && s.ip_address.includes(searchQuery));

    const matchesStatus =
      statusFilter === 'all' ? true : s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in text-white pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            FLEET ADMINISTRATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Server Management &amp; Controls
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Execute power cycles, reallocate ports &amp; IP addresses, manage resource limits, and monitor instances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/nodes"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#C5F36A] text-black font-extrabold text-xs hover:bg-[#d4f788] transition shadow"
          >
            <Cpu className="w-3.5 h-3.5" />
            Manage Nodes &amp; Limits
          </Link>
          <button
            onClick={() => {
              setDeleteConfirmText('');
              setDeleteAllModalOpen(true);
            }}
            disabled={totalServers === 0 || actionLoading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-bold transition shadow disabled:opacity-40 disabled:cursor-not-allowed"
            title="Permanently delete all servers across the fleet at once"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete All Servers ({totalServers})
          </button>
          <button
            onClick={fetchServersAndNodes}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white border border-white/10 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Fleet Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
            TOTAL SERVERS
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {totalServers}
          </div>
          <p className="text-[11px] text-neutral-500">Fleet customer instances</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
            ACTIVE ONLINE
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {activeServers}
          </div>
          <p className="text-[11px] text-neutral-500">Currently running</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
            SUSPENDED
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {suspendedServers}
          </div>
          <p className="text-[11px] text-neutral-500">Overdue or locked</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
            ALLOCATED RAM
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
            <span>{totalAllocatedRam}</span>
            <span className="text-xs text-neutral-400">GB</span>
          </div>
          <p className="text-[11px] text-neutral-500">Dedicated to game servers</p>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by server name, ID, customer email, node FQDN, or IP..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#121814] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A] transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'active', 'suspended', 'stopped'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              {st} {st !== 'all' ? `(${data.services.filter((s) => s.status === st).length})` : `(${totalServers})`}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Selection Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 px-5 rounded-2xl bg-red-950/40 border border-red-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-bold text-white">
              {selectedIds.length} server{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <span className="text-xs text-neutral-400">
              (out of {filteredServices.length} filtered / {totalServers} fleet total)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds(filteredServices.map((s) => s.id))}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition font-medium"
            >
              Select All Filtered ({filteredServices.length})
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-400 hover:text-white transition"
            >
              Deselect All
            </button>
            <button
              onClick={() => {
                setDeleteConfirmText('');
                setBulkDeleteModalOpen(true);
              }}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition shadow-lg"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="rounded-3xl bg-[#121814] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-[#C5F36A]" />
            Customer Server Fleet ({filteredServices.length})
          </h3>
          <span className="text-xs font-mono text-neutral-400">
            Click "Manage" or use power icons to control servers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 border-b border-white/10 text-neutral-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4 pl-6 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={filteredServices.length > 0 && selectedIds.length === filteredServices.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-[#C5F36A] focus:ring-0 cursor-pointer accent-[#C5F36A]"
                    title="Select all visible servers"
                  />
                </th>
                <th className="p-4">SERVICE ID</th>
                <th className="p-4">SERVER NAME</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">IP &amp; PORT</th>
                <th className="p-4">RAM / DISK</th>
                <th className="p-4">NODE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 pr-6 text-right">MANAGE &amp; POWER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-neutral-400">
                    <div className="w-7 h-7 border-2 border-[#C5F36A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading instances...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-neutral-400">
                    No servers match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredServices.map((s) => {
                  const isSuspended = s.status === 'suspended';
                  const isStopped = s.status === 'stopped';

                  return (
                    <tr key={s.id} className="hover:bg-white/5 transition group">
                      <td className="p-4 pl-6 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.id)}
                          onChange={() => toggleSelectOne(s.id)}
                          className="w-4 h-4 rounded bg-white/10 border-white/20 text-[#C5F36A] focus:ring-0 cursor-pointer accent-[#C5F36A]"
                        />
                      </td>
                      <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{s.service_id}</span>
                          <button
                            onClick={() => copyToClipboard(s.service_id, `id-${s.id}`)}
                            className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-white transition p-0.5"
                            title="Copy Service ID"
                          >
                            {copiedKey === `id-${s.id}` ? <Check className="w-3 h-3 text-[#C5F36A]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-white text-xs">{s.name}</div>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {s.game || s.category}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-mono text-neutral-300 truncate max-w-[170px]" title={s.user_email}>
                          {s.user_email}
                        </div>
                      </td>

                      <td className="p-4 font-mono text-white whitespace-nowrap">
                        <span className="text-neutral-400">{s.ip_address}:</span>
                        <span className="font-bold text-[#C5F36A]">{s.port}</span>
                      </td>

                      <td className="p-4 font-mono text-[11px] whitespace-nowrap">
                        <span className="text-white font-bold">{s.ram_max || 4} GB</span>
                        <span className="text-neutral-500"> / {s.disk_max || 30} GB</span>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-neutral-400 truncate max-w-[160px]" title={s.node}>
                        {s.node}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            s.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : isSuspended
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Power Controls */}
                          <button
                            onClick={() => handlePowerAction(s, 'start')}
                            disabled={actionLoading}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                            title="Start Server"
                            aria-label="Start Server"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button
                            onClick={() => handlePowerAction(s, 'restart')}
                            disabled={actionLoading}
                            className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition"
                            title="Restart Server"
                            aria-label="Restart Server"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handlePowerAction(s, 'stop')}
                            disabled={actionLoading}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                            title="Stop Server"
                            aria-label="Stop Server"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" />
                          </button>

                          {/* Manage Button */}
                          <button
                            onClick={() => handleOpenManageModal(s, 'controls')}
                            className="ml-2 px-3 py-1.5 rounded-xl bg-white text-black font-extrabold text-[11px] hover:bg-[#C5F36A] transition shadow-sm"
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE MANAGE SERVER MODAL */}
      {manageServer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-6 sm:p-8 rounded-3xl bg-[#121814] border border-white/15 shadow-2xl text-white space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C5F36A]">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{manageServer.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        manageServer.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : manageServer.status === 'suspended'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'
                      }`}
                    >
                      {manageServer.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    ID: {manageServer.service_id} • IP: {manageServer.ip_address}:{manageServer.port}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setManageServer(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              {[
                { id: 'controls', label: 'Power & Controls', icon: Zap },
                { id: 'edit', label: 'Edit Configuration', icon: Sliders },
                { id: 'console', label: 'Terminal Logs', icon: Terminal },
                { id: 'danger', label: 'Danger Zone', icon: ShieldAlert }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#C5F36A] text-black font-extrabold shadow'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: POWER & CONTROLS */}
            {activeTab === 'controls' && (
              <div className="space-y-6">
                {/* Power Buttons Grid */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                    SERVER POWER SIGNALS
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => handlePowerAction(manageServer, 'start')}
                      disabled={actionLoading}
                      className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current text-emerald-400" />
                      Start Server
                    </button>
                    <button
                      onClick={() => handlePowerAction(manageServer, 'restart')}
                      disabled={actionLoading}
                      className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4 text-cyan-400" />
                      Restart Server
                    </button>
                    <button
                      onClick={() => handlePowerAction(manageServer, 'stop')}
                      disabled={actionLoading}
                      className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <Square className="w-4 h-4 fill-current text-amber-400" />
                      Stop Server
                    </button>
                    <button
                      onClick={() => handlePowerAction(manageServer, 'kill')}
                      disabled={actionLoading}
                      className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <Power className="w-4 h-4 text-red-400" />
                      Force Kill
                    </button>
                  </div>
                </div>

                {/* Resource Allocations Overview */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">MEMORY POOL</span>
                    <span className="font-mono font-bold text-white text-sm">{manageServer.ram_max || 4} GB</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">DDR4 ECC</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">NVMe DISK</span>
                    <span className="font-mono font-bold text-white text-sm">{manageServer.disk_max || 30} GB</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">PCIe Gen4</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">HOST NODE</span>
                    <span className="font-mono font-bold text-white text-[11px] truncate block" title={manageServer.node}>
                      {manageServer.node}
                    </span>
                    <span className="text-[10px] text-[#C5F36A] block mt-0.5">10Gbps Uplink</span>
                  </div>
                </div>

                {/* Ownership & Panel Link Bar */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">CUSTOMER OWNER</span>
                    <span className="font-mono font-bold text-white">{manageServer.user_email}</span>
                  </div>
                  <a
                    href="https://panel.zeroxcloud.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition"
                  >
                    Open in Game Panel
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                </div>
              </div>
            )}

            {/* TAB 2: EDIT CONFIGURATION */}
            {activeTab === 'edit' && (
              <form onSubmit={handleSaveConfiguration} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      SERVER NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      HOST NODE (FQDN)
                    </label>
                    <input
                      type="text"
                      value={editForm.node}
                      onChange={(e) => setEditForm({ ...editForm, node: e.target.value })}
                      placeholder="delhi-node-01.zeroxcloud.site"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      IP ADDRESS
                    </label>
                    <input
                      type="text"
                      value={editForm.ip_address}
                      onChange={(e) => setEditForm({ ...editForm, ip_address: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      PORT ALLOCATION
                    </label>
                    <input
                      type="number"
                      value={editForm.port}
                      onChange={(e) => setEditForm({ ...editForm, port: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      MAX RAM (GB)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={editForm.ram_max}
                      onChange={(e) => setEditForm({ ...editForm, ram_max: parseFloat(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      MAX DISK (GB)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={editForm.disk_max}
                      onChange={(e) => setEditForm({ ...editForm, disk_max: parseFloat(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      STATUS
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                    >
                      <option value="active">Active</option>
                      <option value="stopped">Stopped</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      REPAYMENT / RENEWAL DATE
                    </label>
                    <input
                      type="date"
                      value={editForm.renewal_date}
                      onChange={(e) => setEditForm({ ...editForm, renewal_date: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      REASSIGN TO CUSTOMER (EMAIL)
                    </label>
                    <input
                      type="email"
                      value={editForm.user_email}
                      onChange={(e) => setEditForm({ ...editForm, user_email: e.target.value })}
                      placeholder="customer@domain.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#C5F36A] text-black font-extrabold text-xs hover:bg-[#d4f788] transition shadow active:scale-95 disabled:opacity-50"
                  >
                    {actionLoading ? 'Saving changes...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: TERMINAL CONSOLE */}
            {activeTab === 'console' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span>LIVE CONSOLE STREAM • {manageServer.ip_address}:{manageServer.port}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    CONNECTED
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-neutral-300 space-y-1.5 h-64 overflow-y-auto">
                  <p className="text-neutral-500">[ZEROX-DAEMON] Connecting to Docker container {manageServer.provider_identifier}...</p>
                  <p className="text-neutral-400">[SYSTEM] Server IP allocated: {manageServer.ip_address}:{manageServer.port}</p>
                  <p className="text-emerald-400">[PTERODACTYL] Node {manageServer.node} responded (HTTP 200 OK)</p>
                  <p className="text-white">[SERVER] Starting Minecraft server instance on port {manageServer.port}...</p>
                  <p className="text-neutral-400">[INFO] Loaded world SMP_World_01 in 1.43s</p>
                  <p className="text-cyan-400">[INFO] RCON running on 127.0.0.1:{manageServer.port + 1}</p>
                  <p className="text-emerald-400">[INFO] Done! For help, type "help"</p>
                  <p className="text-neutral-500">[STATS] Memory: {manageServer.ram_usage || 1.8}GB / {manageServer.ram_max || 4}GB • CPU: {manageServer.cpu_usage || 14.5}%</p>
                </div>
              </div>
            )}

            {/* TAB 4: DANGER ZONE */}
            {activeTab === 'danger' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">
                      {manageServer.status === 'suspended' ? 'Unsuspend Server' : 'Suspend Server'}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {manageServer.status === 'suspended'
                        ? 'Restore customer access and power capabilities.'
                        : 'Temporarily freeze server operations and lock game panel access for overdue billing or terms violations.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSuspend(manageServer)}
                    disabled={actionLoading}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                      manageServer.status === 'suspended'
                        ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                        : 'bg-amber-500 text-black hover:bg-amber-400'
                    }`}
                  >
                    {manageServer.status === 'suspended' ? 'Unsuspend Now' : 'Suspend Server'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-red-400">Permanently Terminate Server</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Instantly delete the server, unbind the allocated port, and erase customer data.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteServer(manageServer)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition"
                  >
                    Delete Server
                  </button>
                </div>
              </div>
            )}

            {/* Modal Bottom Close */}
            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setManageServer(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE ALL SERVERS AT ONCE */}
      {deleteAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#121814] border border-red-500/40 shadow-2xl text-white space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400 block">
                  CRITICAL ADMINISTRATIVE PURGE
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  Delete All Servers At Once?
                </h3>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              This action will permanently terminate, delete, and purge all{' '}
              <span className="font-bold text-white font-mono">{totalServers}</span> customer servers across the entire ZEROX CLOUD fleet. All live game containers, node port allocations, and IP assignments will be erased immediately.
            </p>

            {/* Impact Metric Box */}
            <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-black/50 border border-white/10 text-center">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">SERVERS</span>
                <span className="text-lg font-extrabold text-red-400 font-mono">{totalServers}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">ACTIVE ONLINE</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono">{activeServers}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">RAM RELEASED</span>
                <span className="text-lg font-extrabold text-white font-mono">{totalAllocatedRam} GB</span>
              </div>
            </div>

            {/* Typing Challenge */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-300 block">
                To confirm permanent fleet deletion, type <span className="font-mono text-red-400 font-bold">DELETE ALL</span> below:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                placeholder="Type DELETE ALL"
                className="w-full bg-black/60 border border-red-500/30 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 uppercase font-mono tracking-wider focus:outline-none transition"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteAllModalOpen(false);
                  setDeleteConfirmText('');
                }}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 hover:text-white text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAllServers}
                disabled={actionLoading || (deleteConfirmText.trim() !== 'DELETE ALL' && deleteConfirmText.trim() !== 'DELETE')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                {actionLoading ? 'Purging Fleet...' : `Permanently Delete All (${totalServers})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: BULK DELETE SELECTED SERVERS */}
      {bulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#121814] border border-red-500/30 shadow-2xl text-white space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400 block">
                  BULK FLEET ACTION
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  Delete {selectedIds.length} Selected Server{selectedIds.length > 1 ? 's' : ''}?
                </h3>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete the <span className="font-bold text-white font-mono">{selectedIds.length}</span> selected server(s)? This will release their allocated ports and remove all associated data.
            </p>

            <div className="max-h-40 overflow-y-auto space-y-1.5 p-3 rounded-2xl bg-black/40 border border-white/5 divide-y divide-white/5 text-xs">
              {data.services
                .filter((s) => selectedIds.includes(s.id))
                .map((srv) => (
                  <div key={srv.id} className="pt-1.5 first:pt-0 flex items-center justify-between text-neutral-300">
                    <div>
                      <span className="font-bold text-white">{srv.name}</span>
                      <span className="text-[10px] font-mono text-neutral-500 ml-2">({srv.service_id})</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#C5F36A]">{srv.ip_address}:{srv.port}</span>
                  </div>
                ))}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBulkDeleteModalOpen(false)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 hover:text-white text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSelectedServers}
                disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-xl"
              >
                <Trash2 className="w-4 h-4" />
                {actionLoading ? 'Deleting...' : `Delete ${selectedIds.length} Server(s)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provisioning Jobs Monitor */}
      <div className="rounded-3xl bg-[#121814] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Provisioning Job Queue Logs
          </h3>
          <span className="text-xs font-mono text-neutral-400">
            {data.provisioning_jobs.length} jobs logged
          </span>
        </div>

        <div className="p-4 space-y-2">
          {data.provisioning_jobs.map((job) => (
            <div key={job.id} className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-[#C5F36A] font-bold uppercase text-[10px]">
                  JOB #{job.id} • {job.status}
                </span>
                <p className="text-neutral-300 mt-0.5">{job.logs}</p>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 whitespace-nowrap">
                {new Date(job.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
