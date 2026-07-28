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
  Edit2,
  Trash2,
  Send,
  Plus,
  AlertCircle,
  CheckCircle2,
  Crown,
  Briefcase,
  ArrowRightLeft,
  Lock,
  Phone,
  MessageSquare,
  Copy,
  X,
  UserCheck,
  UserX,
  Archive,
  Eye,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { AdminRole, getRoleLabel, ROLES, ALL_ROLES } from '@/lib/rbac/roles';
import { can } from '@/lib/rbac/can';
import { getRolePermissions } from '@/lib/rbac/permissions';

export interface DepartmentItem {
  id: string;
  name: string;
  color: string;
  active: boolean;
  manager_id?: string | null;
  manager_name?: string | null;
  total_members?: number;
  active_members?: number;
  pending_members?: number;
  suspended_members?: number;
  archived_members?: number;
  pending_invitations_count?: number;
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
  status: 'pending' | 'active' | 'suspended' | 'archived';
  created_at: string;
  joined_at?: string | null;
  last_sign_in_at?: string | null;
  created_by?: string | null;
  assigned_enquiries_count?: number;
  employee_id?: string | null;
  emergency_contact?: string | null;
}

export interface InvitationItem {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: AdminRole;
  department_id?: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  created_at: string;
  expires_at: string;
  accepted_at?: string | null;
  invited_by?: string | null;
}

export interface AuditLogItem {
  id: string;
  actor_id: string;
  actor_name?: string;
  target_type: string;
  target_id?: string | null;
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

  // Member Detail Drawer State
  const [selectedMember, setSelectedMember] = useState<TeamMemberItem | null>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'permissions' | 'leads' | 'timeline' | 'audit' | 'settings'>('overview');

  // Modals state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('sales');
  const [inviteDept, setInviteDept] = useState<string>('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Edit Member Modal
  const [editModalUser, setEditModalUser] = useState<TeamMemberItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editRole, setEditRole] = useState<AdminRole>('sales');
  const [editStatus, setEditStatus] = useState<'pending' | 'active' | 'suspended' | 'archived'>('active');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Assign Manager Modal
  const [managerDept, setManagerDept] = useState<DepartmentItem | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [savingManager, setSavingManager] = useState(false);
  const [managerError, setManagerError] = useState<string | null>(null);

  // Transfer Ownership Modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [targetAdminId, setTargetAdminId] = useState<string>('');
  const [confirmText, setConfirmText] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  // Department Add/Edit Modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptColor, setDeptColor] = useState('#F97316');
  const [savingDept, setSavingDept] = useState(false);
  const [deptError, setDeptError] = useState<string | null>(null);

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

  // Phone display formatter (+91 98765 43210)
  const formatPhoneDisplay = (phoneRaw?: string | null) => {
    if (!phoneRaw) return '—';
    const digits = phoneRaw.replace(/\D/g, '');
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    if (digits.length === 12 && digits.startsWith('91')) {
      return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
    }
    return phoneRaw;
  };

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

    if (!inviteDept) {
      setInviteError('Please select a Department for the invited member.');
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
          phone: invitePhone.trim() || null,
          role: inviteRole,
          departmentId: inviteDept,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send invitation.');
      }

      setInviteSuccess(data.message || `Invitation sent to ${inviteEmail.trim()}`);
      setInviteName('');
      setInviteEmail('');
      setInvitePhone('');

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

