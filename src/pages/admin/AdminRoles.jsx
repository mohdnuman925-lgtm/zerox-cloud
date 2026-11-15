import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Users,
  Check,
  AlertTriangle,
  X,
  Sparkles,
  LifeBuoy,
  Crown,
  Key,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';

const COLOR_PRESETS = [
  { id: 'purple', name: 'Pink / Purple', text: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.35)', badgeClass: 'bg-pink-500/20 text-pink-400 border border-pink-500/40' },
  { id: 'amber', name: 'Gold / Amber', text: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)', badgeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/40' },
  { id: 'emerald', name: 'Emerald / Green', text: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.35)', badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' },
  { id: 'cyan', name: 'Cyan / Sky Blue', text: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.35)', badgeClass: 'bg-sky-500/20 text-sky-400 border border-sky-500/40' },
  { id: 'indigo', name: 'Indigo / Violet', text: '#818CF8', bg: 'rgba(129, 140, 248, 0.15)', border: 'rgba(129, 140, 248, 0.35)', badgeClass: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' },
  { id: 'rose', name: 'Rose / Crimson', text: '#F43F5E', bg: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.35)', badgeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/40' },
  { id: 'blue', name: 'Cobalt / Blue', text: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', border: 'rgba(96, 165, 250, 0.35)', badgeClass: 'bg-blue-500/20 text-blue-400 border border-blue-500/40' },
  { id: 'neutral', name: 'Neutral / Slate', text: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)', border: 'rgba(156, 163, 175, 0.35)', badgeClass: 'bg-white/10 text-neutral-300 border border-white/20' }
];

const AVAILABLE_PERMISSIONS = [
  { key: 'all', label: 'Full System Access', desc: 'Unrestricted control over every section, server, database, and setting.' },
  { key: 'manage_tickets', label: 'Support Desk & Tickets', desc: 'View customer tickets, post staff replies, and add internal notes.' },
  { key: 'manage_servers', label: 'Server & Power Controls', desc: 'Start, stop, restart, terminate, and modify customer servers.' },
  { key: 'manage_nodes', label: 'Node & Wings Infrastructure', desc: 'Create, monitor, set resource limits, and edit cluster nodes.' },
  { key: 'manage_customers', label: 'Customer Management', desc: 'View customer directory, check services, and suspend/reactivate accounts.' },
  { key: 'manage_roles', label: 'Role & Staff Assignment', desc: 'Create roles and assign staff authorizations (Super Admin only).' },
  { key: 'manage_billing', label: 'Plans, Orders & Coupons', desc: 'Create hosting plans, manage customer orders, and issue discount coupons.' },
  { key: 'manage_content', label: 'Website CMS & Settings', desc: 'Edit website announcements, contact emails, and hero content.' },
  { key: 'view_audit_logs', label: 'Security & Audit Logs', desc: 'Inspect timestamped staff actions and security event records.' }
];

