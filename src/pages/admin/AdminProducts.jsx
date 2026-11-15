import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layers, Plus, Edit2, Trash2, CheckCircle, X, RefreshCw } from 'lucide-react';

export const AdminProducts = () => {
  const { token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'games',
    game_slug: 'minecraft',
    processor: 'intel',
    price_inr: 80,
    price_usd: 1.0,
    ram: '4 GB',
    cpu: '200% CPU',
    storage: '30 GB NVMe',
    location: 'India (Noida & Mumbai)',
    tag: 'GAMES',
    badge: ''
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPlans();
  }, [token]);

  const handleOpenCreate = () => {
    setEditPlan(null);
    setFormData({
      name: '',
      category: 'games',
      game_slug: 'minecraft',
      processor: 'intel',
      price_inr: 80,
      price_usd: 1.0,
      ram: '4 GB',
      cpu: '200% CPU',
      storage: '30 GB NVMe',
      location: 'India (Noida & Mumbai)',
      tag: 'GAMES',
      badge: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditPlan(plan);
    setFormData({
      name: plan.name,
      category: plan.category,
      game_slug: plan.game_slug || '',
      processor: plan.processor || 'intel',
      price_inr: plan.price_inr,
      price_usd: plan.price_usd,
      ram: plan.ram,
      cpu: plan.cpu,
      storage: plan.storage,
      location: plan.location,
      tag: plan.tag || '',
      badge: plan.badge || ''
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editPlan ? `/api/admin/plans/${editPlan.id}` : '/api/admin/plans';
      const method = editPlan ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setModalOpen(false);
        await fetchPlans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      const res = await fetch(`/api/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) await fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            CATALOG MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Products &amp; Dynamic Pricing
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Create and edit plans. Pricing updates reflect instantly across the public website and checkout.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      {/* Plans List Table */}
      <div className="rounded-3xl bg-[#121814] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 border-b border-white/10 text-neutral-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4 pl-6">PLAN NAME</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">RAM / CPU</th>
                <th className="p-4">STORAGE</th>
                <th className="p-4">PRICE (INR)</th>
                <th className="p-4">PRICE (USD)</th>
                <th className="p-4 pr-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      {(p.game_slug === 'minecraft' || p.category === 'games') && (
                        <img
                          src={p.image || '/assets/minecraft-plan-card.jpg'}
                          alt={p.name}
                          className="w-9 h-9 rounded-xl object-cover object-top border border-white/10 shrink-0 shadow-md"
                        />
                      )}
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        {p.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C5F36A] text-black">
                            {p.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono uppercase text-[11px] text-neutral-400">
                    {p.category}
                  </td>
                  <td className="p-4 font-mono text-[11px]">
                    {p.ram} • {p.cpu}
                  </td>
                  <td className="p-4 font-mono text-[11px]">{p.storage}</td>
                  <td className="p-4 font-mono font-bold text-white">
                    ₹{Number(p.price_inr).toFixed(2)}
                  </td>
                  <td className="p-4 font-mono font-bold text-[#C5F36A]">
                    ${Number(p.price_usd).toFixed(2)}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#121814] border border-white/15 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editPlan ? `Edit Plan: ${editPlan.name}` : 'Create New Hosting Plan'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">PLAN NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. NETHERITE EXTREME"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">CATEGORY</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  >
                    <option value="games">Game Servers</option>
                    <option value="cloud">Cloud / VPS</option>
                    <option value="dedicated">Dedicated</option>
                    <option value="web">Web Hosting</option>
                    <option value="discord-bots">Discord Bots</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">PROCESSOR</label>
                  <select
                    value={formData.processor}
                    onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  >
                    <option value="intel">Intel Xeon</option>
                    <option value="amd">AMD EPYC</option>
                    <option value="ryzen">AMD Ryzen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">PRICE (INR ₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price_inr}
                    onChange={(e) => setFormData({ ...formData, price_inr: parseFloat(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">PRICE (USD $)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price_usd}
                    onChange={(e) => setFormData({ ...formData, price_usd: parseFloat(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">CPU</label>
                  <input
                    type="text"
                    value={formData.cpu}
                    onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">STORAGE</label>
                  <input
                    type="text"
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">BADGE</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. MOST SOLD"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">LOCATION</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition"
                >
                  {editPlan ? 'Save Changes' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs hover:bg-white/15 transition"
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

