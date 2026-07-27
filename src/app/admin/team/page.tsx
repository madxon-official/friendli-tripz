import React from 'react';
import { redirect } from 'next/navigation';
import { authorizeAdmin, AuthorizationError } from '@/lib/auth/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { TeamListClient, TeamMemberItem } from '@/components/admin/TeamListClient';
import { AdminRole } from '@/lib/auth/roles';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Team Management | Friendli Admin',
  description: 'Manage who can access Friendli Admin and assign operational roles.',
};

export default async function AdminTeamPage() {
  let caller;
  try {
    // 1. Central Server-side authorization for 'team.view' permission (Owner only)
    caller = await authorizeAdmin('team.view');
  } catch (error) {
    if (error instanceof AuthorizationError) {
      if (error.code === 'UNAUTHENTICATED') {
        redirect('/admin/login');
      }
      redirect(`/admin/access-denied?reason=${error.code.toLowerCase()}`);
    }
    redirect('/admin/access-denied?reason=forbidden');
  }

  const serviceClient = createServiceRoleClient();

  // 2. Fetch admin profiles & auth metadata
  const [{ data: profiles, error: profileErr }, authUsersRes, newCountRes] = await Promise.all([
    serviceClient
      .from('admin_profiles')
      .select('id, full_name, role, is_active, created_at, updated_at')
      .order('created_at', { ascending: false }),
    serviceClient.auth.admin.listUsers({ page: 1, perPage: 100 }),
    serviceClient
      .from('enquiries')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new')
      .is('archived_at', null),
  ]);

  if (profileErr) {
    console.error('Error loading team profiles:', profileErr);
  }

  const authUserMap = new Map<string, { email: string; last_sign_in_at?: string | null }>();

  if (authUsersRes.data?.users) {
    authUsersRes.data.users.forEach((u) => {
      authUserMap.set(u.id, {
        email: u.email || '',
        last_sign_in_at: u.last_sign_in_at,
      });
    });
  }

  const teamMembers: TeamMemberItem[] = (profiles || []).map((p) => {
    const authData = authUserMap.get(p.id);
    const email = authData?.email || p.full_name.toLowerCase().replace(/\s+/g, '') + '@friendlitripz.com';
    const lastSignIn = authData?.last_sign_in_at;

    let status: 'Active' | 'Inactive' | 'Invited' = 'Active';
    if (!p.is_active) {
      status = 'Inactive';
    } else if (!lastSignIn) {
      status = 'Invited';
    } else {
      status = 'Active';
    }

    return {
      id: p.id,
      full_name: p.full_name,
      email,
      role: p.role as AdminRole,
      is_active: p.is_active,
      status,
      created_at: p.created_at,
      last_sign_in_at: lastSignIn,
    };
  });

  const initialNewCount = newCountRes.count || 0;

  return (
    <TeamListClient
      teamMembers={teamMembers}
      initialNewCount={initialNewCount}
      adminName={caller.fullName}
      adminEmail={caller.email}
      adminRole={caller.role}
    />
  );
}
