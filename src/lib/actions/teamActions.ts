'use server';

import { AdminRole } from '@/lib/rbac/roles';
import { z } from 'zod';
import crypto from 'crypto';
import { sendTeamInviteEmail } from '@/lib/integrations/email';

export interface DbTeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  department_id?: string;
  role: AdminRole;
  status: 'active' | 'pending' | 'deactivated' | 'suspended';
  joined_date: string;
  last_active: string;
  assigned_enquiries_count: number; // Active leads (excluding completed & cancelled)
  completed_enquiries_count?: number; // Total completed trips
  total_enquiries_count?: number; // Total all-time assigned leads
  created_by?: string;
}

export interface DbDepartment {
  id: string;
  name: string;
  color: string;
  manager_name?: string;
  active_members?: number;
  total_staff?: number;
  suspended?: number;
  pending_invites?: number;
}

export interface DbInvitation {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: AdminRole;
  department: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  sent_date: string;
  expiry_date: string;
  accepted_date?: string;
  token?: string;
}

export interface DbAuditLog {
  id: string;
  actor_name: string;
  action: string;
  target_name?: string;
  details: string;
  created_at: string;
}

export interface EnterpriseTeamPayload {
  members: DbTeamMember[];
  departments: DbDepartment[];
  invitations: DbInvitation[];
  auditLogs: DbAuditLog[];
}

const inviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  department: z.string().min(1, 'Please select a department'),
  role: z.enum(['admin', 'operations', 'support']),
});

/**
 * HIGH PERFORMANCE UNIFIED SERVER ACTION
 * Aggregates all team data dynamically from production Supabase database.
 */
