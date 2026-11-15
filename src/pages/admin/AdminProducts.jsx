import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  RefreshCw,
  AlertTriangle,
  Search,
  Database,
  Flame,
  Server,
  Cpu,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'games', label: 'Game Servers' },
  { id: 'cloud', label: 'Cloud VPS' },
  { id: 'dedicated', label: 'Dedicated' },
  { id: 'web', label: 'Web Hosting' },
  { id: 'discord-bots', label: 'Discord Bots' }
];

export const AdminProducts = () => {
  const { token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editPlan, setEditPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'games',
    game_slug: 'minecraft',
    processor: 'intel',
    price_inr: 80,
    price_usd: 1.0,
    original_price_inr: '',
    ram: '4 GB',
    cpu: '200% CPU',
    storage: '30 GB NVMe',
    bandwidth: 'Unlimited',
    location: 'India (Noida & Mumbai)',
    tag: 'GAMES',
    badge: '',
    save_badge: '',
    image: '/assets/minecraft-plan-card.jpg',
    stock_status: 'in_stock',
    enabled: true,
    featuresText: 'Instant deployment\nDDoS protection\nNVMe storage\nFull panel control'
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load plans from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPlans();
  }, [token]);

  const handleSeedPlans = async () => {
    if (!confirm('Are you sure you want to seed / reset the official catalog with all 37 plans? Custom changes to existing plans might be reset.')) {
      return;
    }
    setSeeding(true);
    setError('');
    try {
      const res = await fetch('/api/admin/plans/seed', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed plans');

      setSuccess(`Successfully seeded ${data.count} official hosting plans!`);
      setTimeout(() => setSuccess(''), 4000);
      await fetchPlans();
    } catch (err) {
      setError(err.message || 'Error seeding plans');
    } finally {
      setSeeding(false);
    }
  };

  const handleOpenCreate = () => {
    setEditPlan(null);
    setError('');
    setFormData({
      name: '',
      category: 'games',
      game_slug: 'minecraft',
      processor: 'intel',
      price_inr: 80,
      price_usd: 1.0,
      original_price_inr: '',
      ram: '4 GB',
      cpu: '200% CPU',
      storage: '30 GB NVMe',
      bandwidth: 'Unlimited',
      location: 'India (Noida & Mumbai)',
      tag: 'GAMES',
      badge: '',
      save_badge: '',
      image: '/assets/minecraft-plan-card.jpg',
      stock_status: 'in_stock',
      enabled: true,
      featuresText: 'Instant deployment\nDDoS protection\nNVMe storage\nFull panel control'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditPlan(plan);
    setError('');
    const featuresArr = Array.isArray(plan.features) ? plan.features : [];
    setFormData({
      name: plan.name || '',
      category: plan.category || 'games',
      game_slug: plan.game_slug || (plan.category === 'games' ? 'minecraft' : ''),
      processor: plan.processor || 'intel',
      price_inr: plan.price_inr ?? 0,
      price_usd: plan.price_usd ?? 0,
      original_price_inr: plan.original_price_inr ?? '',
      ram: plan.ram || '',
      cpu: plan.cpu || '',
      storage: plan.storage || '',
      bandwidth: plan.bandwidth || 'Unlimited',
      location: plan.location || 'India (Noida & Mumbai)',
      tag: plan.tag || '',
      badge: plan.badge || '',
      save_badge: plan.save_badge || '',
      image: plan.image || (plan.game_slug === 'minecraft' ? '/assets/minecraft-plan-card.jpg' : ''),
      stock_status: plan.stock_status || 'in_stock',
      enabled: plan.enabled ?? true,
      featuresText: featuresArr.join('\n')
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const url = editPlan ? `/api/admin/plans/${editPlan.id}` : '/api/admin/plans';
      const method = editPlan ? 'PUT' : 'POST';

      const parsedFeatures = formData.featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim().toUpperCase(),
        category: formData.category,
        game_slug: formData.category === 'games' ? formData.game_slug : null,
        processor: formData.processor,
        price_inr: parseFloat(formData.price_inr) || 0,
        price_usd: parseFloat(formData.price_usd) || 0,
        original_price_inr: formData.original_price_inr ? parseFloat(formData.original_price_inr) : null,
        ram: formData.ram,
        cpu: formData.cpu,
        storage: formData.storage,
        bandwidth: formData.bandwidth,
        location: formData.location,
        tag: formData.tag || formData.category.toUpperCase(),
        badge: formData.badge,
        save_badge: formData.save_badge,
        image: formData.image,
        stock_status: formData.stock_status,
        enabled: formData.enabled,
        features: parsedFeatures
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save plan');
      }

      setSuccess(`Plan "${payload.name}" saved successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      setModalOpen(false);
      await fetchPlans();
    } catch (err) {
      setError(err.message || 'Error saving plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (plan) => {
    try {
      const newEnabled = !plan.enabled;
      const res = await fetch(`/api/admin/plans/${plan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ enabled: newEnabled })
      });
      if (res.ok) {
        setPlans((prev) =>
          prev.map((p) => (p.id === plan.id ? { ...p, enabled: newEnabled } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle plan status:', err);
    }
  };

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete plan');

      setSuccess('Plan deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
      await fetchPlans();
    } catch (err) {
      setError(err.message || 'Failed to delete plan');
    }
  };

  // Filtered & Searched Plans
  const filteredPlans = plans.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.processor?.toLowerCase().includes(q) ||
      p.ram?.toLowerCase().includes(q) ||
      p.cpu?.toLowerCase().includes(q) ||
      p.storage?.toLowerCase().includes(q) ||
      p.badge?.toLowerCase().includes(q) ||
      p.game_slug?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            CATALOG MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Products &amp; Dynamic Pricing
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Create, edit, seed, and manage hosting plans across all categories. Pricing and tiers update dynamically across checkout and store.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleSeedPlans}
            disabled={seeding}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold text-xs transition shadow-lg disabled:opacity-50"
            title="Seed / Reset all 37 standard plans"
          >
            <Database className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding...' : 'Seed Catalog (37 Plans)'}</span>
          </button>
          <button
            onClick={fetchPlans}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition"
            title="Refresh Plans"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Create New Plan
          </button>
        </div>
      </div>

      {/* Category Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'all', label: 'All Plans', count: plans.length, color: 'text-white' },
          { id: 'games', label: 'Game Servers', count: plans.filter((p) => p.category === 'games').length, color: 'text-[#C5F36A]' },
          { id: 'cloud', label: 'Cloud VPS', count: plans.filter((p) => p.category === 'cloud').length, color: 'text-blue-400' },
          { id: 'dedicated', label: 'Dedicated', count: plans.filter((p) => p.category === 'dedicated').length, color: 'text-purple-400' },
          { id: 'web', label: 'Web Hosting', count: plans.filter((p) => p.category === 'web').length, color: 'text-emerald-400' },
          { id: 'discord-bots', label: 'Discord Bots', count: plans.filter((p) => p.category === 'discord-bots').length, color: 'text-indigo-400' }
        ].map((stat) => (
          <button
            key={stat.id}
            onClick={() => setSelectedCategory(stat.id)}
            className={`p-3.5 rounded-2xl text-left  transition-all backdrop-blur-xl ${
              selectedCategory === stat.id
                ? 'bg-white/10  shadow-lg '
                : ' backdrop-blur-2xl  hover:bg-white/5'
            }`}
          >
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              {stat.label}
            </div>
            <div className={`text-xl font-extrabold mt-1 ${stat.color}`}>
              {stat.count}
            </div>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0e1611]/5 backdrop-blur-2xl">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, ram, cpu..."
            className="w-full bg-black/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 text-red-400 text-xs flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </span>
          <button onClick={() => setError('')} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-2xl bg-[#C5F36A]/10 text-[#C5F36A] text-xs flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {success}
          </span>
          <button onClick={() => setSuccess('')} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Plans List Table */}
      <div className="rounded-3xl bg-[#0e1611]/5 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="p-4 -b flex items-center justify-between text-xs text-neutral-400">
          <span>
            Showing <strong className="text-white">{filteredPlans.length}</strong> of{' '}
            <strong className="text-white">{plans.length}</strong> plans
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 -b text-neutral-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4 pl-6">PLAN NAME</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">PROCESSOR / ENGINE</th>
                <th className="p-4">RAM / CPU</th>
                <th className="p-4">STORAGE / BW</th>
                <th className="p-4">PRICE (INR)</th>
                <th className="p-4">PRICE (USD)</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 pr-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-neutral-400">
                    No plans found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {(p.game_slug === 'minecraft' || p.category === 'games') && (
                          <img
                            src={p.image || '/assets/minecraft-plan-card.jpg'}
                            alt={p.name}
                            className="w-9 h-9 rounded-xl object-cover object-top shrink-0 shadow-md"
                          />
                        )}
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C5F36A] text-black">
                                {p.badge}
                              </span>
                            )}
                            {p.save_badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300">
                                {p.save_badge}
                              </span>
                            )}
                            {p.game_slug && (
                              <span className="text-[10px] font-mono text-neutral-400">
                                ({p.game_slug})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono uppercase text-[11px] text-neutral-400">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono uppercase text-[11px]">
                      {p.processor === 'ryzen' ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" /> RYZEN 7950X
                        </span>
                      ) : p.processor === 'amd' ? (
                        <span className="text-orange-400 font-bold">AMD EPYC</span>
                      ) : p.processor === 'intel' ? (
                        <span className="text-cyan-400 font-bold">INTEL XEON</span>
                      ) : (
                        <span className="text-neutral-400">{p.processor || 'STANDARD'}</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-[11px]">
                      <div className="text-white font-medium">{p.ram}</div>
                      <div className="text-neutral-400 text-[10px]">{p.cpu}</div>
                    </td>
                    <td className="p-4 font-mono text-[11px]">
                      <div className="text-white font-medium">{p.storage}</div>
                      <div className="text-neutral-400 text-[10px]">{p.bandwidth || 'Unlimited'}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      <div>₹{Number(p.price_inr).toFixed(2)}</div>
                      {p.original_price_inr && (
                        <div className="text-[10px] text-neutral-500 line-through">
                          ₹{Number(p.original_price_inr).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-[#C5F36A]">
                      ${Number(p.price_usd).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold  transition ${
                          p.enabled
                            ? 'bg-emerald-500/15  text-emerald-400 hover:bg-emerald-500/25'
                            : 'bg-red-500/15  text-red-400 hover:bg-red-500/25'
                        }`}
                        title="Click to toggle active status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.enabled ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {p.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                          title="Edit Plan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-[#0e1611]/5 backdrop-blur-2xl shadow-2xl text-white space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between -b pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5F36A]" />
                {editPlan ? `Edit Plan: ${editPlan.name}` : 'Create New Hosting Plan'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/15 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">PLAN NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. NETHERITE EXTREME"
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">CATEGORY *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="games">Game Servers</option>
                    <option value="cloud">Cloud / VPS</option>
                    <option value="dedicated">Dedicated</option>
                    <option value="web">Web Hosting</option>
                    <option value="discord-bots">Discord Bots</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {formData.category === 'games' ? (
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">GAME</label>
                    <select
                      value={formData.game_slug}
                      onChange={(e) => {
                        const g = e.target.value;
                        let img = formData.image;
                        if (g === 'minecraft') img = '/assets/minecraft-plan-card.jpg';
                        setFormData({ ...formData, game_slug: g, image: img });
                      }}
                      className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="minecraft">Minecraft</option>
                      <option value="rust">Rust</option>
                      <option value="cs2">Counter-Strike 2</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">TAG</label>
                    <input
                      type="text"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      placeholder="e.g. CLOUD, VPS, DEDICATED"
                      className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">PROCESSOR / ENGINE</label>
                  <select
                    value={formData.processor}
                    onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="intel">Intel Xeon</option>
                    <option value="amd">AMD EPYC</option>
                    <option value="ryzen">AMD Ryzen 7950X</option>
                    <option value="offer">Special Offer</option>
                    <option value="standard">Standard / High Performance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">PRICE (INR ₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price_inr}
                    onChange={(e) => setFormData({ ...formData, price_inr: e.target.value })}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">PRICE (USD $) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price_usd}
                    onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">ORIGINAL MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price_inr}
                    onChange={(e) => setFormData({ ...formData, original_price_inr: e.target.value })}
                    placeholder="e.g. 199"
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">RAM</label>
                  <input
                    type="text"
                    value={formData.ram}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    placeholder="e.g. 16 GB DDR5"
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">CPU</label>
                  <input
                    type="text"
                    value={formData.cpu}
                    onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                    placeholder="e.g. 400% CPU (4 Cores)"
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">STORAGE</label>
                  <input
                    type="text"
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    placeholder="e.g. 100 GB NVMe"
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">BANDWIDTH</label>
                  <input
                    type="text"
                    value={formData.bandwidth}
                    onChange={(e) => setFormData({ ...formData, bandwidth: e.target.value })}
                    placeholder="e.g. Unlimited or 1 Gbps"
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">LOCATION</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="India (Noida & Mumbai)"
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">BADGE (OPTIONAL)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. MOST POPULAR, BEST VALUE"
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">SAVE BADGE (OPTIONAL)</label>
                  <input
                    type="text"
                    value={formData.save_badge}
                    onChange={(e) => setFormData({ ...formData, save_badge: e.target.value })}
                    placeholder="e.g. Save 30%"
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">IMAGE URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/assets/minecraft-plan-card.jpg"
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">STOCK STATUS</label>
                  <select
                    value={formData.stock_status}
                    onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  FEATURES (ONE PER LINE)
                </label>
                <textarea
                  rows="3"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Instant deployment&#10;DDoS protection&#10;Full panel access"
                  className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="enabledCheck"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="rounded bg-black text-[#C5F36A] focus:ring-[#C5F36A]"
                />
                <label htmlFor="enabledCheck" className="text-xs text-neutral-300 font-semibold cursor-pointer">
                  Plan is Active (visible in store and public catalog)
                </label>
              </div>

              <div className="flex gap-2 pt-3 -t">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : editPlan ? (
                    'Save Changes'
                  ) : (
                    'Create Plan'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs hover:bg-white/15 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
