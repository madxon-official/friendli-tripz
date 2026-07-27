'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  XCircle,
  Mail,
  Loader2,
  AlertCircle,
  X,
  UserCheck,
  RefreshCw,
  MoreVertical,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { INVITEABLE_ROLES, getRoleLabel, AdminRole } from '@/lib/auth/roles';

export interface TeamMemberItem {
  id: string;
  full_name: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  status: 'Active' | 'Inactive' | 'Invited';
  created_at: string;
  last_sign_in_at?: string | null;
}

interface TeamListClientProps {
  teamMembers: TeamMemberItem[];
  initialNewCount: number;
  adminName?: string;
  adminEmail?: string;
  adminRole?: string;
}

export const TeamListClient: React.FC<TeamListClientProps> = ({
  teamMembers: initialMembers,
  initialNewCount,
  adminName,
  adminEmail,
  adminRole = 'owner',
}) => {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMemberItem[]>(initialMembers);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync state when initialMembers prop updates from server revalidation
  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  // Invite Modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('sales');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Change Role Modal state
  const [roleModalUser, setRoleModalUser] = useState<TeamMemberItem | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<AdminRole>('sales');
  const [changingRole, setChangingRole] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  // Deactivate / Reactivate Modal state
  const [statusModalUser, setStatusModalUser] = useState<TeamMemberItem | null>(null);
  const [statusModalTargetState, setStatusModalTargetState] = useState<boolean>(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Action Menu state for mobile
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const refreshPageData = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Handle Invitation submission
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
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send invitation.');
      }

      setInviteSuccess(data.message || `Invitation sent to ${inviteEmail.trim()}`);
      setInviteName('');
      setInviteEmail('');
      setInviteRole('sales');

      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(null);
        refreshPageData();
      }, 1500);
    } catch (err: any) {
      console.error('Invite submission error:', err);
      setInviteError(err.message || 'Invitation failed. Please try again.');
    } finally {
      setInviting(false);
    }
  };

  // Handle Role Change submission
  const handleChangeRoleSubmit = async () => {
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
        throw new Error(data.error || 'Role change failed.');
      }

      setMembers((prev) =>
        prev.map((m) => (m.id === roleModalUser.id ? { ...m, role: selectedNewRole } : m))
      );
      setRoleModalUser(null);
      refreshPageData();
    } catch (err: any) {
      console.error('Role change error:', err);
      setRoleError(err.message || 'Failed to update role.');
    } finally {
      setChangingRole(false);
    }
  };

  // Handle Deactivate / Reactivate Status submission
  const handleToggleStatusSubmit = async () => {
    if (!statusModalUser) return;
    setStatusError(null);
    setUpdatingStatus(true);

    try {
      const res = await fetch('/api/admin/team/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: statusModalUser.id,
          isActive: statusModalTargetState,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Status update failed.');
      }

      const newStatus = statusModalTargetState ? 'Active' : 'Inactive';
      setMembers((prev) =>
        prev.map((m) =>
          m.id === statusModalUser.id
            ? { ...m, is_active: statusModalTargetState, status: newStatus }
            : m
        )
      );
      setStatusModalUser(null);
      refreshPageData();
    } catch (err: any) {
      console.error('Status update error:', err);
      setStatusError(err.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'owner':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800 font-mono flex items-center gap-1 w-fit">
            <Shield className="w-3 h-3 text-purple-600" />
            <span>OWNER</span>
          </span>
        );
      case 'admin':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 font-mono w-fit">
            ADMIN
          </span>
        );
      case 'operations':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 font-mono w-fit">
            OPERATIONS
          </span>
        );
      case 'sales':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 font-mono w-fit">
            SALES
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

  const getStatusBadge = (status: 'Active' | 'Inactive' | 'Invited') => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Active</span>
          </span>
        );
      case 'Invited':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono inline-flex items-center gap-1">
            <Mail className="w-3 h-3 text-amber-600" />
            <span>Invited</span>
          </span>
        );
      case 'Inactive':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-mono inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-slate-400" />
            <span>Inactive</span>
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
              <span>Team</span>
            </h1>
            <p className="text-sm text-brand-muted mt-1">
              Manage who can access Friendli Admin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshPageData}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-brand-border text-brand-navy hover:bg-brand-warm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50"
              title="Refresh Team List"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-orange' : ''}`} />
            </button>

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
          </div>
        </div>

        {/* Content Section */}
        {members.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-brand-border/60">
            <Users className="w-10 h-10 text-brand-muted mx-auto" />
            <p className="text-base font-bold text-brand-navy">No team members found.</p>
            <p className="text-xs text-brand-muted">Click Invite Member above to add your first team member.</p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View (lg:block) */}
            <div className="hidden lg:block bg-white rounded-3xl border border-brand-border/60 shadow-card overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-soft-navy/50 border-b border-brand-border/60 text-xs font-bold text-brand-navy uppercase tracking-wider font-mono">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Created</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 font-medium text-brand-navy">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-brand-warm/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-navy text-white font-heading font-black text-xs flex items-center justify-center shrink-0">
                            {member.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-heading font-bold text-base text-brand-navy block">
                              {member.full_name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-brand-muted">
                        {member.email}
                      </td>
                      <td className="py-4 px-6">{getRoleBadge(member.role)}</td>
                      <td className="py-4 px-6">{getStatusBadge(member.status)}</td>
                      <td className="py-4 px-6 text-xs text-brand-muted">
                        {new Date(member.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {member.role === 'owner' ? (
                          <span className="text-xs text-brand-muted italic font-mono pr-2">Owner Protected</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setRoleModalUser(member);
                                setSelectedNewRole(member.role === 'owner' ? 'admin' : member.role);
                                setRoleError(null);
                              }}
                              className="px-3 py-1.5 rounded-lg border border-brand-border text-xs font-bold text-brand-navy hover:bg-brand-soft-navy transition-colors min-h-[36px]"
                            >
                              Change Role
                            </button>

                            {member.is_active ? (
                              <button
                                onClick={() => {
                                  setStatusModalUser(member);
                                  setStatusModalTargetState(false);
                                  setStatusError(null);
                                }}
                                className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors min-h-[36px]"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setStatusModalUser(member);
                                  setStatusModalTargetState(true);
                                  setStatusError(null);
                                }}
                                className="px-3 py-1.5 rounded-lg border border-emerald-300 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors min-h-[36px]"
                              >
                                Reactivate
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (lg:hidden, 375px/390px/430px optimized) */}
            <div className="lg:hidden space-y-3.5">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-5 border border-brand-border/60 shadow-card space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-navy text-white font-heading font-black text-sm flex items-center justify-center shrink-0">
                        {member.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base text-brand-navy">
                          {member.full_name}
                        </h3>
                        <p className="text-xs font-mono text-brand-muted truncate max-w-[200px]">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <div>{getStatusBadge(member.status)}</div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-brand-border/40 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-brand-muted uppercase block mb-1">
                        Role
                      </span>
                      {getRoleBadge(member.role)}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-brand-muted uppercase block">
                        Joined
                      </span>
                      <span className="text-xs font-semibold text-brand-navy">
                        {new Date(member.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {member.role !== 'owner' && (
                    <div className="pt-3 border-t border-brand-border/40 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setRoleModalUser(member);
                          setSelectedNewRole(member.role === 'owner' ? 'admin' : member.role);
                          setRoleError(null);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl border border-brand-border text-xs font-bold text-brand-navy hover:bg-brand-warm transition-colors min-h-[44px]"
                      >
                        Change Role
                      </button>

                      {member.is_active ? (
                        <button
                          onClick={() => {
                            setStatusModalUser(member);
                            setStatusModalTargetState(false);
                            setStatusError(null);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setStatusModalUser(member);
                            setStatusModalTargetState(true);
                            setStatusError(null);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl border border-emerald-300 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors min-h-[44px]"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1. INVITE MEMBER MODAL */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border/60 space-y-5 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <div className="flex items-center gap-2 text-brand-navy">
                  <UserPlus className="w-5 h-5 text-brand-orange" />
                  <h3 className="font-heading font-black text-lg">Invite Team Member</h3>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 rounded-lg text-brand-muted hover:text-brand-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-4">
                {inviteError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{inviteError}</span>
                  </div>
                )}

                {inviteSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <span>{inviteSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Kumar"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="arun@friendlitripz.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                    className="w-full px-3.5 py-3 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange bg-white cursor-pointer min-h-[44px]"
                  >
                    {INVITEABLE_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label} — {r.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInviteModal(false)}
                    disabled={inviting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={inviting || !!inviteSuccess}
                    icon={inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  >
                    {inviting ? 'Sending Invitation...' : 'Send Invitation'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. CHANGE ROLE MODAL */}
        {roleModalUser && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border/60 space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <h3 className="font-heading font-black text-lg text-brand-navy">Change Team Role</h3>
                <button
                  onClick={() => setRoleModalUser(null)}
                  className="p-1 rounded-lg text-brand-muted hover:text-brand-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Change role for <strong className="font-heading text-brand-navy">{roleModalUser.full_name}</strong> from{' '}
                <span className="font-mono font-bold text-brand-orange">{getRoleLabel(roleModalUser.role)}</span> to:
              </p>

              {roleError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{roleError}</span>
                </div>
              )}

              <select
                value={selectedNewRole}
                onChange={(e) => setSelectedNewRole(e.target.value as AdminRole)}
                className="w-full px-3.5 py-3 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange bg-white cursor-pointer min-h-[44px]"
              >
                {INVITEABLE_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRoleModalUser(null)}
                  disabled={changingRole}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleChangeRoleSubmit}
                  disabled={changingRole}
                  icon={changingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                >
                  {changingRole ? 'Updating...' : 'Change Role'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3. DEACTIVATE / REACTIVATE CONFIRMATION MODAL */}
        {statusModalUser && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border/60 space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <h3 className="font-heading font-black text-lg text-brand-navy">
                  {statusModalTargetState ? 'Reactivate Team Member?' : 'Deactivate Team Member?'}
                </h3>
                <button
                  onClick={() => setStatusModalUser(null)}
                  className="p-1 rounded-lg text-brand-muted hover:text-brand-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                {statusModalTargetState ? (
                  <>
                    Reactivate <strong className="font-heading text-brand-navy">{statusModalUser.full_name}</strong>? They will regain access to Friendli Admin according to their <span className="font-mono font-bold text-brand-orange">{getRoleLabel(statusModalUser.role)}</span> role.
                  </>
                ) : (
                  <>
                    Deactivate <strong className="font-heading text-brand-navy">{statusModalUser.full_name}</strong>? They will immediately lose access to Friendli Admin. Account history and notes will be preserved.
                  </>
                )}
              </p>

              {statusError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{statusError}</span>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStatusModalUser(null)}
                  disabled={updatingStatus}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant={statusModalTargetState ? 'primary' : 'outline'}
                  size="sm"
                  onClick={handleToggleStatusSubmit}
                  disabled={updatingStatus}
                  className={!statusModalTargetState ? 'border-red-300 text-red-600 hover:bg-red-50' : ''}
                  icon={updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                >
                  {updatingStatus
                    ? 'Updating...'
                    : statusModalTargetState
                    ? 'Reactivate'
                    : 'Deactivate Member'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
