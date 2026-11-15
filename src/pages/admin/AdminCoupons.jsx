import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Tag, Plus, Trash2, CheckCircle, X, AlertTriangle, RefreshCw } from 'lucide-react';

export const AdminCoupons = () => {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(15);
  const [description, setDescription] = useState('');
  const [maxUses, setMaxUses] = useState(500);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch coupons');
    }
  };

  useEffect(() => {
    if (token) fetchCoupons();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discount_percent: discount,
          description: description.trim(),
          max_uses: maxUses
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create coupon');
      }

      setModalOpen(false);
      setCode('');
      setDescription('');
      setSuccess(`Coupon ${code.toUpperCase()} created successfully!`);
      setTimeout(() => setSuccess(''), 3500);
      await fetchCoupons();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error creating coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, couponCode) => {
    if (!confirm(`Delete coupon "${couponCode || id}"?`)) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete coupon');

      setSuccess('Coupon deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
      await fetchCoupons();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error deleting coupon');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            PROMOTIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Discount Coupons
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage promotional codes, percentages, and usage limitations.
          </p>
        </div>

        <button
          onClick={() => {
            setError('');
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

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

      <div className="bg-[#0c140f]/5 border border-white/15 rounded-3xl backdrop-blur-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/30 border-b border-white/10 text-neutral-400 font-mono text-[10px] uppercase">
            <tr>
              <th className="p-4 pl-6">COUPON CODE</th>
              <th className="p-4">DISCOUNT</th>
              <th className="p-4">DESCRIPTION</th>
              <th className="p-4">USAGE</th>
              <th className="p-4">STATUS</th>
              <th className="p-4 pr-6 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-300">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-white/5 transition">
                <td className="p-4 pl-6 font-mono font-extrabold text-[#C5F36A] text-sm">
                  {c.code}
                </td>
                <td className="p-4 font-mono font-bold text-white">
                  {c.discount_percent}% OFF
                </td>
                <td className="p-4 text-neutral-300">{c.description}</td>
                <td className="p-4 font-mono text-[11px]">
                  {c.current_uses} / {c.max_uses}
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                    Active
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c140f]/5 border border-white/15 w-full max-w-md p-6 rounded-3xl backdrop-blur-2xl shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create New Coupon</h3>
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

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">COUPON CODE</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER25"
                  className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">DISCOUNT %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">MAX USES</label>
                  <input
                    type="number"
                    min="1"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Summer special discount"
                  className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Coupon'
                  )}
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setModalOpen(false)}
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