  // Edit Member Submit
  const handleEditMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalUser) return;
    setEditError(null);
    setSavingEdit(true);

    try {
      const res = await fetch('/api/admin/team/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: editModalUser.id,
          fullName: editName.trim(),
          phone: editPhone.trim() || null,
          departmentId: editDept || null,
          role: editRole,
          status: editStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update member profile.');
      }

      setEditModalUser(null);
      handleRefresh();
    } catch (err: any) {
      setEditError(err.message || 'Could not update profile.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Assign Manager Submit
  const handleAssignManagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerDept) return;
    setManagerError(null);
    setSavingManager(true);

    try {
      const res = await fetch('/api/admin/team/department-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departmentId: managerDept.id,
          managerId: selectedManagerId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to assign department manager.');
      }

      setManagerDept(null);
      handleRefresh();
    } catch (err: any) {
      setManagerError(err.message || 'Could not assign manager.');
    } finally {
      setSavingManager(false);
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

  // Cancel Invitation
  const handleCancelInvite = async (invId: string, email: string) => {
    if (!confirm(`Are you sure you want to cancel the invitation for ${email}?`)) return;
    try {
      const res = await fetch('/api/admin/team/cancel-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId: invId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to cancel invitation.');
      } else {
        handleRefresh();
      }
    } catch (err: any) {
      alert(err.message || 'Could not cancel invitation.');
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

  const handleCopyInviteLink = (email: string) => {
    const link = `${window.location.origin}/admin/set-password`;
    navigator.clipboard.writeText(link);
    alert(`Invitation setup link copied for ${email}: ${link}`);
  };

  // Color-coded role badges
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
      case 'pending':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 font-mono">
            Pending
          </span>
        );
      case 'suspended':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 font-mono">
            Suspended
          </span>
        );
      case 'archived':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-200 text-slate-700 font-mono">
            Archived
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
  const activeMembersForManager = members.filter((m) => m.is_active && m.status === 'active');

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
                  setInviteDept(departments[0]?.id || '');
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
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Scrollable Table Container */}
            <div className="bg-white rounded-3xl border border-brand-border/60 shadow-card overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="min-w-[1100px] w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-brand-soft-navy/50 border-b border-brand-border/60 text-xs font-bold text-brand-navy uppercase tracking-wider font-mono">
                      <th className="sticky left-0 bg-brand-soft-navy/90 backdrop-blur-xs z-20 py-4 px-6 w-16 shadow-xs">
                        Avatar
                      </th>
                      <th className="sticky left-16 bg-brand-soft-navy/90 backdrop-blur-xs z-20 py-4 px-6 border-r border-brand-border/40 min-w-[200px] shadow-xs">
                        Name
                      </th>
                      <th className="py-4 px-6 min-w-[180px]">Phone</th>
                      <th className="py-4 px-6 min-w-[220px]">Email</th>
                      <th className="py-4 px-6 min-w-[150px]">Department</th>
                      <th className="py-4 px-6 min-w-[130px]">Role</th>
                      <th className="py-4 px-6 min-w-[120px]">Status</th>
                      <th className="py-4 px-6 min-w-[140px]">Assigned Leads</th>
                      <th className="py-4 px-6 min-w-[150px]">Joined / Login</th>
                      <th className="py-4 px-6 text-right min-w-[180px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/40 font-medium text-brand-navy">
                    {filteredMembers.map((m) => {
                      const isSelf = m.id === currentUserId;
                      const isTargetOwner = m.role === 'owner';
                      const isAdminUser = adminRole === 'admin';

                      return (
                        <tr key={m.id} className="group hover:bg-brand-warm/60 transition-colors cursor-pointer">
                          <td
                            className="sticky left-0 bg-white group-hover:bg-brand-warm/80 transition-colors z-10 py-4 px-6"
                            onClick={() => {
                              setSelectedMember(m);
                              setDrawerTab('overview');
                            }}
                          >
                            <div className="relative w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs">
                              {m.full_name.charAt(0)}
                              <span
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                  m.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}
                              />
                            </div>
                          </td>

                          <td
                            className="sticky left-16 bg-white group-hover:bg-brand-warm/80 transition-colors z-10 py-4 px-6 border-r border-brand-border/40 font-bold text-brand-navy font-heading"
                            onClick={() => {
                              setSelectedMember(m);
                              setDrawerTab('overview');
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{m.full_name}</span>
                              {isSelf && <span className="text-[10px] text-brand-orange font-mono font-bold">(You)</span>}
                            </div>
                          </td>

                          {/* Phone Column with Call, WA, Copy */}
                          <td className="py-4 px-6 font-mono text-xs text-brand-navy">
                            {m.phone ? (
                              <div className="flex items-center gap-2">
                                <span>{formatPhoneDisplay(m.phone)}</span>
                                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                  <a
                                    href={`tel:+${m.phone}`}
                                    className="p-1 hover:bg-brand-soft-navy rounded text-brand-navy"
                                    title="Call Phone"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                                  </a>
                                  <a
                                    href={`https://wa.me/${m.phone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 hover:bg-emerald-50 rounded text-emerald-600"
                                    title="WhatsApp Message"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                  </a>
                                  <button
                                    className="p-1 hover:bg-slate-100 rounded text-slate-600"
                                    title="Copy Phone"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(m.phone || '');
                                      alert(`Copied phone: ${m.phone}`);
                                    }}
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-brand-muted">—</span>
                            )}
                          </td>

                          <td className="py-4 px-6 font-mono text-xs text-brand-muted">{m.email}</td>

                          <td className="py-4 px-6 text-xs font-semibold">
                            <span
                              className="px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: `${m.department_color || '#8B5CF6'}15`,
                                color: m.department_color || '#8B5CF6',
                              }}
                            >
                              {m.department_name || 'Admin'}
                            </span>
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

                          <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
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

                              {/* ADMIN LOOKING AT OWNER */}
                              {isAdminUser && isTargetOwner && (
                                <span className="text-[11px] font-mono text-brand-muted italic flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-amber-600" />
                                  <span>Owner Protected</span>
                                </span>
                              )}

                              {/* Standard non-self Actions */}
                              {!isSelf && (!isTargetOwner || adminRole === 'owner') && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditModalUser(m);
                                      setEditName(m.full_name);
                                      setEditPhone(m.phone || '');
                                      setEditDept(m.department_id || '');
                                      setEditRole(m.role);
                                      setEditStatus(m.status);
                                    }}
                                    className="px-2.5 py-1 text-xs font-bold text-brand-navy hover:text-brand-orange border border-brand-border rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>

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
                    <div className="space-y-1">
                      <div className="font-bold text-brand-navy font-heading">{inv.full_name}</div>
                      <div className="text-xs text-brand-muted font-mono">{inv.email} {inv.phone && `• ${formatPhoneDisplay(inv.phone)}`}</div>
                      <div className="text-[11px] text-brand-muted font-mono flex items-center gap-2">
                        <span>Role: <strong className="uppercase text-brand-navy">{inv.role}</strong></span>
                        <span>•</span>
                        <span>Expires: {new Date(inv.expires_at).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 font-mono">
                        {inv.status.toUpperCase()}
                      </span>
                      {can(adminRole, 'team.invite') && inv.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleResendInvite(inv.id, inv.email)}>
                            Resend
                          </Button>
                          <button
                            onClick={() => handleCopyInviteLink(inv.email)}
                            className="p-2 text-brand-navy hover:bg-brand-soft-navy border border-brand-border rounded-xl"
                            title="Copy Invite Setup Link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancelInvite(inv.id, inv.email)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                            title="Cancel Invitation"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
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
                  className="bg-white rounded-2xl p-5 border border-brand-border/60 shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <h3 className="font-bold text-brand-navy font-heading text-base">{dept.name}</h3>
                    </div>
                    {can(adminRole, 'team.department.change') && (
                      <button
                        onClick={() => {
                          setEditingDept(dept);
                          setDeptName(dept.name);
                          setDeptColor(dept.color);
                          setShowDeptModal(true);
                        }}
                        className="p-1.5 text-brand-muted hover:text-brand-navy rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="text-xs space-y-1.5 pt-2 border-t border-brand-border/40">
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Manager:</span>
                      <span className="font-bold text-brand-navy">{dept.manager_name || 'Unassigned'}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-brand-muted">Active Members:</span>
                      <strong className="text-emerald-600">{dept.active_members || 0}</strong>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-brand-muted">Pending Invitations:</span>
                      <strong className="text-amber-600">{dept.pending_invitations_count || 0}</strong>
                    </div>
                  </div>

                  {can(adminRole, 'team.department.change') && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setManagerDept(dept);
                          setSelectedManagerId(dept.manager_id || '');
                        }}
                        className="w-full py-1.5 text-xs font-bold border border-brand-border text-brand-navy hover:bg-brand-warm rounded-xl transition-colors"
                      >
                        Assign Manager
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
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

      {/* DRAWER: MEMBER DETAIL PROFILE */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-lg">
                    {selectedMember.full_name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-heading">{selectedMember.full_name}</h2>
                    <p className="text-xs text-brand-soft-navy font-mono">{selectedMember.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMember(null)} className="p-2 text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Navigation Tabs */}
              <div className="flex border-b border-brand-border/60 px-6 pt-3 gap-3 overflow-x-auto">
                <button
                  onClick={() => setDrawerTab('overview')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                    drawerTab === 'overview' ? 'border-brand-orange text-brand-navy' : 'border-transparent text-brand-muted'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setDrawerTab('permissions')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                    drawerTab === 'permissions' ? 'border-brand-orange text-brand-navy' : 'border-transparent text-brand-muted'
                  }`}
                >
                  Permissions
                </button>
                <button
                  onClick={() => setDrawerTab('leads')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                    drawerTab === 'leads' ? 'border-brand-orange text-brand-navy' : 'border-transparent text-brand-muted'
                  }`}
                >
                  Assigned Leads ({selectedMember.assigned_enquiries_count || 0})
                </button>
                <button
                  onClick={() => setDrawerTab('audit')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                    drawerTab === 'audit' ? 'border-brand-orange text-brand-navy' : 'border-transparent text-brand-muted'
                  }`}
                >
                  Audit Trail
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6">
                {drawerTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-brand-warm/30 border border-brand-border/60">
                      <div>
                        <span className="text-[11px] text-brand-muted font-mono uppercase">Role</span>
                        <div className="mt-1">{getRoleBadge(selectedMember.role)}</div>
                      </div>
                      <div>
                        <span className="text-[11px] text-brand-muted font-mono uppercase">Department</span>
                        <div className="mt-1 font-bold text-xs text-brand-navy">{selectedMember.department_name}</div>
                      </div>
                      <div>
                        <span className="text-[11px] text-brand-muted font-mono uppercase">Status</span>
                        <div className="mt-1">{getStatusBadge(selectedMember.status)}</div>
                      </div>
                      <div>
                        <span className="text-[11px] text-brand-muted font-mono uppercase">Phone</span>
                        <div className="mt-1 font-mono text-xs font-bold text-brand-navy">{formatPhoneDisplay(selectedMember.phone)}</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs border-t border-brand-border/40 pt-4">
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Joined Date:</span>
                        <span className="font-mono font-bold text-brand-navy">
                          {new Date(selectedMember.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Last Active Sign-in:</span>
                        <span className="font-mono font-bold text-brand-navy">
                          {selectedMember.last_sign_in_at
                            ? new Date(selectedMember.last_sign_in_at).toLocaleString('en-IN')
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {drawerTab === 'permissions' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-mono">
                      Granted Security Permissions ({selectedMember.role.toUpperCase()})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getRolePermissions(selectedMember.role).map((perm) => (
                        <div key={perm} className="p-2.5 rounded-xl border border-brand-border/40 bg-brand-soft-navy/30 text-xs font-mono font-semibold text-brand-navy flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {drawerTab === 'leads' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-mono">
                      Assigned Enquiry Workload
                    </h4>
                    <p className="text-xs text-brand-muted">
                      This staff member currently has <strong className="text-brand-navy">{selectedMember.assigned_enquiries_count || 0}</strong> active enquiry leads assigned.
                    </p>
                  </div>
                )}

                {drawerTab === 'audit' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-mono">
                      Activity Logs for {selectedMember.full_name}
                    </h4>
                    {activityLogs.filter((a) => a.target_id === selectedMember.id || a.actor_id === selectedMember.id).length === 0 ? (
                      <p className="text-xs text-brand-muted">No specific audit history recorded yet.</p>
                    ) : (
                      activityLogs.filter((a) => a.target_id === selectedMember.id || a.actor_id === selectedMember.id).map((a) => (
                        <div key={a.id} className="p-3 rounded-xl border border-brand-border/40 bg-brand-soft-navy/20 text-xs">
                          <div className="font-bold text-brand-navy uppercase font-mono">{a.action}</div>
                          <div className="text-[11px] text-brand-muted font-mono mt-1">{new Date(a.created_at).toLocaleString('en-IN')}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-brand-border/60 bg-brand-warm/30 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MEMBER */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-brand-navy font-heading flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-brand-orange" />
                <span>Edit Staff Profile</span>
              </h2>
              <button onClick={() => setEditModalUser(null)} className="text-brand-muted hover:text-brand-navy">
                ✕
              </button>
            </div>

            <form onSubmit={handleEditMemberSubmit} className="space-y-4">
              {editError && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold">{editError}</div>}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Department
                </label>
                <select
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium outline-none cursor-pointer bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Role (Owner excluded)
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium outline-none cursor-pointer bg-white"
                >
                  {ALL_ROLES.filter((r) => r.id !== 'owner').map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Member Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium outline-none cursor-pointer bg-white"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditModalUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={savingEdit}>
                  {savingEdit ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN DEPARTMENT MANAGER */}
      {managerDept && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-4">
            <h2 className="text-lg font-bold text-brand-navy font-heading">
              Assign Manager for {managerDept.name}
            </h2>
            <form onSubmit={handleAssignManagerSubmit} className="space-y-4">
              {managerError && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold">{managerError}</div>}
              <div>
                <label className="block text-xs font-bold text-brand-navy font-mono uppercase mb-1">
                  Select Active Member
                </label>
                <select
                  value={selectedManagerId}
                  onChange={(e) => setSelectedManagerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium outline-none cursor-pointer bg-white"
                >
                  <option value="">No Manager (Unassigned)</option>
                  {activeMembersForManager.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setManagerDept(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={savingManager}>
                  Save Manager
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TRANSFER OWNERSHIP */}
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
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
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
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={inviteDept}
                  onChange={(e) => setInviteDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange bg-white cursor-pointer"
                >
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
