import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  Layers,
  ShoppingBag,
  Server,
  LifeBuoy,
  Tag,
  FileCode,
  Settings,
  History,
  ArrowLeft,
  LogOut
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#080B0A] text-white">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#121814] border border-red-500/30 text-center space-y-4 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-xs text-neutral-400">
            You do not possess Super Admin or Administrator privileges to enter the ZEROX CLOUD Control Center.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Link
              to="/login?redirect=/admin/overview"
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition"
            >
              Log in as Admin
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/15 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminNav = [
    { label: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Products & Plans', path: '/admin/products', icon: Layers },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Servers & Nodes', path: '/admin/servers', icon: Server },
    { label: 'Support Desk', path: '/admin/tickets', icon: LifeBuoy },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Website CMS', path: '/admin/content', icon: FileCode },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: History },
  ];

  return (
    <div className="min-h-screen flex bg-[#060807] text-white">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0B0F0C] border-r border-white/10 flex flex-col justify-between p-4 flex-shrink-0 z-20">
        <div className="space-y-6">
          {/* Header */}
          <Link to="/" className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-xl bg-[#C5F36A] text-black font-black flex items-center justify-center text-sm shadow-md">
              ZX
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                ZEROX CLOUD
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-[#C5F36A] font-bold block">
                SUPER ADMIN
              </span>
            </div>
          </Link>

          {/* Nav List */}
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#C5F36A] text-black font-extrabold shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <Link
            to="/client/overview"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Client Area
          </Link>

          <div className="flex items-center justify-between p-2 rounded-2xl bg-white/5 border border-white/5">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <span className="text-[9px] font-mono text-[#C5F36A] uppercase font-bold">
                {user.role}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-neutral-400 hover:text-red-400 p-1.5 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-white/10 bg-[#0B0F0C]/60 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldAlert className="w-4 h-4 text-[#C5F36A]" />
            <span>Server Role Verified: <strong className="text-white uppercase font-mono">{user.role}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-400 font-mono text-[11px]">Database: Active JSON RDBMS</span>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-10 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

