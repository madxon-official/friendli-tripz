'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
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
  PhoneCall,
  MessageSquare,
  Copy,
  Check,
  X,
  Archive,
  RotateCcw,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { AdminRole, getRoleLabel, ALL_ROLES } from '@/lib/rbac/roles';
import { can } from '@/lib/rbac/can';
import { getRolePermissions } from '@/lib/rbac/permissions';

export interface DepartmentItem {
  id: string;
  name: string;
  color: string;
  active: boolean;
  archived_at?: string | null;
  manager_id?: string | null;
  manager_name?: string | null;
  total_members?: number;
  member_count?: number;
  active_members?: number;
  suspended_members?: number;
  pending_invitations?: number;
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
  status: 'active' | 'inactive' | 'suspended' | 'invited' | 'archived';
  created_at: string;
  created_by?: string | null;
  last_sign_in_at?: string | null;
  assigned_enquiries_count?: number;
}

export interface InvitationItem {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: AdminRole;
  department_id?: string | null;
  invited_by?: string | null;
  invited_by_name?: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  created_at: string;
  expires_at: string;
  accepted_at?: string | null;
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

// Role badge helper component
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
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 font-mono">Active</span>;
    case 'inactive':
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 font-mono">Inactive</span>;
    case 'suspended':
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 font-mono">Suspended</span>;
    case 'invited':
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 font-mono">Pending Invite</span>;
    case 'archived':
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-200 text-gray-700 font-mono">Archived</span>;
    default:
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 font-mono">{status}</span>;
  }
};

// MEMOIZED SUB-COMPONENT: MemberRow
interface MemberRowProps {
  member: TeamMemberItem;
  currentUserId: string;
  adminRole: AdminRole;
  copiedPhoneId: string | null;
  onOpenDrawer: (member: TeamMemberItem) => void;
  onEditMember: (member: TeamMemberItem) => void;
  onStatusModal: (member: TeamMemberItem, targetStatus: any) => void;
  onDeleteModal: (member: TeamMemberItem) => void;
  onTransferModal: () => void;
  onCopyPhone: (phone: string, id: string) => void;
}

