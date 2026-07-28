import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TeamManagementClient, TeamMemberItem, InvitationItem, DepartmentItem, AuditLogItem } from '@/components/admin/TeamManagementClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Team & Access Management | Friendli Admin',
  description: 'Manage staff accounts, departments, role permissions, and access controls.',
};

export default async function AdminTeamPage() {
  let authResult;
  try {
    authResult = await requirePermission('team.view');
  } catch (err: any) {
    if (err instanceof AuthorizationError && err.code === 'UNAUTHENTICATED') {
      redirect('/admin/login');
    }
    redirect('/admin/access-denied');
  }

  const serviceClient = createServiceRoleClient();
  const supabase = await createServerSupabaseClient();

  // Run server queries concurrently using serviceClient for reliable multi-user data join
  const [profilesRes, usersRes, invitationsRes, deptStatsRes, deptsFallbackRes, activityRes, enquiriesRes, newCountRes] = await Promise.all([
    serviceClient
      .from('admin_profiles')
      .select('id, full_name, role, is_active, status, created_at, phone, avatar_url, department_id, joined_at, last_login, created_by, departments(name, color)')
      .order('created_at', { ascending: false }),
    serviceClient.auth.admin.listUsers(),
    serviceClient
      .from('admin_invitations')
      .select('id, email, full_name, phone, role, department_id, status, created_at, expires_at, accepted_at, invited_by')
      .order('created_at', { ascending: false }),
    serviceClient
      .from('department_statistics_view')
      .select('*'),
    serviceClient
      .from('departments')
      .select('*')
      .order('name', { ascending: true }),
    serviceClient
      .from('admin_activity_logs')
      .select('id, actor_id, target_type, target_user_id, action, old_data, new_data, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
    serviceClient
      .from('enquiries')
      .select('id, assigned_to')
      .is('archived_at', null),
    supabase
      .from('enquiries')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new')
      .is('archived_at', null),
  ]);

  // Create fast map of user emails & metadata
  const userMap = new Map<string, { email: string; last_sign_in_at?: string }>();
  if (usersRes.data?.users) {
    usersRes.data.users.forEach((u) => {
      userMap.set(u.id, { email: u.email || '', last_sign_in_at: u.last_sign_in_at });
    });
  }

  // Calculate assigned enquiries per team member
  const assignmentMap = new Map<string, number>();
  if (enquiriesRes.data) {
    enquiriesRes.data.forEach((e) => {
      if (e.assigned_to) {
        assignmentMap.set(e.assigned_to, (assignmentMap.get(e.assigned_to) || 0) + 1);
      }
    });
  }

  const rawMembers = profilesRes.data || [];
  const allMembers: TeamMemberItem[] = rawMembers.map((m: any) => {
    const userInfo = userMap.get(m.id);
    return {
      id: m.id,
      full_name: m.full_name,
      email: userInfo?.email || authResult.email || 'team@friendlitripz.com',
      phone: m.phone || null,
      avatar_url: m.avatar_url || null,
      role: m.role,
      department_id: m.department_id,
      department_name: m.departments?.name || 'Admin',
      department_color: m.departments?.color || '#8B5CF6',
      is_active: m.is_active,
      status: m.status || (m.is_active ? 'active' : 'pending'),
      created_at: m.created_at,
      joined_at: m.joined_at || m.created_at,
      last_sign_in_at: m.last_login || userInfo?.last_sign_in_at || null,
      created_by: m.created_by || null,
      assigned_enquiries_count: assignmentMap.get(m.id) || 0,
    };
  });

  // Calculate SQL-computed department statistics
  const fallbackDepts = deptsFallbackRes.data || [];
  const statsData = deptStatsRes.data || [];

  const statsMap = new Map<string, any>();
  statsData.forEach((s: any) => {
    statsMap.set(s.department_id, s);
  });

  const departments: DepartmentItem[] = fallbackDepts.map((d: any) => {
    const st = statsMap.get(d.id);
    return {
      id: d.id,
      name: d.name,
      color: d.color,
      active: d.active,
      manager_id: d.manager_id || st?.manager_id || null,
      manager_name: st?.manager_name || null,
      total_members: st ? Number(st.total_members) : 0,
      active_members: st ? Number(st.active_members) : 0,
      pending_members: st ? Number(st.pending_members) : 0,
      suspended_members: st ? Number(st.suspended_members) : 0,
      archived_members: st ? Number(st.archived_members) : 0,
      pending_invitations_count: st ? Number(st.pending_invitations_count) : 0,
    };
  });

  // TEAM VISIBILITY RULES:
  // Owner: sees ALL members
  // Admin: sees ALL members (Owner marked read-only in UI)
  // Operations / Sales / Support / Viewer: sees ONLY their own profile
  let visibleMembers: TeamMemberItem[] = allMembers;
  if (['operations', 'sales', 'support', 'viewer'].includes(authResult.role)) {
    visibleMembers = allMembers.filter((m) => m.id === authResult.userId);
  }

  const invitations: InvitationItem[] = (invitationsRes.data || []).map((inv: any) => ({
    id: inv.id,
    email: inv.email,
    full_name: inv.full_name,
    phone: inv.phone || null,
    role: inv.role,
    department_id: inv.department_id,
    status: inv.status,
    created_at: inv.created_at,
    expires_at: inv.expires_at,
    accepted_at: inv.accepted_at || null,
    invited_by: inv.invited_by || null,
  }));

  const activityLogs: AuditLogItem[] = (activityRes.data || []).map((log: any) => ({
    id: log.id,
    actor_id: log.actor_id,
    target_type: log.target_type,
    target_id: log.target_user_id || null,
    action: log.action,
    old_data: log.old_data,
    new_data: log.new_data,
    created_at: log.created_at,
  }));
  const initialNewCount = newCountRes.count || 0;

  return (
    <Suspense>
      <TeamManagementClient
        initialMembers={visibleMembers}
        initialInvitations={invitations}
        initialDepartments={departments}
        initialActivityLogs={activityLogs}
        initialNewCount={initialNewCount}
        currentUserId={authResult.userId}
        adminName={authResult.fullName}
        adminEmail={authResult.email}
        adminRole={authResult.role}
      />
    </Suspense>
  );
}