export async function getEnterpriseTeamData(): Promise<EnterpriseTeamPayload> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();

    // Execute parallel database queries on server side
    const [deptRes, profileRes, inviteRes, auditRes, authUsersRes, enqRes] = await Promise.all([
      supabase.from('departments').select('*').order('name'),
      supabase.from('admin_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_invitations').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_audit_log').select('*').order('created_at', { ascending: false }).limit(30),
      supabase.auth.admin.listUsers(),
      supabase.from('enquiries').select('id, assigned_to, status'),
    ]);

    const deptsData = deptRes.data || [];
    let profilesData = profileRes.data || [];
    const invitesData = inviteRes.data || [];
    const auditData = auditRes.data || [];
    const authUsers = authUsersRes.data?.users || [];
    const enquiriesData = enqRes.data || [];

    // Map active, completed, and total lead counts per staff member ID
    const activeLeadMap = new Map<string, number>();
    const completedLeadMap = new Map<string, number>();
    const totalLeadMap = new Map<string, number>();

    enquiriesData.forEach((e: any) => {
      if (e.assigned_to) {
        totalLeadMap.set(e.assigned_to, (totalLeadMap.get(e.assigned_to) || 0) + 1);

        if (e.status === 'completed') {
          completedLeadMap.set(e.assigned_to, (completedLeadMap.get(e.assigned_to) || 0) + 1);
        } else if (e.status !== 'cancelled') {
          activeLeadMap.set(e.assigned_to, (activeLeadMap.get(e.assigned_to) || 0) + 1);
        }
      }
    });

    // Email lookup map from auth.users
    const authEmailMap = new Map<string, string>();
    authUsers.forEach((u) => {
      if (u.email) authEmailMap.set(u.id, u.email);
    });

    // Self-healing: if a user exists in auth.users (e.g. invited user) but has no admin_profiles record, auto-provision profile!
    for (const user of authUsers) {
      if (user.email && !profilesData.some((p: any) => p.id === user.id)) {
        try {
          const invMatch = invitesData.find((i: any) => i.email.toLowerCase() === user.email?.toLowerCase());
          const newProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || invMatch?.full_name || user.email.split('@')[0],
            role: invMatch?.role || 'admin',
            department_id: invMatch?.department_id || null,
            phone: user.user_metadata?.phone || invMatch?.phone || null,
            status: 'active',
            is_active: true,
            created_at: user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await supabase.from('admin_profiles').upsert(newProfile);
          profilesData.push(newProfile);
        } catch (e) {
          console.error('[Auto-provision Profile Error]', e);
        }
      }
    }

    // Map departments
    const deptMap = new Map<string, string>();
    deptsData.forEach((d: any) => deptMap.set(d.id, d.name));

    // Profile map for actor lookups
    const profileMap = new Map<string, string>();
    profilesData.forEach((p: any) => profileMap.set(p.id, p.full_name || authEmailMap.get(p.id) || 'Staff'));

    const departments: DbDepartment[] = deptsData.map((d: any) => {
      const deptProfiles = profilesData.filter((p: any) => p.department_id === d.id);
      const deptInvites = invitesData.filter((i: any) => i.department_id === d.id && i.status === 'pending');
      const managerProfile = profilesData.find((p: any) => p.id === d.manager_id);

      return {
        id: d.id,
        name: d.name,
        color: d.color || '#FF6500',
        manager_name: managerProfile ? managerProfile.full_name : 'Unassigned',
        active_members: deptProfiles.filter((p: any) => p.status === 'active' || p.status === undefined || p.is_active).length,
        total_staff: deptProfiles.length,
        suspended: deptProfiles.filter((p: any) => p.status === 'suspended' || p.status === 'deactivated' || p.is_active === false).length,
        pending_invites: deptInvites.length,
      };
    });

    // Map members
    const members: DbTeamMember[] = profilesData.map((row: any) => ({
      id: row.id,
      name: row.full_name || 'Team Member',
      email: authEmailMap.get(row.id) || row.email || row.full_name?.toLowerCase().replace(/\s+/g, '') + '@friendlitripz.com',
      phone: row.phone || 'N/A',
      department: row.department_id ? deptMap.get(row.department_id) || 'Operations' : 'Operations',
      department_id: row.department_id,
      role: (row.role as AdminRole) || 'operations',
      status: (row.status as any) || (row.is_active === false ? 'deactivated' : 'active'),
      joined_date: row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '28 Jul 2026',
      last_active: row.updated_at ? new Date(row.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active',
      assigned_enquiries_count: activeLeadMap.get(row.id) || 0,
      completed_enquiries_count: completedLeadMap.get(row.id) || 0,
      total_enquiries_count: totalLeadMap.get(row.id) || 0,
      created_by: row.created_by ? profileMap.get(row.created_by) || 'System' : 'System',
    }));

    // Map invitations
    const invitations: DbInvitation[] = invitesData.map((row: any) => ({
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      phone: row.phone || 'N/A',
      role: row.role || 'operations',
      department: row.department_id ? deptMap.get(row.department_id) || 'Operations' : 'Operations',
      invited_by: row.invited_by ? profileMap.get(row.invited_by) || 'Admin' : 'Admin',
      status: row.status || 'pending',
      sent_date: row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB') : 'N/A',
      expiry_date: row.expires_at ? new Date(row.expires_at).toLocaleDateString('en-GB') : 'N/A',
      accepted_date: row.accepted_at ? new Date(row.accepted_at).toLocaleDateString('en-GB') : undefined,
      token: row.token,
    }));

    // Map audit logs
    const auditLogs: DbAuditLog[] = auditData.map((row: any) => ({
      id: row.id,
      actor_name: row.admin_id ? profileMap.get(row.admin_id) || 'System Admin' : 'System',
      action: row.action,
      target_name: row.metadata?.full_name || row.metadata?.name || 'Member',
      details: typeof row.metadata === 'object' ? JSON.stringify(row.metadata) : String(row.metadata || ''),
      created_at: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return { members, departments, invitations, auditLogs };
  } catch (err) {
    console.error('[getEnterpriseTeamData Error]', err);
    return { members: [], departments: [], invitations: [], auditLogs: [] };
  }
}

/**
 * Fetches all team members dynamically from Supabase database.
 */
export async function getTeamMembers(searchQuery: string = '', roleFilter: string = 'All'): Promise<DbTeamMember[]> {
  const data = await getEnterpriseTeamData();
  let result = data.members;
  if (roleFilter && roleFilter !== 'All') {
    result = result.filter((m) => m.role === roleFilter.toLowerCase());
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q));
  }
  return result;
}

