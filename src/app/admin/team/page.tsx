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
  const [profilesRes, usersRes, invitationsRes, deptsRes, activityRes, enquiriesRes, newCountRes] = await Promise.all([
    serviceClient
      .from('admin_profiles')
      .select('id, full_name, role, is_active, status, created_at, created_by, phone, avatar_url, department_id, departments(name, color)')
      .order('created_at', { ascending: false }),
    serviceClient.auth.admin.listUsers(),
    serviceClient
      .from('admin_invitations')
      .select('id, email, full_name, role, department_id, invited_by, phone, status, created_at, expires_at, accepted_at')
      .order('created_at', { ascending: false }),
    serviceClient
      .from('departments')
      .select('id, name, color, active, manager_id, archived_at')
      .order('name', { ascending: true }),
    serviceClient
      .from('admin_activity_logs')
      .select('id, actor_id, target_type, action, old_data, new_data, created_at')
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

  // Create name map for user IDs
  const userNameMap = new Map<string, string>();
  (profilesRes.data || []).forEach((p: any) => {
    userNameMap.set(p.id, p.full_name);
  });

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
      status: m.status || (m.is_active ? 'active' : 'inactive'),
      created_at: m.created_at,
      created_by: m.created_by ? userNameMap.get(m.created_by) || 'System' : 'System',
      last_sign_in_at: userInfo?.last_sign_in_at || null,
      assigned_enquiries_count: assignmentMap.get(m.id) || 0,
    };
  });

  // Calculate department statistics
  const totalCountMap = new Map<string, number>();
  const activeCountMap = new Map<string, number>();
  const suspendedCountMap = new Map<string, number>();
  const pendingInvitesCountMap = new Map<string, number>();

  allMembers.forEach((m) => {
    if (m.department_id) {
      totalCountMap.set(m.department_id, (totalCountMap.get(m.department_id) || 0) + 1);
      if (m.is_active && m.status === 'active') {
        activeCountMap.set(m.department_id, (activeCountMap.get(m.department_id) || 0) + 1);
      }
      if (m.status === 'suspended') {
        suspendedCountMap.set(m.department_id, (suspendedCountMap.get(m.department_id) || 0) + 1);
      }
    }
  });

  const rawInvitations = invitationsRes.data || [];
  const invitations: InvitationItem[] = rawInvitations.map((inv: any) => {
    if (inv.department_id && inv.status === 'pending') {
      pendingInvitesCountMap.set(inv.department_id, (pendingInvitesCountMap.get(inv.department_id) || 0) + 1);
    }
    return {
      id: inv.id,
      email: inv.email,
      full_name: inv.full_name,
      phone: inv.phone || null,
      role: inv.role,
      department_id: inv.department_id,
      invited_by: inv.invited_by,
      invited_by_name: userNameMap.get(inv.invited_by) || 'Admin',
      status: inv.status,
      created_at: inv.created_at,
      expires_at: inv.expires_at,
      accepted_at: inv.accepted_at || null,
    };
  });

  const departments: DepartmentItem[] = (deptsRes.data || []).map((d: any) => ({
    id: d.id,
    name: d.name,
    color: d.color,
    active: d.active,
    manager_id: d.manager_id || null,
    manager_name: d.manager_id ? userNameMap.get(d.manager_id) || null : null,
    total_members: totalCountMap.get(d.id) || 0,
    member_count: activeCountMap.get(d.id) || 0,
    active_members: activeCountMap.get(d.id) || 0,
    suspended_members: suspendedCountMap.get(d.id) || 0,
    pending_invitations: pendingInvitesCountMap.get(d.id) || 0,
  }));

  // TEAM VISIBILITY RULES:
  // Owner: sees ALL members
  // Admin: sees ALL members (Owner marked read-only in UI)
  // Operations / Sales / Support / Viewer: sees ONLY their own profile
  let visibleMembers: TeamMemberItem[] = allMembers;
  if (['operations', 'sales', 'support', 'viewer'].includes(authResult.role)) {
    visibleMembers = allMembers.filter((m) => m.id === authResult.userId);
  }

  const activityLogs: AuditLogItem[] = activityRes.data || [];
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
