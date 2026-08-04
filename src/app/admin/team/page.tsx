'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Building2,
  History,
  Search,
  RotateCw,
  Pencil,
  Lock,
  Layers,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import {
  getEnterpriseTeamData,
  DbTeamMember,
  DbDepartment,
  DbInvitation,
  DbAuditLog
} from '@/lib/actions/teamActions';
import { InviteMemberModal } from '@/components/admin/team/InviteMemberModal';
import { MemberProfileDrawer } from '@/components/admin/team/MemberProfileDrawer';
import { EditStaffModal } from '@/components/admin/team/EditStaffModal';
import { InvitationsTab } from '@/components/admin/team/InvitationsTab';
import { DepartmentsTab } from '@/components/admin/team/DepartmentsTab';

import { useRealtimeSubscription } from '@/lib/hooks/useRealtime';

export default function TeamManagementEnterprisePage() {
  const [activeTab, setActiveTab] = useState<'members' | 'invitations' | 'departments' | 'audit'>('members');

  // State
  const [members, setMembers] = useState<DbTeamMember[]>([]);
  const [departments, setDepartments] = useState<DbDepartment[]>([]);
  const [invitations, setInvitations] = useState<DbInvitation[]>([]);
  const [auditLogs, setAuditLogs] = useState<DbAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawers
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedDrawerMember, setSelectedDrawerMember] = useState<DbTeamMember | null>(null);
  const [selectedEditMember, setSelectedEditMember] = useState<DbTeamMember | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    const data = await getEnterpriseTeamData();
    setMembers(data.members);
    setDepartments(data.departments);
    setInvitations(data.invitations);
    setAuditLogs(data.auditLogs);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
    async function fetchUser() {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentAdminId(data.user.id);
      }
    }
    fetchUser();
  }, []);

  useRealtimeSubscription('enquiries', () => {
    loadAllData();
  });

  // Instant 0ms Client-Side Filtering (Zero Network Re-fetches on Keystrokes)
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.department.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'All' || m.role.toLowerCase() === roleFilter.toLowerCase();
      const matchesDept = deptFilter === 'All' || m.department.toLowerCase() === deptFilter.toLowerCase();
      const matchesStatus = statusFilter === 'All' || m.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesDept && matchesStatus;
    });
  }, [members, searchQuery, roleFilter, deptFilter, statusFilter]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in text-slate-100">
      {/* 1. Header & Primary Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>Team</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-brand-orange" /> Team Management Enterprise
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Enterprise Access Control, Department Management & Staff Directory.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadAllData}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh Operations Data"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-orange' : ''}`} />
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-orange text-white text-xs font-extrabold shadow-lg hover:bg-brand-orange/90 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Invite Member +
          </button>
        </div>
      </div>

      {/* 2. Operational Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Active Staff</span>
            <span className="text-lg font-extrabold text-white">{members.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Pending Invites</span>
            <span className="text-lg font-extrabold text-white">{invitations.filter((i) => i.status === 'pending').length}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Departments</span>
            <span className="text-lg font-extrabold text-white">{departments.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Audit Events</span>
            <span className="text-lg font-extrabold text-white">{auditLogs.length}</span>
          </div>
        </div>
      </div>

      {/* 3. Segmented Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'members'
              ? 'bg-slate-900 text-brand-orange border border-slate-800 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <Users className="w-4 h-4" /> Members ({members.length})
        </button>

        <button
          onClick={() => setActiveTab('invitations')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'invitations'
              ? 'bg-slate-900 text-brand-orange border border-slate-800 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <UserPlus className="w-4 h-4" /> Invitations ({invitations.length})
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'departments'
              ? 'bg-slate-900 text-brand-orange border border-slate-800 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <Building2 className="w-4 h-4" /> Departments ({departments.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-brand-orange border border-slate-800 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <History className="w-4 h-4" /> Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* 4. Tab Views */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Search & Filter Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, phone, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-orange flex-1 sm:flex-none"
              >
                <option value="All">All Roles</option>
                <option value="owner">Owner</option>
                <option value="admin">Administrator</option>
                <option value="operations">Operations</option>
                <option value="support">Support</option>
              </select>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-orange flex-1 sm:flex-none"
              >
                <option value="All">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-orange flex-1 sm:flex-none"
              >
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>
          </div>

          {/* Members Data Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    <th className="py-4 px-6">Avatar</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Assigned Leads</th>
                    <th className="py-4 px-6">Joined / Login</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      onClick={() => setSelectedDrawerMember(member)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Avatar with Status Dot */}
                      <td className="py-4 px-6">
                        <div className="relative w-9 h-9 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-white font-extrabold text-xs">
                          {member.name.charAt(0).toUpperCase()}
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-4 px-6 font-bold text-white group-hover:text-brand-orange transition-colors">
                        {member.name}
                        {member.id === currentAdminId && (
                          <span className="ml-2 text-[10px] text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">(You)</span>
                        )}
                      </td>

                      {/* Department */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                          {member.department}
                        </span>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase border ${
                            member.role === 'owner'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-brand-orange/15 text-brand-orange border-brand-orange/30'
                          }`}
                        >
                          {member.role.toUpperCase()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold capitalize">
                          {member.status}
                        </span>
                      </td>

                      {/* Assigned Leads */}
                      <td className="py-4 px-6 font-mono text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-brand-orange" /> {member.assigned_enquiries_count}
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 font-mono text-slate-400">{member.joined_date}</td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        {member.role === 'owner' ? (
                          <span className="text-[11px] font-mono text-amber-400/80 flex items-center justify-end gap-1">
                            <Lock className="w-3 h-3" /> Owner Protected
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedEditMember(member)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit Staff Member"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invitations' && <InvitationsTab invitations={invitations} />}

      {activeTab === 'departments' && <DepartmentsTab departments={departments} />}

      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-extrabold text-white mb-2">Administrative Audit Logs</h3>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white">{log.actor_name}</span>
                    <span className="text-brand-orange font-bold">{log.action}</span>
                    <span className="text-slate-400">{log.target_name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">{log.details}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{log.created_at}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={loadAllData}
        departments={departments}
      />

      {/* Slide-over Profile Drawer */}
      <MemberProfileDrawer
        member={selectedDrawerMember}
        isOpen={!!selectedDrawerMember}
        onClose={() => setSelectedDrawerMember(null)}
      />

      {/* Edit Staff Modal */}
      <EditStaffModal
        member={selectedEditMember}
        departments={departments}
        isOpen={!!selectedEditMember}
        onClose={() => setSelectedEditMember(null)}
        onSuccess={loadAllData}
      />
    </div>
  );
}
