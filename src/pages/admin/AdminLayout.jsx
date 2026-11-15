import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Layers,
  ShoppingBag,
  Server,
  Cpu,
  LifeBuoy,
  Tag,
  FileCode,
  Settings,
  History,
  ArrowLeft,
  LogOut,
  Sparkles
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, isAdmin, isSuperAdmin, isStaff, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || (!isAdmin && !isStaff)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#080B0A] text-white">
        <div className="max-w-md w-full p-8 rounded-3xl  backdrop-blur-2xl text-center space-y-4 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-xs text-neutral-400">
            You do not possess Super Admin, Staff, or Administrator privileges to enter the ZEROX CLOUD Control Center.
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

  const allNav = [
    { label: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { label: 'Customers', path: '/admin/customers', icon: Users, minRoles: ['super_admin', 'founder', 'admin', 'moderator'] },
    { label: 'Roles & Staff', path: '/admin/roles', icon: ShieldCheck, superAdminOnly: true },
    { label: 'Products & Plans', path: '/admin/products', icon: Layers, minRoles: ['super_admin', 'founder', 'admin'] },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag, minRoles: ['super_admin', 'founder', 'admin'] },
    { label: 'Servers', path: '/admin/servers', icon: Server, minRoles: ['super_admin', 'founder', 'admin'] },
    { label: 'Nodes & Wings', path: '/admin/nodes', icon: Cpu, minRoles: ['super_admin', 'founder', 'admin'] },
    { label: 'Support Desk', path: '/admin/tickets', icon: LifeBuoy },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag, minRoles: ['super_admin', 'founder', 'admin'] },
    { label: 'Website CMS', path: '/admin/content', icon: FileCode, minRoles: ['super_admin', 'founder', 'admin'] },
    { label: 'System Settings', path: '/admin/settings', icon: Settings, minRoles: ['super_admin', 'founder', 'admin'] },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: History, minRoles: ['super_admin', 'founder', 'admin'] },
  ];

  const adminNav = allNav.filter((item) => {
    if (user.role === 'super_admin' || user.role === 'founder') return true;
    if (item.superAdminOnly) return false;
    if (item.minRoles && !item.minRoles.includes(user.role)) return false;
    return true;
  });

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-pink-500/20 text-pink-400  -pink-500/40';
      case 'founder':
        return 'bg-amber-500/20 text-amber-400  ';
      case 'admin':
        return 'bg-emerald-500/20 text-emerald-400  ';
      case 'ticket_staff':
        return 'bg-sky-500/20 text-sky-400  ';
      case 'moderator':
        return 'bg-indigo-500/20 text-indigo-400  ';
      default:
        return 'bg-[#C5F36A]/20 text-[#C5F36A] ';
    }
  };

  return (
    <div className="min-h-screen flex bg-[#060807] text-white">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0B0F0C] -r flex flex-col justify-between p-4 flex-shrink-0 z-20">
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
                CONTROL CENTER
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
        <div className="space-y-3 pt-4 -t">
          <Link
            to="/client/overview"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Client Area
          </Link>

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider mt-0.5 ${getRoleBadgeStyle(user.role)}`}>
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
        <header className="h-14 -b bg-[#0B0F0C]/60 backdrop-blur-2xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-[#C5F36A]" />
            <span>Server Role: <strong className={`uppercase font-mono px-2 py-0.5 rounded text-[10px] ${getRoleBadgeStyle(user.role)}`}>{user.role}</strong></span>
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

