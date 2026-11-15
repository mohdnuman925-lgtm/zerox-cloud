import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Cpu,
  Server,
  HardDrive,
  Activity,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Power,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Layers,
  MapPin,
  Globe,
  Sliders,
  X
} from 'lucide-react';

export const AdminNodes = () => {
  const { token } = useAuth();
  const [nodes, setNodes] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // View Servers Modal State
  const [serversModalNode, setServersModalNode] = useState(null);
  const [nodeServers, setNodeServers] = useState([]);
  const [serversLoading, setServersLoading] = useState(false);

  // Copied indicator
  const [copiedKey, setCopiedKey] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    fqdn: '',
    ip_address: '',
    location: 'Noida, India',
    country_code: 'IN',
    daemon_port: 8080,
    daemon_sftp: 2022,
    scheme: 'https',
    status: 'online',
    maintenance_mode: false,
    memory_limit_mb: 65536,
    memory_overcommit_pct: 0,
    disk_limit_mb: 1048576,
    disk_overcommit_pct: 10,
    cpu_cores: 32,
    port_range_start: 25565,
    port_range_end: 25999,
    max_servers: 50,
    description: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/admin/nodes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load nodes data');
      const data = await res.json();
      setNodes(data.nodes || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError(err.message || 'Error fetching nodes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchNodes();
  }, [token]);

  const handleOpenCreateModal = () => {
    setEditingNode(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEditModal = (node) => {
    setEditingNode(node);
    setFormData({
      name: node.name || '',
      fqdn: node.fqdn || '',
      ip_address: node.ip_address || '',
      location: node.location || 'India',
      country_code: node.country_code || 'IN',
      daemon_port: node.daemon_port || 8080,
      daemon_sftp: node.daemon_sftp || 2022,
      scheme: node.scheme || 'https',
      status: node.status || 'online',
      maintenance_mode: Boolean(node.maintenance_mode),
      memory_limit_mb: node.memory_limit_mb || 65536,
      memory_overcommit_pct: node.memory_overcommit_pct || 0,
      disk_limit_mb: node.disk_limit_mb || 1048576,
      disk_overcommit_pct: node.disk_overcommit_pct || 0,
      cpu_cores: node.cpu_cores || 32,
      port_range_start: node.port_range_start || 25565,
      port_range_end: node.port_range_end || 25999,
      max_servers: node.max_servers || 50,
      description: node.description || ''
    });
    setModalOpen(true);
  };

  const handleSaveNode = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError('');

    try {
      const url = editingNode ? `/api/admin/nodes/${editingNode.id}` : '/api/admin/nodes';
      const method = editingNode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save node');

      setSuccess(editingNode ? `Node "${formData.name}" updated successfully.` : `New node "${formData.name}" deployed successfully.`);
      setTimeout(() => setSuccess(''), 4000);
      setModalOpen(false);
      fetchNodes();
    } catch (err) {
      setError(err.message || 'Error saving node');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleMaintenance = async (node) => {
    try {
      const res = await fetch(`/api/admin/nodes/${node.id}/maintenance`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to toggle maintenance');

      setSuccess(`Maintenance mode ${result.node.maintenance_mode ? 'ENABLED' : 'DISABLED'} for ${node.name}.`);
      setTimeout(() => setSuccess(''), 3000);
      fetchNodes();
    } catch (err) {
      setError(err.message || 'Error updating maintenance mode');
    }
  };

  const handleDeleteNode = async (node) => {
    const confirmMsg = `Are you sure you want to permanently delete node "${node.name}" (${node.fqdn})?\n\nThis action cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/nodes/${node.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok) {
        if (result.error.includes('active customer servers')) {
          const forceConfirm = window.confirm(`${result.error}\n\nDo you want to FORCE delete this node anyway?`);
          if (forceConfirm) {
            const forceRes = await fetch(`/api/admin/nodes/${node.id}?force=true`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });
            const forceResult = await forceRes.json();
            if (!forceRes.ok) throw new Error(forceResult.error || 'Failed force delete');
            setSuccess(forceResult.message);
            fetchNodes();
            return;
          }
        }
        throw new Error(result.error || 'Failed to delete node');
      }

      setSuccess(result.message);
      setTimeout(() => setSuccess(''), 4000);
      fetchNodes();
    } catch (err) {
      setError(err.message || 'Error deleting node');
    }
  };

  const handleViewServers = async (node) => {
    setServersModalNode(node);
    setServersLoading(true);
    setNodeServers([]);

    try {
      const res = await fetch(`/api/admin/nodes/${node.id}/servers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setNodeServers(data.servers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setServersLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredNodes = nodes.filter((n) => {
    const matchesSearch =
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.fqdn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.ip_address.includes(searchQuery) ||
      (n.location && n.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'maintenance'
        ? n.maintenance_mode || n.status === 'maintenance'
        : n.status === statusFilter && !n.maintenance_mode;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in text-white pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            INFRASTRUCTURE CONTROL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Nodes &amp; Wings Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Deploy, monitor, edit IP addresses, and configure RAM / Disk / Port limits for your Pterodactyl daemon fleet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchNodes}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 hover:text-white border border-white/10 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5F36A] text-black font-extrabold text-xs hover:bg-[#d4f788] transition shadow-lg shadow-[#C5F36A]/10 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Deploy New Node
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

      {/* Fleet Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              TOTAL FLEET NODES
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline gap-2">
              {summary.total_nodes}
              <span className="text-xs font-sans font-bold text-emerald-400">
                {summary.online_nodes} Online
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              {summary.maintenance_nodes > 0 ? `${summary.maintenance_nodes} in maintenance` : 'All wings operating normally'}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              FLEET RAM ALLOCATION
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
              <span>{summary.allocated_memory_gb}</span>
              <span className="text-xs text-neutral-400">/ {summary.total_memory_gb} GB</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
              <div
                className="h-full bg-[#C5F36A] rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((summary.allocated_memory_gb / Math.max(1, summary.total_memory_gb)) * 100))}%`
                }}
              />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              NVMe STORAGE POOL
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
              <span>{summary.allocated_disk_tb}</span>
              <span className="text-xs text-neutral-400">/ {summary.total_disk_tb} TB</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((summary.allocated_disk_tb / Math.max(0.1, summary.total_disk_tb)) * 100))}%`
                }}
              />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#121814] border border-white/10 shadow-xl space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              ACTIVE INSTANCES
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {summary.total_active_instances}
            </div>
            <p className="text-[11px] text-neutral-500">Live game servers across fleet</p>
          </div>
        </div>
      )}

      {/* Controls: Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by node name, FQDN domain, IP address, or location..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#121814] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A] transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'all'
                ? 'bg-white text-black'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            All Nodes ({nodes.length})
          </button>
          <button
            onClick={() => setStatusFilter('online')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'online'
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            Online ({nodes.filter((n) => n.status === 'online' && !n.maintenance_mode).length})
          </button>
          <button
            onClick={() => setStatusFilter('maintenance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'maintenance'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            Maintenance ({nodes.filter((n) => n.status === 'maintenance' || n.maintenance_mode).length})
          </button>
        </div>
      </div>

      {/* Nodes Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-neutral-400 space-y-3">
          <div className="w-8 h-8 border-2 border-[#C5F36A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Inspecting daemon endpoints and fleet allocations...</p>
        </div>
      ) : filteredNodes.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#121814] border border-white/10 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
            <Server className="w-8 h-8 text-[#C5F36A]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              {nodes.length === 0 ? 'No Infrastructure Nodes Deployed' : 'No nodes match your filter'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              {nodes.length === 0
                ? 'Your fleet currently has zero active nodes. Connect a Pterodactyl daemon (Wings) node to begin allocating IP addresses, RAM limits, and provisioning game servers.'
                : 'Try adjusting your search query or status filter to locate nodes.'}
            </p>
          </div>
          {nodes.length === 0 && (
            <div className="pt-2">
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#C5F36A] text-black font-extrabold text-xs hover:bg-[#d4f788] transition shadow-xl shadow-[#C5F36A]/10 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Deploy Your First Node
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNodes.map((node) => {
            const memoryTotalGb = (node.memory_limit_mb / 1024).toFixed(1);
            const memoryAllocatedGb = (node.allocated_memory_mb / 1024).toFixed(1);
            const diskTotalGb = (node.disk_limit_mb / 1024).toFixed(0);
            const diskAllocatedGb = (node.allocated_disk_mb / 1024).toFixed(0);

            const isMaintenance = node.maintenance_mode || node.status === 'maintenance';

            return (
              <div
                key={node.id}
                className={`p-6 rounded-3xl bg-[#121814] border transition-all duration-200 flex flex-col justify-between shadow-xl space-y-6 ${
                  isMaintenance
                    ? 'border-amber-500/40 bg-[#161510]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Node Card Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white tracking-tight">{node.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isMaintenance
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {isMaintenance ? 'Maintenance' : 'Online'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C5F36A]" />
                        <span>{node.location || 'Unknown Location'}</span>
                        <span className="font-mono text-neutral-600">•</span>
                        <span className="font-mono text-neutral-300">{node.country_code || 'IN'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(node)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition border border-white/5"
                        title="Edit Node details and limits"
                        aria-label="Edit Node"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleMaintenance(node)}
                        className={`p-2 rounded-xl transition border ${
                          isMaintenance
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/5'
                        }`}
                        title={isMaintenance ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
                        aria-label="Toggle Maintenance"
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNode(node)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition border border-red-500/20"
                        title="Delete Node"
                        aria-label="Delete Node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* FQDN & IP Address Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block">FQDN / DOMAIN</span>
                        <span className="font-mono text-white text-[11px] font-medium">{node.fqdn}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(node.fqdn, `fqdn-${node.id}`)}
                        className="p-1 hover:text-[#C5F36A] text-neutral-500 transition"
                        title="Copy FQDN"
                      >
                        {copiedKey === `fqdn-${node.id}` ? <Check className="w-3.5 h-3.5 text-[#C5F36A]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block">PRIMARY IP ADDRESS</span>
                        <span className="font-mono text-white text-[11px] font-medium">{node.ip_address}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(node.ip_address, `ip-${node.id}`)}
                        className="p-1 hover:text-[#C5F36A] text-neutral-500 transition"
                        title="Copy IP"
                      >
                        {copiedKey === `ip-${node.id}` ? <Check className="w-3.5 h-3.5 text-[#C5F36A]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {node.description && (
                    <p className="text-[11px] text-neutral-400 italic">
                      {node.description}
                    </p>
                  )}
                </div>

                {/* Resource Limits & Usage Bars */}
                <div className="space-y-3.5 pt-2 border-t border-white/5">
                  {/* Memory Usage */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#C5F36A]" />
                        Memory Limit
                        {node.memory_overcommit_pct > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-neutral-400">
                            +{node.memory_overcommit_pct}% overcommit
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-neutral-300">
                        <span className="font-bold text-white">{memoryAllocatedGb} GB</span> / {memoryTotalGb} GB ({node.memory_usage_pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/50 border border-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          node.memory_usage_pct > 85 ? 'bg-red-500' : node.memory_usage_pct > 65 ? 'bg-amber-400' : 'bg-[#C5F36A]'
                        }`}
                        style={{ width: `${node.memory_usage_pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Disk Usage */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400 flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                        NVMe Disk Limit
                        {node.disk_overcommit_pct > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-neutral-400">
                            +{node.disk_overcommit_pct}% overcommit
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-neutral-300">
                        <span className="font-bold text-white">{diskAllocatedGb} GB</span> / {diskTotalGb} GB ({node.disk_usage_pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/50 border border-white/5 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${node.disk_usage_pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Servers & Port Allocations */}
                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">INSTANCE CAPACITY</span>
                      <div className="font-mono font-bold text-white flex items-baseline gap-1">
                        <span>{node.allocated_servers_count}</span>
                        <span className="text-neutral-500 text-xs">/ {node.max_servers} Max</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-purple-400 rounded-full"
                          style={{ width: `${node.server_usage_pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">ALLOCATION PORTS</span>
                      <div className="font-mono font-bold text-white text-[11px] truncate">
                        {node.port_range_start} - {node.port_range_end}
                      </div>
                      <span className="text-[10px] text-neutral-500 block">
                        Daemon: {node.daemon_port} • SFTP: {node.daemon_sftp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => handleViewServers(node)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#C5F36A]" />
                    View Deployed Instances ({node.allocated_servers_count})
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(node)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition"
                  >
                    Edit Limits &amp; IP
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE & EDIT NODE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-6 sm:p-8 rounded-3xl bg-[#121814] border border-white/15 shadow-2xl text-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#C5F36A]/10 border border-[#C5F36A]/20 flex items-center justify-center text-[#C5F36A]">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingNode ? `Edit Node: ${editingNode.name}` : 'Deploy New Infrastructure Node'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Configure endpoint IP, hostname, memory/disk limits, and overcommit margins.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNode} className="space-y-5">
              {/* Section 1: Basic Node Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5F36A]">
                  1. BASIC NODE INFORMATION
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      NODE NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Delhi Node 02 (Noida DC)"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      FQDN / HOSTNAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fqdn}
                      onChange={(e) => setFormData({ ...formData, fqdn: e.target.value })}
                      placeholder="e.g. delhi-node-02.zeroxcloud.site"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5F36A] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      PRIMARY IP ADDRESS *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ip_address}
                      onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                      placeholder="e.g. 103.174.102.50"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5F36A] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      LOCATION
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Noida, India"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      COUNTRY CODE
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={formData.country_code}
                      onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })}
                      placeholder="e.g. IN"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5F36A] font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Daemon & Port Settings */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  2. DAEMON (WINGS) &amp; PORTS
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      SCHEME
                    </label>
                    <select
                      value={formData.scheme}
                      onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                    >
                      <option value="https">HTTPS (SSL)</option>
                      <option value="http">HTTP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      DAEMON PORT
                    </label>
                    <input
                      type="number"
                      value={formData.daemon_port}
                      onChange={(e) => setFormData({ ...formData, daemon_port: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      SFTP PORT
                    </label>
                    <input
                      type="number"
                      value={formData.daemon_sftp}
                      onChange={(e) => setFormData({ ...formData, daemon_sftp: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      CPU CORES
                    </label>
                    <input
                      type="number"
                      value={formData.cpu_cores}
                      onChange={(e) => setFormData({ ...formData, cpu_cores: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      PORT RANGE START
                    </label>
                    <input
                      type="number"
                      value={formData.port_range_start}
                      onChange={(e) => setFormData({ ...formData, port_range_start: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      PORT RANGE END
                    </label>
                    <input
                      type="number"
                      value={formData.port_range_end}
                      onChange={(e) => setFormData({ ...formData, port_range_end: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      MAX INSTANCES
                    </label>
                    <input
                      type="number"
                      value={formData.max_servers}
                      onChange={(e) => setFormData({ ...formData, max_servers: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Resource Limits & Overcommit */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                  3. MEMORY &amp; DISK LIMITS
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                    <label className="block text-[11px] font-mono text-neutral-400">
                      TOTAL MEMORY LIMIT (MB) *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        required
                        value={formData.memory_limit_mb}
                        onChange={(e) => setFormData({ ...formData, memory_limit_mb: parseInt(e.target.value, 10) || 0 })}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                      />
                      <span className="text-xs font-mono text-neutral-400">
                        = {(formData.memory_limit_mb / 1024).toFixed(0)} GB
                      </span>
                    </div>

                    <div className="pt-2">
                      <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                        MEMORY OVERCOMMIT %
                      </label>
                      <input
                        type="number"
                        value={formData.memory_overcommit_pct}
                        onChange={(e) => setFormData({ ...formData, memory_overcommit_pct: parseInt(e.target.value, 10) || 0 })}
                        placeholder="0"
                        className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                    <label className="block text-[11px] font-mono text-neutral-400">
                      TOTAL DISK LIMIT (MB) *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        required
                        value={formData.disk_limit_mb}
                        onChange={(e) => setFormData({ ...formData, disk_limit_mb: parseInt(e.target.value, 10) || 0 })}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                      />
                      <span className="text-xs font-mono text-neutral-400">
                        = {(formData.disk_limit_mb / 1024).toFixed(0)} GB
                      </span>
                    </div>

                    <div className="pt-2">
                      <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                        DISK OVERCOMMIT %
                      </label>
                      <input
                        type="number"
                        value={formData.disk_overcommit_pct}
                        onChange={(e) => setFormData({ ...formData, disk_overcommit_pct: parseInt(e.target.value, 10) || 0 })}
                        placeholder="0"
                        className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#C5F36A]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Maintenance & Notes */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/30 border border-white/5">
                  <input
                    type="checkbox"
                    id="maintenance_mode"
                    checked={formData.maintenance_mode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maintenance_mode: e.target.checked,
                        status: e.target.checked ? 'maintenance' : 'online'
                      })
                    }
                    className="w-4 h-4 rounded text-[#C5F36A] focus:ring-0 bg-black/50 border-white/20"
                  />
                  <label htmlFor="maintenance_mode" className="text-xs text-neutral-300 cursor-pointer">
                    <span className="font-bold text-white block">Under Maintenance</span>
                    Prevent new game instances from provisioning onto this node during updates.
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    HARDWARE SPECIFICATION NOTES
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. AMD EPYC 7C13 64-Core, 3.2 Tbps Anti-DDoS, 10Gbps Uplink"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#C5F36A] text-black font-extrabold text-xs hover:bg-[#d4f788] transition shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving Node...' : editingNode ? 'Update Node Configuration' : 'Deploy Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DEPLOYED INSTANCES MODAL */}
      {serversModalNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col p-6 rounded-3xl bg-[#121814] border border-white/15 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C5F36A]" />
                  Active Instances on {serversModalNode.name}
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  FQDN: {serversModalNode.fqdn} • IP: {serversModalNode.ip_address}
                </p>
              </div>
              <button
                onClick={() => setServersModalNode(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {serversLoading ? (
                <div className="py-12 text-center text-neutral-400 text-xs">
                  Loading instance assignments...
                </div>
              ) : nodeServers.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 text-xs">
                  No active servers currently assigned to this node. Ready for provisioning.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/40 text-neutral-400 font-mono text-[10px] uppercase border-b border-white/10">
                      <tr>
                        <th className="p-3 pl-4">SERVICE ID</th>
                        <th className="p-3">SERVER NAME</th>
                        <th className="p-3">CUSTOMER</th>
                        <th className="p-3">PORT</th>
                        <th className="p-3">RAM</th>
                        <th className="p-3 pr-4 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-neutral-300">
                      {nodeServers.map((srv) => (
                        <tr key={srv.id} className="hover:bg-white/5 transition">
                          <td className="p-3 pl-4 font-mono font-bold text-white">{srv.service_id}</td>
                          <td className="p-3 font-semibold text-white">{srv.name}</td>
                          <td className="p-3 font-mono text-neutral-400">{srv.user_email}</td>
                          <td className="p-3 font-mono text-[#C5F36A]">{srv.port}</td>
                          <td className="p-3 font-mono">{srv.ram_max || 4} GB</td>
                          <td className="p-3 pr-4 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {srv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setServersModalNode(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition"
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