const MemberRow = React.memo<MemberRowProps>(({
  member: m,
  currentUserId,
  adminRole,
  copiedPhoneId,
  onOpenDrawer,
  onEditMember,
  onStatusModal,
  onDeleteModal,
  onTransferModal,
  onCopyPhone,
}) => {
  const isSelf = m.id === currentUserId;
  const isTargetOwner = m.role === 'owner';
  const isAdminUser = adminRole === 'admin';
  const cleanPhone = m.phone ? m.phone.replace(/[^0-9]/g, '') : '';

  return (
    <tr
      className="group hover:bg-brand-warm/60 transition-colors cursor-pointer"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button, a, select')) return;
        onOpenDrawer(m);
      }}
    >
      <td className="sticky left-0 bg-white group-hover:bg-brand-warm/80 transition-colors z-10 py-4 px-6">
        <div className="relative w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs font-heading">
          {m.full_name.charAt(0)}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              m.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
        </div>
      </td>

      <td className="sticky left-16 bg-white group-hover:bg-brand-warm/80 transition-colors z-10 py-4 px-6 border-r border-brand-border/40 font-bold text-brand-navy font-heading">
        <div className="flex items-center gap-1.5">
          <span>{m.full_name}</span>
          {isSelf && <span className="text-[10px] text-brand-orange font-mono font-bold">(You)</span>}
        </div>
      </td>

      <td className="py-4 px-6 font-mono text-xs text-brand-muted">{m.email}</td>

      <td className="py-4 px-6 font-mono text-xs text-brand-muted">
        {m.phone ? (
          <div className="flex items-center gap-2">
            <span>{m.phone}</span>
            <a
              href={`tel:${m.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded text-brand-navy hover:text-brand-orange hover:bg-brand-warm"
              title="Call Phone"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </a>
            {cleanPhone && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                title="WhatsApp Message"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyPhone(m.phone!, m.id);
              }}
              className="p-1 rounded text-brand-muted hover:text-brand-navy"
              title="Copy Phone"
            >
              {copiedPhoneId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        ) : (
          <span className="text-brand-muted text-[11px]">No Phone</span>
        )}
      </td>

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

      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          {(!isTargetOwner || adminRole === 'owner') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditMember(m);
              }}
              className="p-1.5 text-brand-navy hover:text-brand-orange border border-brand-border rounded-lg transition-colors"
              title="Edit Member Profile"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {isSelf && isTargetOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onTransferModal();
              }}
            >
              Transfer Ownership
            </Button>
          )}

          {isAdminUser && isTargetOwner && (
            <span className="text-[11px] font-mono text-brand-muted italic flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Owner Protected</span>
            </span>
          )}

          {!isSelf && (!isTargetOwner || adminRole === 'owner') && (
            <>
              {can(adminRole, 'team.deactivate', m.role) && !isTargetOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusModal(m, m.status === 'active' ? 'suspended' : 'active');
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-brand-navy hover:text-amber-600 border border-brand-border rounded-lg transition-colors"
                >
                  {m.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              )}

              {can(adminRole, 'team.delete', m.role) && !isTargetOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteModal(m);
                  }}
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
});
MemberRow.displayName = 'MemberRow';

// MEMOIZED SUB-COMPONENT: DepartmentCard
interface DepartmentCardProps {
  dept: DepartmentItem;
  stats: { total: number; active: number; suspended: number; pendingInvites: number };
  adminRole: AdminRole;
  managerDisplayName: string | null;
  onEditDept: (dept: DepartmentItem) => void;
  onArchiveDept: (dept: DepartmentItem) => void;
  onRestoreDept: (dept: DepartmentItem) => void;
}

const DepartmentCard = React.memo<DepartmentCardProps>(({
  dept,
  stats,
  adminRole,
  managerDisplayName,
  onEditDept,
  onArchiveDept,
  onRestoreDept,
}) => {
  const isArchived = !dept.active || Boolean(dept.archived_at);

  return (
    <div
      className={`bg-white rounded-2xl p-5 border shadow-card space-y-4 flex flex-col justify-between ${
        isArchived ? 'border-gray-300 bg-gray-50/50 opacity-90' : 'border-brand-border/60'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: dept.color }} />
            <h3 className="font-bold text-brand-navy font-heading text-base">{dept.name}</h3>
            {isArchived && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-200 text-gray-700 font-mono">
                Archived
              </span>
            )}
          </div>
          {can(adminRole, 'team.department.change') && (
            <div className="flex items-center gap-1">
              {!isArchived ? (
                <>
                  <button
                    onClick={() => onEditDept(dept)}
                    className="p-1.5 text-brand-muted hover:text-brand-navy hover:bg-brand-warm rounded-lg transition-colors"
                    title="Edit Department"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onArchiveDept(dept)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Archive Department"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestoreDept(dept)}
                  icon={<RotateCcw className="w-3.5 h-3.5 text-emerald-600" />}
                >
                  Restore
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="p-2.5 rounded-xl bg-brand-soft-navy/50 text-xs flex items-center justify-between border border-brand-border/40">
          <span className="text-brand-muted font-mono font-bold uppercase text-[10px]">Manager:</span>
          <span className="font-bold text-brand-navy">
            {managerDisplayName ? managerDisplayName : <span className="text-brand-muted italic">Unassigned</span>}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
          <div className="p-2 rounded-xl bg-brand-warm/40 border border-brand-border/30">
            <span className="text-brand-muted block text-[10px]">Active Members</span>
            <span className="text-base font-bold text-emerald-700">{stats.active}</span>
          </div>
          <div className="p-2 rounded-xl bg-brand-warm/40 border border-brand-border/30">
            <span className="text-brand-muted block text-[10px]">Total Staff</span>
            <span className="text-base font-bold text-brand-navy">{stats.total}</span>
          </div>
          <div className="p-2 rounded-xl bg-brand-warm/40 border border-brand-border/30">
            <span className="text-brand-muted block text-[10px]">Suspended</span>
            <span className="text-base font-bold text-red-600">{stats.suspended}</span>
          </div>
          <div className="p-2 rounded-xl bg-brand-warm/40 border border-brand-border/30">
            <span className="text-brand-muted block text-[10px]">Pending Invites</span>
            <span className="text-base font-bold text-amber-600">{stats.pendingInvites}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
DepartmentCard.displayName = 'DepartmentCard';

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
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // 300ms Client-Side Debounced Search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Slide-Over Profile Drawer State & Lazy Tab Caching
  const [drawerUser, setDrawerUser] = useState<TeamMemberItem | null>(null);
  const [drawerHrTab, setDrawerHrTab] = useState<'profile' | 'permissions' | 'audit' | 'attendance' | 'payroll' | 'leave'>('profile');
  const [loadedDrawerTabs, setLoadedDrawerTabs] = useState<Set<string>>(new Set(['profile']));

  const handleSelectDrawerTab = useCallback((tab: 'profile' | 'permissions' | 'audit' | 'attendance' | 'payroll' | 'leave') => {
    setDrawerHrTab(tab);
    setLoadedDrawerTabs((prev) => new Set(prev).add(tab));
  }, []);

  const handleOpenDrawer = useCallback((member: TeamMemberItem) => {
    setDrawerUser(member);
    setDrawerHrTab('profile');
    setLoadedDrawerTabs(new Set(['profile']));
  }, []);

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [invitationStatusFilter, setInvitationStatusFilter] = useState<string>('all');
  const [deptStatusFilter, setDeptStatusFilter] = useState<'active' | 'archived' | 'all'>('active');

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
  const [editMemberUser, setEditMemberUser] = useState<TeamMemberItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editRole, setEditRole] = useState<AdminRole>('sales');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'suspended' | 'archived'>('active');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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
  const [deptManager, setDeptManager] = useState<string>('');
  const [savingDept, setSavingDept] = useState(false);
  const [deptError, setDeptError] = useState<string | null>(null);

  // Role Modal
  const [roleModalUser, setRoleModalUser] = useState<TeamMemberItem | null>(null);

  // Status Modal
  const [statusModalUser, setStatusModalUser] = useState<TeamMemberItem | null>(null);
  const [targetStatus, setTargetStatus] = useState<'active' | 'inactive' | 'suspended' | 'archived'>('active');
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

  // Keyboard Accessibility: Escape key closes active drawer or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (drawerUser) setDrawerUser(null);
        if (showInviteModal) setShowInviteModal(false);
        if (editMemberUser) setEditMemberUser(null);
        if (showTransferModal) setShowTransferModal(false);
        if (showDeptModal) setShowDeptModal(false);
        if (statusModalUser) setStatusModalUser(null);
        if (deleteModalUser) setDeleteModalUser(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerUser, showInviteModal, editMemberUser, showTransferModal, showDeptModal, statusModalUser, deleteModalUser]);

  // SINGLE SOURCE OF TRUTH: Dynamically calculate department statistics directly from members & invitations
  const departmentStatsMap = useMemo(() => {
    const map = new Map<string, { total: number; active: number; suspended: number; pendingInvites: number }>();

    departments.forEach((d) => {
      map.set(d.id, { total: 0, active: 0, suspended: 0, pendingInvites: 0 });
    });

    members.forEach((m) => {
      if (m.department_id) {
        const stats = map.get(m.department_id) || { total: 0, active: 0, suspended: 0, pendingInvites: 0 };
        stats.total += 1;
        if (m.is_active && m.status === 'active') stats.active += 1;
        if (m.status === 'suspended') stats.suspended += 1;
        map.set(m.department_id, stats);
      }
    });

    invitations.forEach((inv) => {
      if (inv.department_id && inv.status === 'pending') {
        const stats = map.get(inv.department_id) || { total: 0, active: 0, suspended: 0, pendingInvites: 0 };
        stats.pendingInvites += 1;
        map.set(inv.department_id, stats);
      }
    });

    return map;
  }, [departments, members, invitations]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  }, [router]);

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 1500);
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = debouncedSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.department_name && m.department_name.toLowerCase().includes(q));

      const matchesRole = roleFilter === 'all' || m.role === roleFilter;
      const matchesDept = deptFilter === 'all' || m.department_id === deptFilter;
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchesSearch && matchesRole && matchesDept && matchesStatus;
    });
  }, [members, debouncedSearchQuery, roleFilter, deptFilter, statusFilter]);

  const filteredInvitations = useMemo(() => {
    return invitations.filter((inv) => {
      const q = debouncedSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inv.full_name.toLowerCase().includes(q) ||
        inv.email.toLowerCase().includes(q) ||
        (inv.phone && inv.phone.toLowerCase().includes(q));

      const matchesStatus = invitationStatusFilter === 'all' || inv.status === invitationStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invitations, debouncedSearchQuery, invitationStatusFilter]);

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      if (deptStatusFilter === 'active') return dept.active && !dept.archived_at;
      if (deptStatusFilter === 'archived') return !dept.active || Boolean(dept.archived_at);
      return true;
    });
  }, [departments, deptStatusFilter]);

  // Stable Callbacks
  const openEditModal = useCallback((member: TeamMemberItem) => {
    setEditMemberUser(member);
    setEditName(member.full_name);
    setEditPhone(member.phone || '');
    setEditDept(member.department_id || '');
    setEditRole(member.role);
    setEditStatus(member.status as any);
    setEditError(null);
  }, []);

  const handleStatusModal = useCallback((member: TeamMemberItem, status: any) => {
    setStatusModalUser(member);
    setTargetStatus(status);
  }, []);

  const handleDeleteModal = useCallback((member: TeamMemberItem) => {
    setDeleteModalUser(member);
  }, []);

  const handleTransferModal = useCallback(() => {
    setTransferError(null);
    setConfirmText('');
    setTargetAdminId('');
    setShowTransferModal(true);
  }, []);

  const handleEditDeptModal = useCallback((dept: DepartmentItem) => {
    setEditingDept(dept);
    setDeptName(dept.name);
    setDeptColor(dept.color);
    setDeptManager(dept.manager_id || '');
    setShowDeptModal(true);
  }, []);

  const handleArchiveDepartment = useCallback(async (dept: DepartmentItem) => {
    if (!confirm(`Are you sure you want to archive department '${dept.name}'?`)) return;

    try {
      const res = await fetch('/api/admin/team/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dept.id, action: 'archive' }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to archive department.');
      } else {
        alert('Department archived successfully.');
        handleRefresh();
      }
    } catch (err: any) {
      alert(err.message || 'Could not archive department.');
    }
  }, [handleRefresh]);

  const handleRestoreDepartment = useCallback(async (dept: DepartmentItem) => {
    try {
      const res = await fetch('/api/admin/team/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dept.id, action: 'restore' }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to restore department.');
      } else {
        alert(`Department '${dept.name}' restored successfully.`);
        handleRefresh();
      }
    } catch (err: any) {
      alert(err.message || 'Could not restore department.');
    }
  }, [handleRefresh]);

  const handleCancelInvite = useCallback(async (invId: string, email: string) => {
    if (!confirm(`Cancel pending invitation for ${email}?`)) return;

    try {
      const res = await fetch('/api/admin/team/invitations/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId: invId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to cancel invitation.');
      } else {
        alert(`Invitation for ${email} cancelled.`);
        handleRefresh();
      }
    } catch (err: any) {
      alert(err.message || 'Could not cancel invitation.');
    }
  }, [handleRefresh]);

  const handleResendInvite = useCallback(async (invId: string, email: string) => {
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
  }, [handleRefresh]);

  // Form Submissions
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

  const handleSaveMemberEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMemberUser) return;
    setEditError(null);
    setSavingEdit(true);

    try {
      const res = await fetch('/api/admin/team/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: editMemberUser.id,
          fullName: editName.trim(),
          phone: editPhone.trim() || null,
          departmentId: editDept || null,
          role: editRole,
          status: editStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update member.');
      }

      setEditMemberUser(null);
      handleRefresh();
    } catch (err: any) {
      setEditError(err.message || 'Could not update member.');
    } finally {
      setSavingEdit(false);
    }
  };

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
        body: JSON.stringify({ targetAdminId }),
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
          manager_id: deptManager || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save department.');
      }

      setShowDeptModal(false);
      setEditingDept(null);
      setDeptName('');
      setDeptManager('');
      handleRefresh();
    } catch (err: any) {
      setDeptError(err.message || 'Could not save department.');
    } finally {
      setSavingDept(false);
    }
  };

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
        body: JSON.stringify({ targetUserId: deleteModalUser.id }),
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

  const activeAdminsForTransfer = members.filter((m) => m.role === 'admin' && m.is_active);

  return (
    <>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy font-heading flex items-center gap-2">
              <Users className="w-7 h-7 text-brand-orange" />
              <span>Team Management Enterprise</span>
            </h1>
            <p className="text-sm text-brand-muted mt-1">
              Enterprise Access Control, Department Management & Staff Directory.
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
                onClick={handleTransferModal}
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
                  placeholder="Search by name, email, phone, department..."
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
                  <option value="invited">Pending Invite</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Members List or Clean Empty State */}
            {filteredMembers.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-brand-border/60 shadow-card text-center space-y-3">
                <Users className="w-10 h-10 text-brand-muted mx-auto" />
                <h3 className="text-base font-bold text-brand-navy font-heading">No Team Members Found</h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  No team members matched your search query or filter criteria. Try clearing search filters.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-brand-border/60 shadow-card overflow-hidden w-full">
                <div className="overflow-x-auto w-full">
                  <table className="min-w-[1200px] w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-brand-soft-navy/50 border-b border-brand-border/60 text-xs font-bold text-brand-navy uppercase tracking-wider font-mono">
                        <th className="sticky left-0 bg-brand-soft-navy/90 backdrop-blur-xs z-20 py-4 px-6 w-16 shadow-xs">
                          Avatar
                        </th>
                        <th className="sticky left-16 bg-brand-soft-navy/90 backdrop-blur-xs z-20 py-4 px-6 border-r border-brand-border/40 min-w-[200px] shadow-xs">
                          Name
                        </th>
                        <th className="py-4 px-6 min-w-[220px]">Email</th>
                        <th className="py-4 px-6 min-w-[180px]">Phone & Actions</th>
                        <th className="py-4 px-6 min-w-[150px]">Department</th>
                        <th className="py-4 px-6 min-w-[130px]">Role</th>
                        <th className="py-4 px-6 min-w-[130px]">Status</th>
                        <th className="py-4 px-6 min-w-[140px]">Assigned Leads</th>
                        <th className="py-4 px-6 min-w-[150px]">Joined / Login</th>
                        <th className="py-4 px-6 text-right min-w-[200px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/40 font-medium text-brand-navy">
                      {filteredMembers.map((m) => (
                        <MemberRow
                          key={m.id}
                          member={m}
                          currentUserId={currentUserId}
                          adminRole={adminRole}
                          copiedPhoneId={copiedPhoneId}
                          onOpenDrawer={handleOpenDrawer}
                          onEditMember={openEditModal}
                          onStatusModal={handleStatusModal}
                          onDeleteModal={handleDeleteModal}
                          onTransferModal={handleTransferModal}
                          onCopyPhone={copyToClipboard}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVITATIONS */}
        {activeTab === 'invitations' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-brand-border/60 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex-1 relative min-w-[240px]">
                <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search invitations by email, name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border text-xs font-medium outline-none focus:border-brand-orange"
                />
              </div>

              <select
                value={invitationStatusFilter}
                onChange={(e) => setInvitationStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-brand-border text-xs font-medium text-brand-navy outline-none bg-white cursor-pointer"
              >
                <option value="all">All Invitation Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="bg-white rounded-3xl border border-brand-border/60 shadow-card p-6 space-y-4">
              <h2 className="text-lg font-bold text-brand-navy font-heading">Team Invitations Lifecycle</h2>
              {filteredInvitations.length === 0 ? (
                <p className="text-xs text-brand-muted py-6 text-center">No invitations matching filter criteria.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredInvitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-5 rounded-2xl border border-brand-border/60 bg-brand-warm/30 space-y-3 shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-brand-navy font-heading">{inv.full_name}</h3>
                          <div className="text-xs text-brand-muted font-mono">{inv.email}</div>
                          {inv.phone && <div className="text-xs text-brand-muted font-mono">Phone: {inv.phone}</div>}
                        </div>
                        {getStatusBadge(inv.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-muted pt-2 border-t border-brand-border/40 font-mono">
                        <div>
                          <span className="block text-brand-navy font-bold">Role</span>
                          <span>{inv.role.toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="block text-brand-navy font-bold">Invited By</span>
                          <span>{inv.invited_by_name || 'Admin'}</span>
                        </div>
                        <div>
                          <span className="block text-brand-navy font-bold">Sent Date</span>
                          <span>{new Date(inv.created_at).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="block text-brand-navy font-bold">
                            {inv.status === 'accepted' ? 'Accepted Date' : 'Expiry Date'}
                          </span>
                          <span>
                            {inv.status === 'accepted' && inv.accepted_at
                              ? new Date(inv.accepted_at).toLocaleDateString('en-IN')
                              : new Date(inv.expires_at).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-brand-border/40">
                        {inv.status === 'pending' && can(adminRole, 'team.invite') && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvite(inv.id, inv.email)}
                            >
                              Resend Email
                            </Button>
                            <button
                              onClick={() => handleCancelInvite(inv.id, inv.email)}
                              className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => copyToClipboard(`${window.location.origin}/admin/set-password`, `inv_${inv.id}`)}
                          className="px-2.5 py-1 text-xs font-bold text-brand-navy hover:bg-brand-warm border border-brand-border rounded-lg transition-colors flex items-center gap-1"
                        >
                          {copiedPhoneId === `inv_${inv.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Link</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-brand-navy font-heading">Enterprise Departments</h2>
                <select
                  value={deptStatusFilter}
                  onChange={(e) => setDeptStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-brand-border text-xs font-bold text-brand-navy outline-none bg-white cursor-pointer"
                >
                  <option value="active">Active Departments</option>
                  <option value="archived">Archived Departments</option>
                  <option value="all">All Departments</option>
                </select>
              </div>

              {can(adminRole, 'team.department.change') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEditingDept(null);
                    setDeptName('');
                    setDeptColor('#F97316');
                    setDeptManager('');
                    setShowDeptModal(true);
                  }}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Department
                </Button>
              )}
            </div>

            {filteredDepartments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-brand-border/60 shadow-card text-center space-y-3">
                <Building2 className="w-10 h-10 text-brand-muted mx-auto" />
                <h3 className="text-base font-bold text-brand-navy font-heading">No Departments Found</h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  No departments found matching status filter &quot;{deptStatusFilter}&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDepartments.map((dept) => {
                  const stats = departmentStatsMap.get(dept.id) || {
                    total: 0,
                    active: 0,
                    suspended: 0,
                    pendingInvites: 0,
                  };
                  const managerProfile = members.find((m) => m.id === dept.manager_id);
                  const managerDisplayName = dept.manager_name || (managerProfile ? managerProfile.full_name : null);

                  return (
                    <DepartmentCard
                      key={dept.id}
                      dept={dept}
                      stats={stats}
                      adminRole={adminRole}
                      managerDisplayName={managerDisplayName}
                      onEditDept={handleEditDeptModal}
                      onArchiveDept={handleArchiveDepartment}
                      onRestoreDept={handleRestoreDepartment}
                    />
                  );
                })}
              </div>
            )}
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

      {/* SLIDE-OVER MEMBER PROFILE DRAWER WITH TAB DOM SCROLL PRESERVATION */}
      {drawerUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end overflow-hidden" role="dialog" aria-modal="true">
          <div className="bg-white w-full max-w-[650px] sm:w-[540px] md:w-[580px] lg:w-[600px] h-full shadow-2xl flex flex-col border-l border-brand-border/60 overflow-hidden">
            {/* Drawer Header (Sticky) */}
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-lg uppercase shadow-sm shrink-0 font-heading">
                  {drawerUser.full_name.charAt(0)}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold font-heading truncate leading-tight">{drawerUser.full_name}</h2>
                    <div className="shrink-0">{getRoleBadge(drawerUser.role)}</div>
                  </div>
                  <p className="text-xs text-brand-muted font-mono truncate">{drawerUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerUser(null)}
                className="p-2 text-brand-muted hover:text-white rounded-xl hover:bg-white/10 transition-colors shrink-0"
                title="Close Drawer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation Tabs */}
            <div className="flex border-b border-brand-border/60 bg-white px-6 pt-3 gap-6 overflow-x-hidden text-xs">
              <button
                onClick={() => handleSelectDrawerTab('profile')}
                className={`pb-3 transition-colors relative whitespace-nowrap ${
                  drawerHrTab === 'profile'
                    ? 'text-brand-navy font-bold border-b-2 border-brand-orange'
                    : 'text-brand-muted hover:text-brand-navy font-medium'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleSelectDrawerTab('permissions')}
                className={`pb-3 transition-colors relative whitespace-nowrap ${
                  drawerHrTab === 'permissions'
                    ? 'text-brand-navy font-bold border-b-2 border-brand-orange'
                    : 'text-brand-muted hover:text-brand-navy font-medium'
                }`}
              >
                Permissions ({getRolePermissions(drawerUser.role).length})
              </button>
              <button
                onClick={() => handleSelectDrawerTab('attendance')}
                className={`pb-3 transition-colors relative whitespace-nowrap opacity-60 cursor-not-allowed ${
                  drawerHrTab === 'attendance'
                    ? 'text-brand-navy font-bold border-b-2 border-brand-orange'
                    : 'text-brand-muted hover:text-brand-navy font-medium'
                }`}
                title="Future HR Extension"
              >
                Attendance
              </button>
              <button
                onClick={() => handleSelectDrawerTab('payroll')}
                className={`pb-3 transition-colors relative whitespace-nowrap opacity-60 cursor-not-allowed ${
                  drawerHrTab === 'payroll'
                    ? 'text-brand-navy font-bold border-b-2 border-brand-orange'
                    : 'text-brand-muted hover:text-brand-navy font-medium'
                }`}
                title="Future HR Extension"
              >
                Payroll
              </button>
            </div>

            {/* Drawer Body (Vertical Scroll Only with Preserved Tab Visibility Toggles) */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto overflow-x-hidden">
              {/* TAB 1: OVERVIEW */}
              <div className={drawerHrTab === 'profile' ? 'space-y-6 block' : 'hidden'}>
                <div className="p-4 rounded-2xl border border-brand-border/60 bg-brand-soft-navy/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-brand-muted uppercase block font-bold">Role & Authority</span>
                    <div className="mt-1">{getRoleBadge(drawerUser.role)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-brand-muted uppercase block font-bold">Account Status</span>
                    <div className="mt-1">{getStatusBadge(drawerUser.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl border border-brand-border/40 bg-white shadow-2xs space-y-1">
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Email Address</span>
                    <span className="font-bold text-brand-navy block truncate" title={drawerUser.email}>{drawerUser.email}</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-brand-border/40 bg-white shadow-2xs space-y-1">
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Phone Number</span>
                    <span className="font-bold text-brand-navy block truncate">{drawerUser.phone || '—'}</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-brand-border/40 bg-white shadow-2xs space-y-1">
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Department</span>
                    <span className="font-bold text-brand-navy block truncate">{drawerUser.department_name || 'Admin'}</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-brand-border/40 bg-white shadow-2xs space-y-1">
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Assigned Leads</span>
                    <span className="font-bold text-brand-orange block truncate">{drawerUser.assigned_enquiries_count || 0} Leads</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-brand-border/40 bg-white shadow-2xs space-y-1">
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Created By</span>
                    <span className="font-bold text-brand-navy block truncate">{drawerUser.created_by || 'System'}</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-brand-border/40 bg-white shadow-2xs space-y-1">
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Joined Date</span>
                    <span className="font-bold text-brand-navy block truncate">
                      {new Date(drawerUser.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl border border-brand-border/40 bg-white shadow-2xs space-y-1 col-span-2 sm:col-span-3">
                    <span className="text-brand-muted block text-[10px] uppercase font-bold">Last Sign In</span>
                    <span className="font-bold text-brand-navy block truncate">
                      {drawerUser.last_sign_in_at
                        ? new Date(drawerUser.last_sign_in_at).toLocaleString('en-IN')
                        : 'Never signed in'}
                    </span>
                  </div>
                </div>
              </div>

              {/* TAB 2: PERMISSIONS */}
              {loadedDrawerTabs.has('permissions') && (
                <div className={drawerHrTab === 'permissions' ? 'space-y-6 block' : 'hidden'}>
                  <div>
                    <h3 className="font-bold text-sm text-brand-navy font-heading">
                      Active Permissions Matrix ({getRoleLabel(drawerUser.role)})
                    </h3>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Permissions assigned based on system role policies.
                    </p>
                  </div>

                  {(() => {
                    const activePerms = getRolePermissions(drawerUser.role);
                    const PERM_MODULES: Record<string, { module: string; label: string }> = {
                      'dashboard.view': { module: 'Dashboard', label: 'View Dashboard' },
                      'team.view': { module: 'Team', label: 'View Team Directory' },
                      'team.invite': { module: 'Team', label: 'Invite Staff Members' },
                      'team.edit': { module: 'Team', label: 'Edit Member Profiles' },
                      'team.archive': { module: 'Team', label: 'Archive Accounts' },
                      'team.activate': { module: 'Team', label: 'Activate Accounts' },
                      'team.deactivate': { module: 'Team', label: 'Deactivate / Suspend' },
                      'team.role.change': { module: 'Team', label: 'Change Staff Roles' },
                      'team.department.change': { module: 'Team', label: 'Manage Departments' },
                      'team.delete': { module: 'Team', label: 'Delete Staff Accounts' },
                      'team.transfer_ownership': { module: 'Team', label: 'Transfer Ownership' },
                      'enquiry.view': { module: 'Enquiries', label: 'View Assigned Leads' },
                      'enquiry.view_all': { module: 'Enquiries', label: 'View All Enquiries' },
                      'enquiry.update': { module: 'Enquiries', label: 'Update Lead Status' },
                      'enquiry.archive': { module: 'Enquiries', label: 'Archive Enquiries' },
                      'enquiry.assign': { module: 'Enquiries', label: 'Assign Leads to Staff' },
                      'enquiry.notes': { module: 'Enquiries', label: 'Manage Internal Notes' },
                      'trip.view': { module: 'Trips', label: 'View Trips & Itineraries' },
                      'trip.create': { module: 'Trips', label: 'Create New Trips' },
                      'trip.update': { module: 'Trips', label: 'Update Trip Content' },
                      'trip.delete': { module: 'Trips', label: 'Delete Trips' },
                      'booking.view': { module: 'Bookings', label: 'View Customer Bookings' },
                      'booking.update': { module: 'Bookings', label: 'Update Booking Details' },
                      'payment.view': { module: 'Payments', label: 'View Payment Records' },
                      'payment.update': { module: 'Payments', label: 'Manage Transactions' },
                      'settings.security': { module: 'Settings', label: 'Security & Access Rules' },
                      'settings.website': { module: 'Settings', label: 'Website Configuration' },
                      'settings.team': { module: 'Settings', label: 'Team Configuration' },
                    };

                    const grouped: Record<string, { key: string; label: string }[]> = {};
                    const order = ['Dashboard', 'Team', 'Enquiries', 'Trips', 'Bookings', 'Payments', 'Settings'];

                    activePerms.forEach((p) => {
                      const meta = PERM_MODULES[p] || { module: 'Other', label: p };
                      if (!grouped[meta.module]) grouped[meta.module] = [];
                      grouped[meta.module].push({ key: p, label: meta.label });
                    });

                    return (
                      <div className="space-y-4">
                        {order.map((modName) => {
                          const items = grouped[modName];
                          if (!items || items.length === 0) return null;

                          return (
                            <div key={modName} className="space-y-2">
                              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-navy">
                                {modName}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {items.map((item) => (
                                  <div
                                    key={item.key}
                                    className="px-3 py-1.5 rounded-xl border border-brand-border/40 bg-brand-soft-navy/40 text-xs font-mono text-brand-navy flex items-center gap-1.5"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 3 & 4: HR PLACEHOLDERS */}
              {loadedDrawerTabs.has('attendance') && (
                <div className={drawerHrTab === 'attendance' ? 'block' : 'hidden'}>
                  <div className="py-12 text-center space-y-3 bg-brand-warm/30 rounded-2xl border border-dashed border-brand-border">
                    <Lock className="w-8 h-8 text-brand-muted mx-auto" />
                    <h3 className="font-bold text-brand-navy font-heading text-base font-mono">Attendance Extension</h3>
                    <p className="text-xs text-brand-muted max-w-xs mx-auto">
                      Prepared for future HR attendance module integration.
                    </p>
                  </div>
                </div>
              )}

              {loadedDrawerTabs.has('payroll') && (
                <div className={drawerHrTab === 'payroll' ? 'block' : 'hidden'}>
                  <div className="py-12 text-center space-y-3 bg-brand-warm/30 rounded-2xl border border-dashed border-brand-border">
                    <Lock className="w-8 h-8 text-brand-muted mx-auto" />
                    <h3 className="font-bold text-brand-navy font-heading text-base font-mono">Payroll Extension</h3>
                    <p className="text-xs text-brand-muted max-w-xs mx-auto">
                      Prepared for future HR payroll module integration.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Footer (Sticky) */}
            <div className="sticky bottom-0 z-20 bg-white border-t border-brand-border/60 p-4 sm:p-6 flex items-center justify-end gap-3 flex-wrap shadow-lg">
              {can(adminRole, 'team.edit', drawerUser.role) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    openEditModal(drawerUser);
                    setDrawerUser(null);
                  }}
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit Profile
                </Button>
              )}

              {can(adminRole, 'team.department.change', drawerUser.role) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    openEditModal(drawerUser);
                    setDrawerUser(null);
                  }}
                  icon={<Building2 className="w-3.5 h-3.5" />}
                >
                  Change Dept
                </Button>
              )}

              {can(adminRole, 'team.deactivate', drawerUser.role) && drawerUser.id !== currentUserId && drawerUser.role !== 'owner' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    handleStatusModal(drawerUser, drawerUser.status === 'active' ? 'suspended' : 'active');
                    setDrawerUser(null);
                  }}
                >
                  {drawerUser.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MEMBER PROFILE */}
      {editMemberUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border space-y-4">
            <h2 className="text-lg font-bold text-brand-navy font-heading flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-brand-orange" />
              <span>Edit Staff Member Profile</span>
            </h2>

            <form onSubmit={handleSaveMemberEdit} className="space-y-4">
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                  Department
                </label>
                <select
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none bg-white cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {editMemberUser.role !== 'owner' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                    Assigned Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as AdminRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none bg-white cursor-pointer"
                  >
                    {ALL_ROLES.filter((r) => r.id !== 'owner' && can(adminRole, 'team.role.change', r.id)).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label} — {r.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editMemberUser.id !== currentUserId && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1 font-mono">
                    Account Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none bg-white cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditMemberUser(null)}>
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
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
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

      {/* MODAL: DEPARTMENT ADD/EDIT/MANAGER */}
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
                  Assign Department Manager
                </label>
                <select
                  value={deptManager}
                  onChange={(e) => setDeptManager(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium outline-none cursor-pointer bg-white"
                >
                  <option value="">No Manager Assigned</option>
                  {members.filter((m) => m.is_active && m.status === 'active').map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.role.toUpperCase()})
                    </option>
                  ))}
                </select>
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
                <option value="archived">Archived</option>
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
    </>
  );
};
