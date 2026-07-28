import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
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

  const supabase = await createServerSupabaseClient();

  const [profilesRes, invitationsRes, deptsRes, activityRes, newCountRes] = await Promise.all([
    supabase
      .from('admin_profiles')
      .select('id, full_name, role, is_active, status, created_at, phone, avatar_url, department_id, departments(name, color)')
      .order('created_at', { ascending: false }),
    supabase
      .from('admin_invitations')
      .select('id, email, full_name, role, department_id, status, created_at, expires_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true }),
    supabase
      .from('admin_activity_logs')
      .select('id, actor_id, target_type, action, old_data, new_data, created_at')
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('enquiries')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new')
      .is('archived_at', null),
  ]);

  const rawMembers = profilesRes.data || [];
  const teamMembers: TeamMemberItem[] = rawMembers.map((m: any) => ({
    id: m.id,
    full_name: m.full_name,
    email: '', // populated via fallback or profile join
    phone: m.phone,
    avatar_url: m.avatar_url,
    role: m.role,
    department_id: m.department_id,
    department_name: m.departments?.name || null,
    department_color: m.departments?.color || null,
    is_active: m.is_active,
    status: m.status || (m.is_active ? 'active' : 'inactive'),
    created_at: m.created_at,
  }));

  const invitations: InvitationItem[] = (invitationsRes.data || []).map((inv: any) => ({
    id: inv.id,
    email: inv.email,
    full_name: inv.full_name,
    role: inv.role,
    department_id: inv.department_id,
    status: inv.status,
    created_at: inv.created_at,
    expires_at: inv.expires_at,
  }));

  const departments: DepartmentItem[] = deptsRes.data || [];
  const activityLogs: AuditLogItem[] = activityRes.data || [];
  const initialNewCount = newCountRes.count || 0;

  return (
    <Suspense>
      <TeamManagementClient
        initialMembers={teamMembers}
        initialInvitations={invitations}
        initialDepartments={departments}
        initialActivityLogs={activityLogs}
        initialNewCount={initialNewCount}
        adminName={authResult.fullName}
        adminEmail={authResult.email}
        adminRole={authResult.role}
      />
    </Suspense>
  );
}
