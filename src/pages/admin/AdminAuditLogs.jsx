import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { History, RefreshCw, Shield } from 'lucide-react';

export const AdminAuditLogs = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLogs();
  }, [token]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            SECURITY &amp; COMPLIANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Audit Trails
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Immutable non-secret log of system, payment, and administrative operations.
          </p>
        </div>

        <button
          onClick={fetchLogs}
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
                <th className="p-4 pl-6">TIMESTAMP</th>
                <th className="p-4">ACTOR</th>
                <th className="p-4">ROLE</th>
                <th className="p-4">ACTION</th>
                <th className="p-4">TARGET</th>
                <th className="p-4 pr-6">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300 font-mono">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-white/5 transition">
                  <td className="p-4 pl-6 text-[11px] text-neutral-500 whitespace-nowrap">
                    {new Date(l.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-white">{l.actor_name}</td>
                  <td className="p-4 uppercase text-[10px] text-[#C5F36A] font-bold">
                    {l.actor_role}
                  </td>
                  <td className="p-4 font-bold text-white">{l.action}</td>
                  <td className="p-4 text-neutral-400 text-[11px]">{l.target}</td>
                  <td className="p-4 pr-6 text-neutral-400 text-[11px] max-w-xs truncate">
                    {l.details}
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