/**
 * Fetches active departments from Supabase database.
 */
export async function getDepartments(): Promise<DbDepartment[]> {
  const data = await getEnterpriseTeamData();
  return data.departments;
}

/**
 * Fetches team invitations lifecycle list from Supabase.
 */
export async function getInvitations(): Promise<DbInvitation[]> {
  const data = await getEnterpriseTeamData();
  return data.invitations;
}

/**
 * Database Automation: Accepts an invitation token, updates admin_invitations, and provisions staff profile.
 */
export async function acceptTeamInvitation(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();

    // Query invitation by token or ID
    const { data: inv, error: fetchErr } = await supabase
      .from('admin_invitations')
      .select('*')
      .or(`token.eq.${token},id.eq.${token}`)
      .maybeSingle();

    if (fetchErr || !inv) {
      return { success: false, error: 'Invitation link is invalid or has expired.' };
    }

    if (inv.status === 'accepted') {
      return { success: false, error: 'This invitation has already been accepted.' };
    }

    if (inv.expires_at && new Date(inv.expires_at) < new Date()) {
      await supabase.from('admin_invitations').update({ status: 'expired' }).eq('id', inv.id);
      return { success: false, error: 'This invitation link has expired. Please request a new invitation.' };
    }

    const now = new Date().toISOString();

    // Mark invitation as accepted
    await supabase
      .from('admin_invitations')
      .update({ status: 'accepted', accepted_at: now })
      .eq('id', inv.id);

    // Upsert into admin_profiles
    const { error: profileErr } = await supabase.from('admin_profiles').upsert({
      email: inv.email,
      full_name: inv.full_name,
      phone: inv.phone || null,
      role: inv.role || 'operations',
      department_id: inv.department_id || null,
      status: 'active',
      is_active: true,
      updated_at: now,
    });

    if (profileErr) {
      console.error('[acceptTeamInvitation Profile Upsert Error]', profileErr);
    }

    // Insert Audit Log
    await supabase.from('admin_audit_log').insert({
      admin_id: inv.invited_by || null,
      action: 'Invitation Accepted',
      metadata: { invitation_id: inv.id, email: inv.email, full_name: inv.full_name, role: inv.role },
    });

    // Insert Admin Notification
    await supabase.from('admin_notifications').insert({
      recipient_id: null,
      title: 'Invitation Accepted',
      body: `${inv.full_name} (${inv.email}) accepted the invitation and joined as ${inv.role.toUpperCase()}.`,
      type: 'team_invite',
      link: '/admin/team',
      is_read: false,
    });

    return { success: true };
  } catch (err: any) {
    console.error('[acceptTeamInvitation Exception]', err);
    return { success: false, error: 'Failed to process team invitation acceptance.' };
  }
}

/**
 * Fetches system audit logs from Supabase.
 */
export async function getAuditLogs(): Promise<DbAuditLog[]> {
  const data = await getEnterpriseTeamData();
  return data.auditLogs;
}

/**
 * Generates a secure invitation token, saves to Supabase invitations, dispatches email, and emits notifications.
 */
