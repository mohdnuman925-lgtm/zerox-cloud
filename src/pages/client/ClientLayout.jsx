import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Server,
  CreditCard,
  LifeBuoy,
  Settings,
  ArrowLeft,
  LogOut,
  Key,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

export const ClientLayout = () => {
  const { user, loading, logout, updatePanelPassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [panelModalOpen, setPanelModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelSuccess, setPanelSuccess] = useState('');
  const [panelError, setPanelError] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C5F36A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/login?redirect=' + encodeURIComponent(location.pathname));
    return null;
  }

  const navItems = [
    { label: 'Overview', path: '/client/overview', icon: LayoutDashboard },
    { label: 'Servers', path: '/client/servers', icon: Server },
    { label: 'Billing', path: '/client/billing', icon: CreditCard },
    { label: 'Support', path: '/client/support', icon: LifeBuoy },
    { label: 'Settings', path: '/client/settings', icon: Settings },
  ];

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPanelError('');
    setPanelSuccess('');
    setPanelLoading(true);

    try {
      await updatePanelPassword(newPassword);
      setPanelSuccess('Panel password updated and synced!');
      setTimeout(() => {
        setPanelModalOpen(false);
        setPanelSuccess('');
        setNewPassword('');
      }, 1500);
    } catch (err) {
      setPanelError(err.message || 'Failed to update');
    } finally {
      setPanelLoading(false);
    }
  };

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'ZX';

  return (
    <div className="min-h-screen flex bg-[#080B0A] text-white">
      {/* Sidebar matching video frame 042 */}
      <aside className="w-64 bg-[#0A0E0B] border-r border-white/10 flex flex-col justify-between p-4 flex-shrink-0 z-20">
        <div className="space-y-6">
          {/* Brand matching video frame 042 */}
          <div className="px-2">
            <BrandLogo size="md" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mt-1 pl-11">
              CLIENT AREA
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-white/15 text-white font-bold shadow-md '
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5F36A]' : 'text-neutral-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>

          {/* User profile capsule */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-white/5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-[#C5F36A] text-black font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                {initials}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-neutral-500 hover:text-red-400 p-1.5 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 sm:p-10 relative z-10">
          <Outlet context={{ onOpenPanelModal: () => setPanelModalOpen(true) }} />
        </main>
      </div>

      {/* Panel Password Sync Modal */}
      {panelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c140f]/5 border border-white/15 w-full max-w-md p-6 rounded-3xl backdrop-blur-2xl shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#C5F36A]" />
                <h3 className="text-base font-bold text-white">Sync Panel Password</h3>
              </div>
              <button
                onClick={() => setPanelModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Update your credentials for the game control panel (panel.zeroxcloud.site). This keeps your website and panel passwords synchronized.
            </p>

            {panelSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{panelSuccess}</span>
              </div>
            )}
            {panelError && (
              <div className="p-3 rounded-xl bg-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{panelError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  NEW PANEL PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-black/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={panelLoading}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition disabled:opacity-50"
                >
                  {panelLoading ? 'Syncing...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setPanelModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/15 transition"
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

