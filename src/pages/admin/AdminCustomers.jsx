import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Shield, Ban, CheckCircle, RefreshCw } from 'lucide-react';

export const AdminCustomers = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusLoading, setStatusLoading] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCustomers();
  }, [token]);

  const handleToggleStatus = async (customer) => {
    const nextStatus = customer.status === 'active' ? 'suspended' : 'active';
    const reason = prompt(`Reason for changing status to ${nextStatus}:`, 'Admin review action');
    if (!reason) return;

    setStatusLoading(customer.id);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus, reason })
      });
      if (res.ok) {
        await fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusLoading(null);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            ADMINISTRATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Customer Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Search, review, and control customer account authorizations.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white border border-white/10 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-[#121814] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A]"
        />
      </div>

      <div className="rounded-3xl bg-[#121814] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 border-b border-white/10 text-neutral-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4 pl-6">CUSTOMER</th>
                <th className="p-4">ROLE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">SERVICES</th>
                <th className="p-4">ORDERS</th>
                <th className="p-4 pr-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition">
                  <td className="p-4 pl-6">
                    <div>
                      <p className="font-bold text-white">{c.name}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">{c.email}</p>
                    </div>
                  </td>
                  <td className="p-4 font-mono uppercase text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[#C5F36A] font-bold">
                      {c.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {c.services_count} active
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {c.orders_count} orders
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {c.role !== 'super_admin' && (
                      <button
                        onClick={() => handleToggleStatus(c)}
                        disabled={statusLoading === c.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          c.status === 'active'
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                        }`}
                      >
                        {c.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

