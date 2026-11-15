import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, RefreshCw, CheckCircle, Clock } from 'lucide-react';

export const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            TRANSACTIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Customer Orders
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track checkout orders, verified payments, and automated service provisions.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white border border-white/10 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="rounded-3xl bg-[#121814] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 border-b border-white/10 text-neutral-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4 pl-6">ORDER NUMBER</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">ITEMS</th>
                <th className="p-4">AMOUNT</th>
                <th className="p-4">METHOD</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 pr-6 text-right">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition">
                  <td className="p-4 pl-6 font-mono font-bold text-white">
                    {ord.order_number}
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-white">{ord.user_name}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">{ord.user_email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    {ord.items && ord.items.map((it, idx) => (
                      <span key={idx} className="block text-[11px] text-neutral-300">
                        {it.plan_name} ({it.game || it.category})
                      </span>
                    ))}
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {ord.currency === 'USD' ? '$' : '₹'}{Number(ord.total_amount).toFixed(2)}
                    {ord.gst_amount > 0 && (
                      <span className="block text-[10px] text-neutral-400 font-normal">
                        incl. {ord.currency === 'USD' ? '$' : '₹'}{Number(ord.gst_amount).toFixed(2)} GST
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-[11px]">
                    {ord.payment_method}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right font-mono text-[11px] text-neutral-400">
                    {new Date(ord.created_at).toLocaleDateString()}
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