export const AdminRoles = () => {
  const { token, isSuperAdmin, user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [deleteConfirmRole, setDeleteConfirmRole] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState('purple');
  const [formPermissions, setFormPermissions] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, customersRes] = await Promise.all([
        fetch('/api/admin/roles', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/customers', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const rolesData = await rolesRes.json();
      const customersData = await customersRes.json();
      setRoles(rolesData.roles || []);
      setCustomers(customersData.customers || []);
    } catch (err) {
      console.error('Failed to load roles data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const openCreateModal = () => {
    setEditingRole(null);
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setFormColor('purple');
    setFormPermissions(['manage_tickets']);
    setModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setFormName(role.name);
    setFormSlug(role.id);
    setFormDesc(role.description || '');
    setFormColor(role.badge_color || 'purple');
    setFormPermissions(role.permissions || []);
    setModalOpen(true);
  };

  const handleSlugify = (name) => {
    if (!editingRole) {
      const slug = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      setFormSlug(slug);
    }
  };

  const togglePermission = (key) => {
    if (key === 'all') {
      if (formPermissions.includes('all')) {
        setFormPermissions([]);
      } else {
        setFormPermissions(['all']);
      }
      return;
    }

    if (formPermissions.includes('all')) {
      setFormPermissions([key]);
      return;
    }

    if (formPermissions.includes(key)) {
      setFormPermissions(formPermissions.filter((p) => p !== key));
    } else {
      setFormPermissions([...formPermissions, key]);
    }
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFeedback({ type: 'error', text: 'Role name is required.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      if (editingRole) {
        // PUT update
        const res = await fetch(`/api/admin/roles/${editingRole.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formName.trim(),
            description: formDesc.trim(),
            badge_color: formColor,
            permissions: formPermissions
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update role');

        setFeedback({ type: 'success', text: `Role '${formName}' updated successfully!` });
        setModalOpen(false);
        await fetchData();
      } else {
        // POST create
        const res = await fetch('/api/admin/roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            id: formSlug.trim() || undefined,
            name: formName.trim(),
            description: formDesc.trim(),
            badge_color: formColor,
            permissions: formPermissions
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create role');

        setFeedback({ type: 'success', text: `Role '${formName}' created successfully!` });
        setModalOpen(false);
        await fetchData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteConfirmRole) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/roles/${deleteConfirmRole.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete role');

      setFeedback({ type: 'success', text: `Role '${deleteConfirmRole.name}' deleted successfully.` });
      setDeleteConfirmRole(null);
      await fetchData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const getPresetBadgeStyle = (colorId) => {
    const found = COLOR_PRESETS.find((c) => c.id === colorId);
    return found ? found.badgeClass : 'bg-[#C5F36A]/20 text-[#C5F36A] border border-[#C5F36A]/40';
  };

  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-pink-400" />;
      case 'founder':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'ticket_staff':
        return <LifeBuoy className="w-4 h-4 text-sky-400" />;
      case 'moderator':
        return <ShieldAlert className="w-4 h-4 text-indigo-400" />;
      default:
        return <Key className="w-4 h-4 text-[#C5F36A]" />;
    }
  };

  const staffCount = customers.filter((c) => c.role !== 'customer').length;
  const superAdminCount = customers.filter((c) => c.role === 'super_admin').length;
  const founderCount = customers.filter((c) => c.role === 'founder').length;
  const ticketStaffCount = customers.filter((c) => c.role === 'ticket_staff').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              ACCESS CONTROL
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-pink-500/20 text-pink-400 border border-pink-500/30 font-bold uppercase">
              SUPER ADMIN EXCLUSIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Roles & Staff Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Define custom administrative roles (Founder, Ticket Staff, etc.), set granular permissions, and control team privileges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white border border-white/10 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {isSuperAdmin && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5F36A] hover:bg-[#b2e057] text-black font-extrabold text-xs shadow-lg shadow-[#C5F36A]/20 transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Create New Role
            </button>
          )}
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            <span className="font-semibold">{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="hover:opacity-70 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl">
          <p className="text-[10px] font-mono text-neutral-400 uppercase font-bold tracking-wider">Total Defined Roles</p>
          <p className="text-2xl font-black text-white mt-1">{roles.length}</p>
          <span className="text-[10px] text-neutral-500 mt-0.5 block">Configured in system</span>
        </div>
        <div className="p-5 rounded-2xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl">
          <p className="text-[10px] font-mono text-neutral-400 uppercase font-bold tracking-wider">Active Staff Members</p>
          <p className="text-2xl font-black text-[#C5F36A] mt-1">{staffCount}</p>
          <span className="text-[10px] text-neutral-500 mt-0.5 block">Elevated user accounts</span>
        </div>
        <div className="p-5 rounded-2xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl">
          <p className="text-[10px] font-mono text-neutral-400 uppercase font-bold tracking-wider">Founders & Super Admins</p>
          <p className="text-2xl font-black text-pink-400 mt-1">{superAdminCount + founderCount}</p>
          <span className="text-[10px] text-neutral-500 mt-0.5 block">{founderCount} Founders, {superAdminCount} Super Admin</span>
        </div>
        <div className="p-5 rounded-2xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl">
          <p className="text-[10px] font-mono text-neutral-400 uppercase font-bold tracking-wider">Ticket Staff Agents</p>
          <p className="text-2xl font-black text-sky-400 mt-1">{ticketStaffCount}</p>
          <span className="text-[10px] text-neutral-500 mt-0.5 block">Support desk operators</span>
        </div>
      </div>

      {/* Roles Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#C5F36A]" />
            Active Platform Roles
          </h2>
          <Link
            to="/admin/customers"
            className="text-xs text-[#C5F36A] hover:underline font-bold flex items-center gap-1"
          >
            Assign Roles to Users in Customers →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((role) => {
            const roleUsers = customers.filter((c) => c.role === role.id);
            const isSystem = Boolean(role.is_system);

            return (
              <div
                key={role.id}
                className="rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-xl relative group"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                        {getRoleIcon(role.id)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                          {role.name}
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-500">
                          id: <code className="text-neutral-400">{role.id}</code>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${getPresetBadgeStyle(
                        role.badge_color
                      )}`}
                    >
                      {role.name}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {role.description || 'Custom platform role with assigned permissions.'}
                  </p>

                  {/* Members count badge */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 text-xs font-semibold text-neutral-300">
                      <Users className="w-3.5 h-3.5 text-[#C5F36A]" />
                      <span>{roleUsers.length} Assigned</span>
                    </div>

                    {isSystem ? (
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase px-2 py-0.5 rounded bg-white/5 border border-white/5">
                        Built-in System
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        Custom Role
                      </span>
                    )}
                  </div>

                  {/* Assigned Members Preview */}
                  {roleUsers.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Members with this role:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {roleUsers.slice(0, 4).map((u) => (
                          <span
                            key={u.id}
                            className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-neutral-300 font-medium"
                          >
                            {u.name}
                          </span>
                        ))}
                        {roleUsers.length > 4 && (
                          <span className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-[#C5F36A] font-bold">
                            +{roleUsers.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Permissions Pills */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Privileges:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions && role.permissions.includes('all') ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                          ALL SYSTEM PERMISSIONS
                        </span>
                      ) : role.permissions && role.permissions.length > 0 ? (
                        role.permissions.map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 font-mono text-[9.5px] border border-white/5"
                          >
                            {p.replace('manage_', '')}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-neutral-500 italic">No administrative privileges</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                {isSuperAdmin && (
                  <div className="flex items-center justify-end gap-2 pt-5 mt-4 border-t border-white/10">
                    <button
                      onClick={() => openEditModal(role)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white border border-white/10 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Role
                    </button>

                    {!isSystem && (
                      <button
                        onClick={() => setDeleteConfirmRole(role)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 hover:text-red-300 border border-red-500/20 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Create / Edit Role */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#C5F36A]/10 text-[#C5F36A] border border-[#C5F36A]/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Role'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Configure staff badge design and specify permitted platform controls.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1.5 transition rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveRole} className="space-y-5 text-xs">
              {/* Role Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-white block">Role Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    handleSlugify(e.target.value);
                  }}
                  placeholder="e.g. Founder, Ticket Staff, Senior Mod"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A]"
                />
              </div>

              {/* Role ID / Slug */}
              <div className="space-y-1.5">
                <label className="font-bold text-white block flex items-center justify-between">
                  <span>Role Identifier Slug *</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Lowercase and underscores</span>
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                  placeholder="e.g. founder, ticket_staff"
                  disabled={Boolean(editingRole)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A] disabled:opacity-50"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-white block">Description</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Summarize the core responsibilities and authority of this role..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5F36A]"
                />
              </div>

              {/* Color Preset & Badge Preview */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white block">Badge Color Theme</label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400">Live Preview:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${getPresetBadgeStyle(
                        formColor
                      )}`}
                    >
                      {formName.trim() || 'SAMPLE BADGE'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((color) => {
                    const isSelected = formColor === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setFormColor(color.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
                          isSelected
                            ? 'bg-white/15 border-[#C5F36A] shadow-md'
                            : 'bg-black/30 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color.text }}
                        />
                        <span className="text-[11px] font-semibold text-neutral-200 truncate">
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white block">Granted Permissions</label>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {formPermissions.includes('all') ? 'All access enabled' : `${formPermissions.length} selected`}
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = formPermissions.includes('all') || formPermissions.includes(perm.key);
                    const isAllOption = perm.key === 'all';

                    return (
                      <div
                        key={perm.key}
                        onClick={() => togglePermission(perm.key)}
                        className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                          isChecked
                            ? 'bg-[#C5F36A]/10 border-[#C5F36A]/30 text-white'
                            : 'bg-black/30 border-white/5 text-neutral-400 hover:border-white/10'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center flex-shrink-0 transition ${
                            isChecked
                              ? 'bg-[#C5F36A] text-black font-bold'
                              : 'border border-white/20 bg-black/40'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`font-bold text-xs ${isChecked ? 'text-white' : 'text-neutral-300'}`}>
                            {perm.label}
                            {isAllOption && (
                              <span className="ml-2 text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                Unrestricted
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-neutral-500 leading-tight">{perm.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit / Cancel */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C5F36A] hover:bg-[#b2e057] text-black font-extrabold text-xs shadow-lg shadow-[#C5F36A]/20 transition disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {editingRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteConfirmRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Delete Role</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete the <strong className="text-white">'{deleteConfirmRole.name}'</strong> role?
            </p>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
              ⚠️ Any staff accounts currently assigned to this role will automatically revert back to standard <strong>Customer</strong> role.
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmRole(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRole}
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs transition shadow-lg shadow-red-500/20"
              >
                {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
