'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  Shield,
  Building2,
  Clock,
  Settings,
  Activity,
  RefreshCw,
  Search,
  MoreVertical,
  Edit2,
  UserX,
  UserCheck,
  Trash2,
  Send,
  Lock,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { AdminRole, getRoleLabel, ROLES, ALL_ROLES } from '@/lib/rbac/roles';
import { can } from '@/lib/rbac/can';

export interface DepartmentItem {
  id: string;
  name: string;
  color: string;
  active: boolean;
  member_count?: number;
}

export interface TeamMemberItem {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  role: AdminRole;
  department_id?: string | null;
  department_name?: string | null;
  department_color?: string | null;
  is_active: boolean;
  status: 'active' | 'inactive' | 'suspended' | 'invited';
  created_at: string;
  updated_at?: string;
  created_by?: string | null;
}

export interface InvitationItem {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  department_id?: string | null;
  department_name?: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  created_at: string;
  expires_at: string;
}

export interface AuditLogItem {
  id: string;
  actor_id: string;
  actor_name?: string;
  target_type: string;
  action: string;
  old_data?: any;
  new_data?: any;
  created_at: string;
}

interface TeamManagementClientProps {
  initialMembers: TeamMemberItem[];
  initialInvitations: InvitationItem[];
  initialDepartments: DepartmentItem[];
  initialActivityLogs: AuditLogItem[];
  initialNewCount: number;
  adminName: string;
  adminEmail: string;
  adminRole: AdminRole;
}

