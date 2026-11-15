import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOutletContext } from 'react-router-dom';
import { User, Key, Shield, Bell, CheckCircle } from 'lucide-react';

export const ClientSettings = () => {
  const { user } = useAuth();
  const { onOpenPanelModal } = useOutletContext();
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyDiscord, setNotifyDiscord] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSavePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
          SETTINGS
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-0.5">
          Account &amp; Security
        </h1>
      </div>

      {/* Profile Details */}
      <div className="bg-[#0c140f]/5 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 text-[#C5F36A]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Profile Details</h3>
            <p className="text-xs text-neutral-400">Your account identity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3.5 rounded-xl bg-black/40">
            <span className="text-[10px] uppercase font-mono text-neutral-500 block">Full Name</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{user?.name}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40">
            <span className="text-[10px] uppercase font-mono text-neutral-500 block">Email Address</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{user?.email}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40">
            <span className="text-[10px] uppercase font-mono text-neutral-500 block">Account Role</span>
            <span className="text-xs font-mono font-bold text-[#C5F36A] uppercase mt-0.5 block">
              {user?.role}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40">
            <span className="text-[10px] uppercase font-mono text-neutral-500 block">Member Since</span>
            <span className="text-xs font-mono text-neutral-300 mt-0.5 block">
              {new Date(user?.created_at || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Pterodactyl Panel Password */}
      <div className="bg-[#0c140f]/5 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 text-[#C5F36A]">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Game Panel Credentials</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Sync your login credentials with panel.zeroxcloud.site
            </p>
          </div>
        </div>
        <button
          onClick={onOpenPanelModal}
          className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition"
        >
          Change Password
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-[#0c140f]/5 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 text-[#C5F36A]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Notification Preferences</h3>
            <p className="text-xs text-neutral-400">Manage where alerts and invoices are sent</p>
          </div>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 cursor-pointer">
            <div>
              <p className="font-bold text-white">Email Server Alerts &amp; Invoices</p>
              <p className="text-neutral-400 text-[11px]">Receive renewal reminders and payment receipts via email</p>
            </div>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="accent-[#C5F36A] w-4 h-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 cursor-pointer">
            <div>
              <p className="font-bold text-white">Discord Webhook Notifications</p>
              <p className="text-neutral-400 text-[11px]">Send ticket updates to your linked Discord handle</p>
            </div>
            <input
              type="checkbox"
              checked={notifyDiscord}
              onChange={(e) => setNotifyDiscord(e.target.checked)}
              className="accent-[#C5F36A] w-4 h-4 rounded"
            />
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Preferences saved
            </span>
          ) : <span />}
          <button
            onClick={handleSavePreferences}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

