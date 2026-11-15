import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileCode, CheckCircle, Save, AlertTriangle, RefreshCw, X } from 'lucide-react';

export const AdminContent = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/content', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}))
      .catch((err) => setError('Failed to load website content settings'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update website content');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="py-20 text-center text-neutral-400">Loading website CMS settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            CONTENT MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Website Content &amp; Copy
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Edit public website banners, hero titles, welcome offers, and community links.
          </p>
        </div>

        {saved && (
          <span className="text-xs text-[#C5F36A] flex items-center gap-1 font-bold">
            <CheckCircle className="w-4 h-4" /> Changes saved to database
          </span>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </span>
          <button onClick={() => setError('')} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {saved && (
        <div className="p-3.5 rounded-2xl bg-[#C5F36A]/10 border border-[#C5F36A]/30 text-[#C5F36A] text-xs flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Content updated and live across the public store!
          </span>
          <button onClick={() => setSaved(false)} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#121814] border border-white/10 space-y-6 shadow-xl">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
            Hero Section Copy
          </h3>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              STATUS BANNER PILL
            </label>
            <input
              type="text"
              value={settings.announcement_text || ''}
              onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              HERO HEADLINE
            </label>
            <input
              type="text"
              value={settings.hero_title || ''}
              onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              HERO SUBTITLE
            </label>
            <textarea
              rows={2}
              value={settings.hero_subtitle || ''}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
            Welcome Discount Modal
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="modalEnabled"
              checked={settings.welcome_modal_enabled ?? true}
              onChange={(e) => setSettings({ ...settings, welcome_modal_enabled: e.target.checked })}
              className="accent-[#C5F36A] w-4 h-4 rounded"
            />
            <label htmlFor="modalEnabled" className="text-xs text-white font-medium cursor-pointer">
              Show 10% OFF Welcome Modal to new visitors
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                DISCOUNT PERCENTAGE
              </label>
              <input
                type="number"
                value={settings.welcome_discount_percent || 10}
                onChange={(e) => setSettings({ ...settings, welcome_discount_percent: parseInt(e.target.value) })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                PROMO COUPON CODE
              </label>
              <input
                type="text"
                value={settings.welcome_coupon_code || 'ZEROXCLOUD'}
                onChange={(e) => setSettings({ ...settings, welcome_coupon_code: e.target.value.toUpperCase() })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
            Community &amp; Contact
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                DISCORD INVITE URL
              </label>
              <input
                type="text"
                value={settings.discord_url || ''}
                onChange={(e) => setSettings({ ...settings, discord_url: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                SUPPORT EMAIL
              </label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Website Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

