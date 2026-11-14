import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Server, CreditCard, CheckCircle, Save } from 'lucide-react';

export const AdminSettings = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !settings) {
    return <div className="py-20 text-center text-neutral-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            SYSTEM ARCHITECTURE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            System &amp; Provider Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure Pterodactyl Game Panel URLs, currency defaults, and maintenance modes.
          </p>
        </div>

        {saved && (
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> System settings updated
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="p-8 rounded-3xl bg-[#121814] border border-white/10 space-y-6 shadow-xl">
        {/* Pterodactyl Panel Adapter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#C5F36A]" />
            <h3 className="text-sm font-bold text-white">Pterodactyl Panel Provider Integration</h3>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              PANEL BASE URL
            </label>
            <input
              type="text"
              value={settings.pterodactyl_panel_url || ''}
              onChange={(e) => setSettings({ ...settings, pterodactyl_panel_url: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            * Note: API Client Key &amp; Application Keys are read securely from server-side environment variables (.env) and never transmitted to client browsers.
          </p>
        </div>

        {/* Currency & Financials */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Default Currency &amp; Tax</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">DEFAULT CURRENCY</label>
              <select
                value={settings.currency_default || 'INR'}
                onChange={(e) => setSettings({ ...settings, currency_default: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">TAX PERCENTAGE (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.tax_rate ?? 0.0}
                onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="pt-4 border-t border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenance_mode ?? false}
              onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              className="accent-amber-500 w-4 h-4 rounded"
            />
            <div>
              <p className="text-xs font-bold text-white">Maintenance Mode</p>
              <p className="text-[11px] text-neutral-400">Temporarily restrict new orders while maintenance is underway</p>
            </div>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};

