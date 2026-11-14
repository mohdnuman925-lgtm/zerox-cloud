import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Server, RefreshCw, Activity, Terminal, ShieldAlert } from 'lucide-react';

export const AdminServers = () => {
  const { token } = useAuth();
  const [data, setData] = useState({ services: [], provisioning_jobs: [] });
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/servers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchServers();
  }, [token]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            INFRASTRUCTURE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Active Servers &amp; Provisioning
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Global fleet status, node allocations, and automated provisioning jobs.
          </p>
        </div>

        <button
          onClick={fetchServers}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white border border-white/10 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Services Table */}
      <div className="rounded-3xl bg-[#121814] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-[#C5F36A]" />
            Active Customer Instances ({data.services.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 border-b border-white/10 text-neutral-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4 pl-6">SERVICE ID</th>
                <th className="p-4">SERVER NAME</th>
                <th className="p-4">CUSTOMER EMAIL</th>
                <th className="p-4">IP &amp; PORT</th>
                <th className="p-4">NODE</th>
                <th className="p-4 pr-6 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {data.services.map((s) => (
                <tr key={s.id} className="hover:bg-white/5 transition">
                  <td className="p-4 pl-6 font-mono font-bold text-white">
                    {s.service_id}
                  </td>
                  <td className="p-4 font-bold text-white">{s.name}</td>
                  <td className="p-4 font-mono text-neutral-400">{s.user_email}</td>
                  <td className="p-4 font-mono text-white">
                    {s.ip_address}:{s.port}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-neutral-400">{s.node}</td>
                  <td className="p-4 pr-6 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provisioning Jobs Monitor */}
      <div className="rounded-3xl bg-[#121814] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Provisioning Job Queue Logs
          </h3>
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