export async function inviteTeamMember(input: {
  name: string;
  email: string;
  phone: string;
  department: string;
  role: AdminRole;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const parseResult = inviteSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: parseResult.error.issues[0]?.message || 'Invalid input data' };
    }

    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();

    // Retrieve current authenticated admin
    const currentAdmin = await getCurrentAdminProfile();

    // Resolve department ID from name
    const { data: dept } = await supabase.from('departments').select('id').eq('name', input.department).maybeSingle();

    const getAppBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
      if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
      if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
      return 'http://localhost:3000';
    };

    const baseUrl = getAppBaseUrl();
    const redirectTo = `${baseUrl}/admin/set-password`;

    // 1. Dispatch official Supabase Auth Invitation Email natively
    const { data: authData, error: authErr } = await supabase.auth.admin.inviteUserByEmail(input.email, {
      redirectTo,
      data: {
        full_name: input.name,
        phone: input.phone,
        role: input.role,
        department: input.department,
      },
    });

    if (authErr) {
      console.warn('[Supabase Auth Admin Invite Warning]', authErr.message);
    }

    // Also dispatch custom branded transactional email with complete invite context
    const inviteUrl = `${baseUrl}/admin/set-password?token=${authData?.user?.id || ''}&email=${encodeURIComponent(input.email)}`;
    await sendTeamInviteEmail({
      toEmail: input.email,
      recipientName: input.name,
      role: input.role,
      department: input.department,
      inviteUrl,
    });

    const token = authData?.user?.id || crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // 2. Save invitation tracking record to admin_invitations table
    const { error: inviteErr } = await supabase.from('admin_invitations').upsert(
      {
        full_name: input.name,
        email: input.email,
        phone: input.phone,
        role: input.role,
        department_id: dept?.id || null,
        invited_by: currentAdmin?.id || null,
        status: 'pending',
        token,
        expires_at: expiresAt,
      },
      { onConflict: 'email' }
    );

    if (inviteErr) {
      console.error('[Invitation DB Error]', inviteErr);
    }

    // 3. Record Audit Log
    await supabase.from('admin_audit_log').insert({
      admin_id: currentAdmin?.id || null,
      action: 'Member Invited',
      metadata: { full_name: input.name, email: input.email, role: input.role, department: input.department },
    });

    // 4. Send Notification
    await supabase.from('admin_notifications').insert({
      recipient_id: null,
      title: 'New Team Member Invited',
      body: `${currentAdmin?.name || 'Admin'} invited ${input.name} as ${input.role.toUpperCase()} in ${input.department}.`,
      type: 'team_invite',
      link: '/admin/team',
      is_read: false,
    });

    return { success: true };
  } catch (err: any) {
    console.error('[Invite Error]', err);
    return { success: false, error: 'Failed to process team member invitation.' };
  }
}

/**
 * Updates full profile data for a staff member with Owner protection and Audit logging.
 */