export const TeamManagementClient: React.FC<TeamManagementClientProps> = ({
  initialMembers,
  initialInvitations,
  initialDepartments,
  initialActivityLogs,
  initialNewCount,
  adminName,
  adminEmail,
  adminRole = 'owner',
}) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'members' | 'invitations' | 'departments' | 'activity' | 'settings'>('members');

  const [members, setMembers] = useState<TeamMemberItem[]>(initialMembers);
  const [invitations, setInvitations] = useState<InvitationItem[]>(initialInvitations);
  const [departments, setDepartments] = useState<DepartmentItem[]>(initialDepartments);
  const [activityLogs, setActivityLogs] = useState<AuditLogItem[]>(initialActivityLogs);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('sales');
  const [inviteDept, setInviteDept] = useState<string>('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Department Modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptColor, setDeptColor] = useState('#F97316');
  const [savingDept, setSavingDept] = useState(false);
  const [deptError, setDeptError] = useState<string | null>(null);

  // Role Modal
  const [roleModalUser, setRoleModalUser] = useState<TeamMemberItem | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<AdminRole>('sales');
  const [changingRole, setChangingRole] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  // Status Modal (Suspend / Deactivate / Reactivate)
  const [statusModalUser, setStatusModalUser] = useState<TeamMemberItem | null>(null);
  const [targetStatus, setTargetStatus] = useState<'active' | 'inactive' | 'suspended'>('active');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Delete Modal (Owner Only)
  const [deleteModalUser, setDeleteModalUser] = useState<TeamMemberItem | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Mobile action dropdown menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    setMembers(initialMembers);
    setInvitations(initialInvitations);
    setDepartments(initialDepartments);
    setActivityLogs(initialActivityLogs);
  }, [initialMembers, initialInvitations, initialDepartments, initialActivityLogs]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q));

      const matchesRole = roleFilter === 'all' || m.role === roleFilter;
      const matchesDept = deptFilter === 'all' || m.department_id === deptFilter;
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchesSearch && matchesRole && matchesDept && matchesStatus;
    });
  }, [members, searchQuery, roleFilter, deptFilter, statusFilter]);

  // Invite submit
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);

    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError('Please fill in both Full Name and Email.');
      return;
    }

    setInviting(true);

    try {
      const res = await fetch('/api/admin/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole,
          departmentId: inviteDept || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send invitation.');
      }

      setInviteSuccess(data.message || `Invitation sent to ${inviteEmail.trim()}`);
      setInviteName('');
      setInviteEmail('');

      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(null);
        handleRefresh();
      }, 1500);
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invitation.');
    } finally {
      setInviting(false);
    }
  };

  // Save Department
  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeptError(null);

    if (!deptName.trim()) {
      setDeptError('Department name is required.');
      return;
    }

    setSavingDept(true);

    try {
      const res = await fetch('/api/admin/team/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDept?.id,
          name: deptName.trim(),
          color: deptColor,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save department.');
      }

      setShowDeptModal(false);
      setEditingDept(null);
      setDeptName('');
      handleRefresh();
    } catch (err: any) {
      setDeptError(err.message || 'Could not save department.');
    } finally {
      setSavingDept(false);
    }
  };

  // Change Role submit
  const handleChangeRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalUser) return;
    setRoleError(null);
    setChangingRole(true);

    try {
      const res = await fetch('/api/admin/team/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: roleModalUser.id,
          newRole: selectedNewRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to change role.');
      }

      setRoleModalUser(null);
      handleRefresh();
    } catch (err: any) {
      setRoleError(err.message || 'Could not update role.');
    } finally {
      setChangingRole(false);
    }
  };

  // Change Status submit
  const handleStatusSubmit = async () => {
    if (!statusModalUser) return;
    setStatusError(null);
    setUpdatingStatus(true);

    try {
      const res = await fetch('/api/admin/team/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: statusModalUser.id,
          status: targetStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update status.');
      }

      setStatusModalUser(null);
      handleRefresh();
    } catch (err: any) {
      setStatusError(err.message || 'Could not update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete User submit (Owner Only)
  const handleDeleteSubmit = async () => {
    if (!deleteModalUser) return;
    setDeleteError(null);
    setDeletingUser(true);

    try {
      const res = await fetch('/api/admin/team/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: deleteModalUser.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete team member.');
      }

      setDeleteModalUser(null);
      handleRefresh();
    } catch (err: any) {
      setDeleteError(err.message || 'Could not delete team member.');
    } finally {
      setDeletingUser(false);
    }
  };

  // Resend invitation
  const handleResendInvite = async (invId: string, email: string) => {
    try {
      const res = await fetch('/api/admin/team/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId: invId, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to resend invitation.');
      } else {
        alert(`Invitation resent to ${email}`);
        handleRefresh();
      }
    } catch (err: any) {
      alert(err.message || 'Could not resend invitation.');
    }
  };

  const getRoleBadge = (role: AdminRole) => {
    const roleDef = ROLES[role] || { label: role, color: '#64748B' };
    return (
      <span
        className="px-2.5 py-1 text-xs font-bold rounded-full font-mono flex items-center gap-1 w-fit"
        style={{
          backgroundColor: `${roleDef.color}15`,
          color: roleDef.color,
          border: `1px solid ${roleDef.color}30`,
        }}
      >
        {role === 'owner' && <Shield className="w-3 h-3 text-purple-600" />}
        <span>{roleDef.label.toUpperCase()}</span>
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 font-mono">
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 font-mono">
            Inactive
          </span>
        );
      case 'suspended':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 font-mono">
            Suspended
          </span>
        );
      case 'invited':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 font-mono">
            Invited
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 font-mono">
            {status}
          </span>
        );
    }
  };

  return (
    <AdminLayout
      initialNewCount={initialNewCount}
      adminName={adminName}
      adminEmail={adminEmail}
      adminRole={adminRole}
    >
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy font-heading flex items-center gap-2">
              <Users className="w-7 h-7 text-brand-orange" />
              <span>Team Management</span>
            </h1>
            <p className="text-sm text-brand-muted mt-1">
              Enterprise Role-Based Access Control, Departments & Staff Directory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-brand-border text-brand-navy hover:bg-brand-warm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50"
              title="Refresh Team Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-orange' : ''}`} />
            </button>

            {can(adminRole, 'team.invite') && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setInviteError(null);
                  setInviteSuccess(null);
                  setShowInviteModal(true);
                }}
                icon={<UserPlus className="w-4 h-4" />}
              >
                Invite Member
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-brand-border/60 overflow-x-auto no-scrollbar gap-2 pb-1">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-navy hover:bg-brand-warm'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invitations')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'invitations'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-navy hover:bg-brand-warm'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Invitations ({invitations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('departments')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'departments'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-navy hover:bg-brand-warm'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Departments ({departments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-navy hover:bg-brand-warm'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Audit Logs ({activityLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-navy hover:bg-brand-warm'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* TAB 1: MEMBERS */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-brand-border/60 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="flex-1 relative min-w-[240px]">
                <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border text-xs font-medium outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-brand-border text-xs font-medium text-brand-navy outline-none bg-white cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  {ALL_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>

                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-brand-border text-xs font-medium text-brand-navy outline-none bg-white cursor-pointer"
                >
                  <option value="all">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-brand-border text-xs font-medium text-brand-navy outline-none bg-white cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="invited">Invited</option>
                </select>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl border border-brand-border/60 shadow-card overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-soft-navy/50 border-b border-brand-border/60 text-xs font-bold text-brand-navy uppercase tracking-wider font-mono">
                    <th className="py-4 px-6">Member</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Joined</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 font-medium text-brand-navy">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-brand-warm/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-sm uppercase">
                            {m.full_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-brand-navy font-heading">{m.full_name}</div>
                            <div className="text-xs text-brand-muted font-mono">{m.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">{getRoleBadge(m.role)}</td>

                      <td className="py-4 px-6 text-xs font-semibold text-brand-navy">
                        {m.department_name ? (
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: `${m.department_color || '#F97316'}15`,
                              color: m.department_color || '#F97316',
                            }}
                          >
                            {m.department_name}
                          </span>
                        ) : (
                          <span className="text-brand-muted font-mono text-[11px]">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6">{getStatusBadge(m.status)}</td>

                      <td className="py-4 px-6 text-xs text-brand-muted font-mono">
                        {new Date(m.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {/* Action buttons based on permissions */}
                        <div className="flex items-center justify-end gap-2">
                          {can(adminRole, 'team.role.change', m.role) && (
                            <button
                              onClick={() => {
                                setRoleModalUser(m);
                                setSelectedNewRole(m.role);
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-brand-navy hover:text-brand-orange border border-brand-border rounded-lg transition-colors"
                            >
                              Role
                            </button>
                          )}

                          {can(adminRole, 'team.deactivate', m.role) && (
                            <button
                              onClick={() => {
                                setStatusModalUser(m);
                                setTargetStatus(m.status === 'active' ? 'suspended' : 'active');
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-brand-navy hover:text-amber-600 border border-brand-border rounded-lg transition-colors"
                            >
                              {m.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          )}

                          {can(adminRole, 'team.delete', m.role) && (
                            <button
                              onClick={() => setDeleteModalUser(m)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-3">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl p-5 border border-brand-border/60 shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-sm uppercase">
                        {m.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-navy font-heading">{m.full_name}</h3>
                        <p className="text-xs text-brand-muted font-mono">{m.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(m.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-brand-border/40">
                    <div>{getRoleBadge(m.role)}</div>
                    <span className="font-semibold text-brand-muted">{m.department_name || 'General'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INVITATIONS */}
        {activeTab === 'invitations' && (
          <div className="bg-white rounded-3xl border border-brand-border/60 shadow-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-brand-navy font-heading">Pending & Historic Invitations</h2>
            {invitations.length === 0 ? (
              <p className="text-xs text-brand-muted py-6 text-center">No active or pending team invitations.</p>
            ) : (
              <div className="space-y-3">
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-brand-border/60 bg-brand-warm/30"
                  >
                    <div>
                      <div className="font-bold text-brand-navy font-heading">{inv.full_name}</div>
                      <div className="text-xs text-brand-muted font-mono">{inv.email}</div>
                      <div className="text-[11px] text-brand-muted mt-1">
                        Role: <span className="font-bold uppercase">{inv.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 font-mono">
                        {inv.status.toUpperCase()}
                      </span>
                      {can(adminRole, 'team.invite') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvite(inv.id, inv.email)}
                        >
                          Resend
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-navy font-heading">Enterprise Departments</h2>
              {can(adminRole, 'team.department.change') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEditingDept(null);
                    setDeptName('');
                    setDeptColor('#F97316');
                    setShowDeptModal(true);
                  }}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Department
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="bg-white rounded-2xl p-5 border border-brand-border/60 shadow-card flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <h3 className="font-bold text-brand-navy font-heading">{dept.name}</h3>
                    </div>
                    <p className="text-xs text-brand-muted">
                      {members.filter((m) => m.department_id === dept.id).length} Active Members
                    </p>
                  </div>

                  {can(adminRole, 'team.department.change') && (
                    <button
                      onClick={() => {
                        setEditingDept(dept);
                        setDeptName(dept.name);
                        setDeptColor(dept.color);
                        setShowDeptModal(true);
                      }}
                      className="p-2 text-brand-muted hover:text-brand-navy hover:bg-brand-warm rounded-xl transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT ACTIVITY LOGS */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-3xl border border-brand-border/60 shadow-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-brand-navy font-heading">Security Audit Logs</h2>
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-brand-border/40 bg-brand-soft-navy/30 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-brand-navy uppercase font-mono mr-2">
                      {log.action}
                    </span>
                    <span className="text-brand-muted">Target: {log.target_type}</span>
                  </div>
                  <span className="text-brand-muted font-mono text-[11px]">
                    {new Date(log.created_at).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-brand-border/60 shadow-card p-6 space-y-4 max-w-xl">
            <h2 className="text-lg font-bold text-brand-navy font-heading">Team Security Settings</h2>
            <p className="text-xs text-brand-muted">
              Configure session durations, multi-factor authentication requirements, and role assignment boundaries.
            </p>
            <div className="p-4 rounded-2xl bg-brand-warm border border-brand-border/60 text-xs space-y-2">
              <div className="font-bold text-brand-navy">Owner Authority Protection</div>
              <p className="text-brand-muted">
                Admins and lower roles are strictly prohibited from changing Owner credentials, deleting Owners, or demoting Owner roles.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: INVITE MEMBER */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-brand-navy font-heading flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-orange" />
                <span>Invite Team Member</span>
              </h2>
              <button onClick={() => setShowInviteModal(false)} className="text-brand-muted hover:text-brand-navy">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              {inviteError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}

              {inviteSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{inviteSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@friendlitripz.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Assigned Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange bg-white cursor-pointer"
                >
                  {ALL_ROLES.filter((r) => can(adminRole, 'team.invite', r.id)).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} — {r.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Department
                </label>
                <select
                  value={inviteDept}
                  onChange={(e) => setInviteDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange bg-white cursor-pointer"
                >
                  <option value="">No Department (General)</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={inviting}>
                  {inviting ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DEPARTMENT ADD/EDIT */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-4">
            <h2 className="text-lg font-bold text-brand-navy font-heading">
              {editingDept ? 'Edit Department' : 'Add New Department'}
            </h2>
            <form onSubmit={handleSaveDepartment} className="space-y-4">
              {deptError && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold">{deptError}</div>}
              <div>
                <label className="block text-xs font-bold text-brand-navy uppercase mb-1 font-mono">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy uppercase mb-1 font-mono">
                  Badge Color
                </label>
                <input
                  type="color"
                  value={deptColor}
                  onChange={(e) => setDeptColor(e.target.value)}
                  className="w-full h-10 rounded-xl cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowDeptModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={savingDept}>
                  Save Department
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE ROLE */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-4">
            <h2 className="text-lg font-bold text-brand-navy font-heading">
              Change Role for {roleModalUser.full_name}
            </h2>
            <form onSubmit={handleChangeRoleSubmit} className="space-y-4">
              {roleError && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold">{roleError}</div>}
              <select
                value={selectedNewRole}
                onChange={(e) => setSelectedNewRole(e.target.value as AdminRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium outline-none"
              >
                {ALL_ROLES.filter((r) => can(adminRole, 'team.role.change', r.id)).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label} — {r.description}
                  </option>
                ))}
              </select>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setRoleModalUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={changingRole}>
                  Update Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE USER (Owner Only) */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-red-600 mx-auto" />
            <h2 className="text-lg font-bold text-brand-navy font-heading">
              Delete {deleteModalUser.full_name}?
            </h2>
            <p className="text-xs text-brand-muted">
              This action permanently deletes the user account and profile. This cannot be undone.
            </p>
            {deleteError && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold">{deleteError}</div>}
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeleteModalUser(null)}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={deletingUser}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-button transition-colors disabled:opacity-50"
              >
                {deletingUser ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
