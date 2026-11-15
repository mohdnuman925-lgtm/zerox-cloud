import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle,
  RefreshCw,
  Edit2,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Crown,
  LifeBuoy,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminCustomers = () => {
  const { token, isSuperAdmin, user: currentUser } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusLoading, setStatusLoading] = useState(null);

  // Role Edit Modal State
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleUpdating, setRoleUpdating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [custRes, rolesRes] = await Promise.all([
        fetch('/api/admin/customers', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/roles', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const custData = await custRes.json();
      const rolesData = await rolesRes.json();
      setCustomers(custData.customers || []);
      setRoles(rolesData.roles || []);
    } catch (err) {
      console.error('Failed to load customers or roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
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
        await fetchData();
        setFeedback({ type: 'success', text: `Customer account ${nextStatus} successfully.` });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setStatusLoading(null);
    }
  };

  const openRoleModal = (customer) => {
    setRoleModalUser(customer);
    setSelectedRole(customer.role);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!roleModalUser || !selectedRole) return;

    setRoleUpdating(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/customers/${roleModalUser.id}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: selectedRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user role');

      setFeedback({
        type: 'success',
        text: `Role for ${roleModalUser.name} successfully updated to ${selectedRole.toUpperCase()}!`
      });
      setRoleModalUser(null);
      await fetchData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setRoleUpdating(false);
    }
  };

  const getRoleBadgeStyle = (roleId) => {
    const matched = roles.find((r) => r.id === roleId);
    if (matched) {
      const colorStyles = {
        purple: 'bg-pink-500/20 text-pink-400  -pink-500/40',
        amber: 'bg-amber-500/20 text-amber-400  ',
        emerald: 'bg-emerald-500/20 text-emerald-400  ',
        cyan: 'bg-sky-500/20 text-sky-400  ',
        indigo: 'bg-indigo-500/20 text-indigo-400  ',
        rose: 'bg-rose-500/20 text-rose-400  ',
        blue: 'bg-blue-500/20 text-blue-400  ',
        neutral: 'bg-white/10 text-neutral-300 '
      };
      if (colorStyles[matched.badge_color]) return colorStyles[matched.badge_color];
    }

    switch (roleId) {
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
        return 'bg-white/10 text-neutral-400 ';
    }
  };

  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case 'super_admin':
        return <Crown className="w-3.5 h-3.5 text-pink-400" />;
      case 'founder':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ticket_staff':
        return <LifeBuoy className="w-3.5 h-3.5 text-sky-400" />;
      case 'moderator':
        return <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return null;
    }
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
            ADMINISTRATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Customer & Staff Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Search, review, control account authorizations, and assign staff roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <Link
              to="/admin/roles"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bgborder border-[#C5F36A]/10 hover:bgborder border-[#C5F36A]/20 text-xs textborder border-[#C5F36A] font-bold transition"
            >
              <ShieldCheck className="w-4 h-4" />
              Manage Roles & Permissions
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl  text-xs flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10  text-emerald-400'
              : 'bg-red-500/10  text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <ShieldAlert className="w-4 h-4 flex-shrink-0" />}
            <span className="font-semibold">{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="hover:opacity-70 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full backdrop-blur-2xl rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              roleFilter === 'all'
                ? 'bg-white text-black font-extrabold'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All ({customers.length})
          </button>
          {roles.map((r) => {
            const count = customers.filter((c) => c.role === r.id).length;
            const isSelected = roleFilter === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRoleFilter(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bgborder border-[#C5F36A] text-black font-extrabold'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{r.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#0c140f]/5 border border-white/15 rounded-3xl backdrop-blur-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 border-b border-white/10 text-neutral-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4 pl-6">USER & EMAIL</th>
                <th className="p-4">ROLE & PRIVILEGES</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">ACTIVE SERVICES</th>
                <th className="p-4">ORDERS</th>
                <th className="p-4 pr-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 italic">
                    No accounts found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const roleObj = roles.find((r) => r.id === c.role);
                  const isCurrentSuperAdmin = c.id === currentUser?.id;

                  return (
                    <tr key={c.id} className="hover:bg-white/5 transition">
                      <td className="p-4 pl-6">
                        <div>
                          <p className="font-bold text-white flex items-center gap-1.5">
                            {c.name}
                            {isCurrentSuperAdmin && (
                              <span className="text-[9px] font-mono textborder border-[#C5F36A] bgborder border-[#C5F36A]/10 px-1.5 py-0.2 rounded">
                                (You)
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-mono">{c.email}</p>
                        </div>
                      </td>

                      {/* Role with Edit Action for Super Admin */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono uppercase font-bold tracking-wider ${getRoleBadgeStyle(
                              c.role
                            )}`}
                          >
                            {getRoleIcon(c.role)}
                            {roleObj?.name || c.role}
                          </span>

                          {isSuperAdmin && (
                            <button
                              onClick={() => openRoleModal(c)}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition"
                              title={`Edit role for ${c.name}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            c.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400  '
                              : 'bg-red-500/20 text-red-400  '
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
                        <div className="flex items-center justify-end gap-2">
                          {isSuperAdmin && (
                            <button
                              onClick={() => openRoleModal(c)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition"
                            >
                              Edit Role
                            </button>
                          )}

                          {c.role !== 'super_admin' && (
                            <button
                              onClick={() => handleToggleStatus(c)}
                              disabled={statusLoading === c.id}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                c.status === 'active'
                                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30  '
                                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30  '
                              }`}
                            >
                              {c.status === 'active' ? 'Suspend' : 'Reactivate'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit User Role */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c140f]/5 border border-white/15 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bgborder border-[#C5F36A]/10 textborder border-[#C5F36A]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Modify User Role</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Assign elevated staff privileges to this account.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRoleModalUser(null)}
                className="text-neutral-400 hover:text-white p-1.5 transition rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target User Details */}
            <div className="p-4 rounded-2xl bg-black/40 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{roleModalUser.name}</p>
                <p className="text-xs font-mono text-neutral-400">{roleModalUser.email}</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 font-mono uppercase block text-right">Current Role</span>
                <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${getRoleBadgeStyle(roleModalUser.role)}`}>
                  {roleModalUser.role}
                </span>
              </div>
            </div>

            {/* Role Options Form */}
            <form onSubmit={handleUpdateRole} className="space-y-4">
              <label className="text-xs font-bold text-white block">
                Select New Role:
              </label>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {roles.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-3.5 rounded-2xl  cursor-pointer transition flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bgborder border-[#C5F36A]/15 border border-[#C5F36A] text-white shadow-md'
                          : 'bg-black/30  text-neutral-400 hover:'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(r.id)}
                          <span className={`font-extrabold text-xs ${isSelected ? 'textborder border-[#C5F36A]' : 'text-white'}`}>
                            {r.name}
                          </span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${getRoleBadgeStyle(r.id)}`}>
                            {r.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          {r.description || 'Custom administrative role.'}
                        </p>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center flex-shrink-0  transition ${
                          isSelected
                            ? 'bgborder border-[#C5F36A] border border-[#C5F36A] text-black font-bold'
                            : ''
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roleUpdating || selectedRole === roleModalUser.role}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bgborder border-[#C5F36A] hover:bg-[#b2e057] text-black font-extrabold text-xs shadow-lg shadowborder border-[#C5F36A]/20 transition disabled:opacity-50"
                >
                  {roleUpdating && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Role Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