export async function updateMemberProfile(
  memberId: string,
  data: { name: string; phone: string; department_id?: string; role: AdminRole }
): Promise<boolean> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();
    const currentAdmin = await getCurrentAdminProfile();

    const { data: member } = await supabase.from('admin_profiles').select('role, full_name').eq('id', memberId).single();
    if (member?.role === 'owner' && data.role !== 'owner') {
      console.error('[Owner Protection] Cannot downgrade Owner role directly.');
      return false;
    }

    await supabase
      .from('admin_profiles')
      .update({
        full_name: data.name,
        phone: data.phone,
        department_id: data.department_id || null,
        role: data.role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', memberId);

    // Audit log
    await supabase.from('admin_audit_log').insert({
      admin_id: currentAdmin?.id || null,
      action: 'Profile Updated',
      target_user_id: memberId,
      metadata: { target_name: data.name, new_role: data.role },
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Updates member role with Owner protection.
 */
export async function updateMemberRole(memberId: string, newRole: AdminRole): Promise<boolean> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();
    const currentAdmin = await getCurrentAdminProfile();

    const { data: member } = await supabase.from('admin_profiles').select('role, full_name').eq('id', memberId).single();
    if (member?.role === 'owner') {
      console.error('[Owner Protection] Cannot change Owner role directly.');
      return false;
    }

    await supabase.from('admin_profiles').update({ role: newRole, updated_at: new Date().toISOString() }).eq('id', memberId);

    await supabase.from('admin_audit_log').insert({
      admin_id: currentAdmin?.id || null,
      action: 'Role Updated',
      target_user_id: memberId,
      metadata: { target_name: member?.full_name || 'Member', new_role: newRole },
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Updates member status (Active / Deactivated / Suspended).
 */
export async function updateMemberStatus(memberId: string, newStatus: string): Promise<boolean> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();
    const currentAdmin = await getCurrentAdminProfile();

    const { data: member } = await supabase.from('admin_profiles').select('role, full_name').eq('id', memberId).single();
    if (member?.role === 'owner') {
      console.error('[Owner Protection] Cannot deactivate Owner account.');
      return false;
    }

    const isActive = newStatus === 'active';
    await supabase.from('admin_profiles').update({ status: newStatus, is_active: isActive, updated_at: new Date().toISOString() }).eq('id', memberId);

    await supabase.from('admin_audit_log').insert({
      admin_id: currentAdmin?.id || null,
      action: 'Status Updated',
      target_user_id: memberId,
      metadata: { target_name: member?.full_name || 'Member', status: newStatus },
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Fetches full profile details for a team member by ID.
 */
export async function fetchMemberProfile(memberId: string): Promise<DbTeamMember | null> {
  try {
    const members = await getTeamMembers();
    return members.find((m) => m.id === memberId) || null;
  } catch {
    return null;
  }
}

/**
 * Fetches current authenticated user's profile dynamically from Supabase Auth & admin_profiles.
 */
export async function getCurrentAdminProfile(): Promise<DbTeamMember | null> {
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase.from('admin_profiles').select('*').eq('id', user.id).single();
      if (profile) {
        return {
          id: profile.id,
          name: profile.full_name || user.email || 'Admin User',
          email: user.email || '',
          phone: profile.phone || 'N/A',
          department: 'Management',
          department_id: profile.department_id,
          role: (profile.role as AdminRole) || 'owner',
          status: profile.is_active ? 'active' : 'deactivated',
          joined_date: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
          last_active: 'Just now',
          assigned_enquiries_count: 0,
        };
      }
    }

    // Fallback if session user profile is in initial setup
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const serviceSupabase = createServiceRoleClient();

    const { data: profiles } = await serviceSupabase.from('admin_profiles').select('*').limit(1);
    if (profiles && profiles.length > 0) {
      const row = profiles[0];
      return {
        id: row.id,
        name: row.full_name || 'Admin User',
        email: row.email || 'admin@friendlitripz.com',
        phone: row.phone || 'N/A',
        department: 'Management',
        department_id: row.department_id,
        role: (row.role as AdminRole) || 'owner',
        status: (row.status as any) || 'active',
        joined_date: row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
        last_active: 'Just now',
        assigned_enquiries_count: 0,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Verifies or provisions an active admin_profiles record via Service Role client.
 * Fixes RLS permission blocks on client login for newly invited auth users.
 */
export async function verifyAndProvisionAdminProfile(userId: string, email: string): Promise<{ is_active: boolean; role: string; full_name?: string } | null> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();

    let { data: profile } = await supabase
      .from('admin_profiles')
      .select('is_active, role, full_name')
      .eq('id', userId)
      .maybeSingle();

    if (!profile || !profile.is_active) {
      const { data: inv } = await supabase
        .from('admin_invitations')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      const { data: newProf } = await supabase
        .from('admin_profiles')
        .upsert({
          id: userId,
          full_name: inv?.full_name || email.split('@')[0],
          role: inv?.role || 'admin',
          department_id: inv?.department_id || null,
          phone: inv?.phone || null,
          status: 'active',
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .select('is_active, role, full_name')
        .single();

      profile = newProf;
    }

    return profile || null;
  } catch (err) {
    console.error('[verifyAndProvisionAdminProfile Error]', err);
    return null;
  }
}

/**
 * Marks all notifications as read in Supabase database.
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();
    await supabase.from('admin_notifications').update({ is_read: true }).eq('is_read', false);
    return true;
  } catch {
    return false;
  }
}

