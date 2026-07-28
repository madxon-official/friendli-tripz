'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  Shield,
  Building2,
  Activity,
  RefreshCw,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Send,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Crown,
  Briefcase,
  ArrowRightLeft,
  Lock,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
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
  last_sign_in_at?: string | null;
  assigned_enquiries_count?: number;
}

export interface InvitationItem {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  department_id?: string | null;
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
  currentUserId: string;
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
  currentUserId,
  adminName,
  adminEmail,
  adminRole = 'owner',
}) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'members' | 'invitations' | 'departments' | 'activity'>('members');

  const [members, setMembers] = useState<TeamMemberItem[]>(initialMembers);
  const [invitations, setInvitations] = useState<InvitationItem[]>(initialInvitations);
  const [departments, setDepartments] = useState<DepartmentItem[]>(initialDepartments);
  const [activityLogs, setActivityLogs] = useState<AuditLogItem[]>(initialActivityLogs);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
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

  // Transfer Ownership Modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [targetAdminId, setTargetAdminId] = useState<string>('');
  const [confirmText, setConfirmText] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

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

  // Status Modal
  const [statusModalUser, setStatusModalUser] = useState<TeamMemberItem | null>(null);
  const [targetStatus, setTargetStatus] = useState<'active' | 'inactive' | 'suspended'>('active');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Delete Modal
  const [deleteModalUser, setDeleteModalUser] = useState<TeamMemberItem | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  // Invite member submit
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);

    if (inviteRole === 'owner') {
      setInviteError('Owner role cannot be invited. Use Transfer Ownership.');
      return;
    }

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

  // Transfer Ownership submit
  const handleTransferOwnershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    if (!targetAdminId) {
      setTransferError('Please select an active Admin to receive ownership.');
      return;
    }

    if (confirmText.trim().toLowerCase() !== 'transfer') {
      setTransferError('Please type "TRANSFER" in all caps to confirm.');
      return;
    }

    setTransferring(true);

    try {
      const res = await fetch('/api/admin/team/transfer-ownership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAdminId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Transfer ownership failed.');
      }

      setShowTransferModal(false);
      alert(data.message || 'Ownership transferred successfully!');
      handleRefresh();
    } catch (err: any) {
      setTransferError(err.message || 'Could not transfer ownership.');
    } finally {
      setTransferring(false);
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

    if (selectedNewRole === 'owner') {
      setRoleError('Owner role cannot be assigned via role edit. Use Transfer Ownership.');
      return;
    }

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

    if (deleteModalUser.id === currentUserId) {
      setDeleteError('You cannot delete your own account.');
      return;
    }

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

  // Exact Role Badges requested
  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'owner':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono flex items-center gap-1 w-fit shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>OWNER</span>
          </span>
        );
      case 'admin':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-900 border border-orange-300 font-mono w-fit">
            ADMIN
          </span>
        );
      case 'operations':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-mono w-fit">
            OPERATIONS
          </span>
        );
      case 'sales':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono w-fit">
            SALES
          </span>
        );
      case 'support':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-900 border border-purple-300 font-mono w-fit">
            SUPPORT
          </span>
        );
      case 'viewer':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-300 font-mono w-fit">
            VIEWER
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 font-mono w-fit">
            {role}
          </span>
        );
    }
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

  const activeAdminsForTransfer = members.filter((m) => m.role === 'admin' && m.is_active);

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
              Enterprise Access Control, Departments & Staff Directory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-brand-border text-brand-navy hover:bg-brand-warm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50"
              title="Refresh Team Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-orange' : ''}`} />
            </button>

            {adminRole === 'owner' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTransferError(null);
                  setConfirmText('');
                  setTargetAdminId('');
                  setShowTransferModal(true);
                }}
                icon={<ArrowRightLeft className="w-4 h-4 text-amber-600" />}
              >
                Transfer Ownership
              </Button>
            )}

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
        </div>

        {/* TAB 1: MEMBERS TABLE */}
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

            {/* Comprehensive Enterprise Table View */}
            <div className="hidden xl:block bg-white rounded-3xl border border-brand-border/60 shadow-card overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-soft-navy/50 border-b border-brand-border/60 text-xs font-bold text-brand-navy uppercase tracking-wider font-mono">
                    <th className="py-4 px-6">Avatar</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Phone</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Assigned Leads</th>
                    <th className="py-4 px-6">Joined / Login</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 font-medium text-brand-navy">
                  {filteredMembers.map((m) => {
                    const isSelf = m.id === currentUserId;
                    const isTargetOwner = m.role === 'owner';
                    const isAdminUser = adminRole === 'admin';

                    return (
                      <tr key={m.id} className="hover:bg-brand-warm/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="relative w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs">
                            {m.full_name.charAt(0)}
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                m.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            />
                          </div>
                        </td>

                        <td className="py-4 px-6 font-bold text-brand-navy font-heading">
                          {m.full_name}
                          {isSelf && <span className="ml-1.5 text-[10px] text-brand-orange font-mono font-bold">(You)</span>}
                        </td>

                        <td className="py-4 px-6 font-mono text-xs text-brand-muted">{m.email}</td>

                        <td className="py-4 px-6 font-mono text-xs text-brand-muted">{m.phone || '—'}</td>

                        <td className="py-4 px-6 text-xs font-semibold">
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
                            <span className="text-brand-muted font-mono text-[11px]">General</span>
                          )}
                        </td>

                        <td className="py-4 px-6">{getRoleBadge(m.role)}</td>

                        <td className="py-4 px-6">{getStatusBadge(m.status)}</td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-brand-soft-navy text-brand-navy font-mono">
                            <Briefcase className="w-3 h-3 text-brand-orange" />
                            <span>{m.assigned_enquiries_count || 0}</span>
                          </span>
                        </td>

                        <td className="py-4 px-6 text-xs text-brand-muted font-mono">
                          {new Date(m.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* OWNER ON SELF ACTIONS */}
                            {isSelf && isTargetOwner && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setTransferError(null);
                                  setConfirmText('');
                                  setTargetAdminId('');
                                  setShowTransferModal(true);
                                }}
                              >
                                Transfer Ownership
                              </Button>
                            )}

                            {/* ADMIN LOOKING AT OWNER: READ-ONLY PROTECTED BADGE */}
                            {isAdminUser && isTargetOwner && (
                              <span className="text-[11px] font-mono text-brand-muted italic flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-600" />
                                <span>Owner Protected</span>
                              </span>
                            )}

                            {/* Standard non-self Actions for Owner & Admin */}
                            {!isSelf && (!isTargetOwner || adminRole === 'owner') && (
                              <>
                                {can(adminRole, 'team.role.change', m.role) && !isTargetOwner && (
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

                                {can(adminRole, 'team.deactivate', m.role) && !isTargetOwner && (
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

                                {can(adminRole, 'team.delete', m.role) && !isTargetOwner && (
                                  <button
                                    onClick={() => setDeleteModalUser(m)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Member"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card Layout */}
            <div className="xl:hidden space-y-3">
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
                    <span className="font-semibold text-brand-navy">{m.department_name || 'General'}</span>
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
      </div>

      {/* MODAL: TRANSFER OWNERSHIP (Owner Only) */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-5">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <h2 className="text-xl font-black text-brand-navy font-heading flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>Transfer Ownership</span>
              </h2>
              <button onClick={() => setShowTransferModal(false)} className="text-brand-muted hover:text-brand-navy">
                ✕
              </button>
            </div>

            <form onSubmit={handleTransferOwnershipSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Important Single Owner Warning</span>
                </div>
                <p className="leading-relaxed">
                  Transferring ownership will appoint the selected Admin as the new Owner and convert your account into an Admin. This transaction is permanent.
                </p>
              </div>

              {transferError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold">{transferError}</div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">
                  Select New Owner (Active Admins Only)
                </label>
                <select
                  required
                  value={targetAdminId}
                  onChange={(e) => setTargetAdminId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs sm:text-sm font-bold text-brand-navy outline-none focus:border-brand-orange bg-white cursor-pointer"
                >
                  <option value="">Choose active Admin...</option>
                  {activeAdminsForTransfer.map((adm) => (
                    <option key={adm.id} value={adm.id}>
                      {adm.full_name} ({adm.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">
                  Type &quot;TRANSFER&quot; to Confirm
                </label>
                <input
                  type="text"
                  required
                  placeholder="TRANSFER"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-brand-navy outline-none font-mono focus:border-brand-orange"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowTransferModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={transferring || activeAdminsForTransfer.length === 0}>
                  {transferring ? 'Transferring...' : 'Transfer Ownership'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INVITE MEMBER (Owner & Admin) */}
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
                  Assigned Role (Owner excluded)
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange bg-white cursor-pointer"
                >
                  {ALL_ROLES.filter((r) => r.id !== 'owner' && can(adminRole, 'team.invite', r.id)).map((r) => (
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium outline-none cursor-pointer"
              >
                {ALL_ROLES.filter((r) => r.id !== 'owner' && can(adminRole, 'team.role.change', r.id)).map((r) => (
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

      {/* MODAL: STATUS UPDATE */}
      {statusModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-4">
            <h2 className="text-lg font-bold text-brand-navy font-heading">
              Update Status for {statusModalUser.full_name}
            </h2>
            {statusError && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold">{statusError}</div>}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-navy font-mono uppercase">Target Status</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium outline-none cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setStatusModalUser(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" disabled={updatingStatus} onClick={handleStatusSubmit}>
                Confirm Status Change
              </Button>
            </div>
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
