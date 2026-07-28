import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { isValidRole, AdminRole, canManageTargetRole } from '@/lib/rbac/roles';
import { logActivity } from '@/lib/rbac/audit';
import { createAdminNotification } from '@/lib/rbac/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, role, departmentId } = body;

    // Validate input fields
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Full Name is required.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone ? phone.replace(/\D/g, '') : null;

    if (!role || !isValidRole(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role selection.' },
        { status: 400 }
      );
    }

    if (role === 'owner') {
      return NextResponse.json(
        { success: false, error: 'Owner role cannot be assigned via invitation. Use Transfer Ownership.' },
        { status: 400 }
      );
    }

    // 1. Authorize caller has 'team.invite' permission and can manage target role
    const caller = await requirePermission('team.invite', role as AdminRole);

    if (!canManageTargetRole(caller.role, role as AdminRole)) {
      return NextResponse.json(
        { success: false, error: `You do not have authority to invite a user with the '${role}' role.` },
        { status: 403 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    const serviceClient = createServiceRoleClient();

    // Determine production/development App URL dynamically
    let baseAppUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    if (!baseAppUrl) {
      const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
      const proto = req.headers.get('x-forwarded-proto') || 'https';
      if (host) {
        baseAppUrl = `${proto}://${host}`;
      } else {
        baseAppUrl = 'http://localhost:3000';
      }
    }
    const appUrl = baseAppUrl.replace(/\/$/, '');
    const redirectTo = `${appUrl}/admin/set-password`;

    // 2. Send Invitation via Supabase Auth Admin API
    const { data: inviteData, error: inviteError } = await serviceClient.auth.admin.inviteUserByEmail(
      trimmedEmail,
      {
        redirectTo,
        data: {
          full_name: trimmedName,
          phone: cleanPhone,
        },
      }
    );

    if (inviteError || !inviteData.user) {
      console.error('Supabase Auth invite error:', inviteError);
      return NextResponse.json(
        { success: false, error: inviteError?.message || 'Failed to send invitation email.' },
        { status: 400 }
      );
    }

    const invitedUserId = inviteData.user.id;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // 3. Upsert admin profile record safely with department assignment
    const { error: profileError } = await serviceClient
      .from('admin_profiles')
      .upsert({
        id: invitedUserId,
        full_name: trimmedName,
        phone: cleanPhone,
        role: role,
        department_id: departmentId || null,
        is_active: false,
        status: 'pending',
        created_by: caller.userId,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Admin profile upsert error:', profileError);
    }

    // 4. Record invitation record in admin_invitations table
    await serviceClient.from('admin_invitations').insert({
      email: trimmedEmail,
      full_name: trimmedName,
      phone: cleanPhone,
      role,
      department_id: departmentId || null,
      invited_by: caller.userId,
      status: 'pending',
      expires_at: expiresAt,
    });

    // 5. Write activity audit log & notification
    await logActivity({
      actorId: caller.userId,
      targetType: 'invitation',
      targetId: invitedUserId,
      action: 'invite',
      newData: {
        email: trimmedEmail,
        name: trimmedName,
        role,
        department_id: departmentId,
      },
      req,
    });

    await createAdminNotification({
      title: 'Team Invitation Sent',
      body: `${caller.fullName} invited ${trimmedName} (${role.toUpperCase()}) to Friendli Admin.`,
      type: 'team_joined',
      link: '/admin/team?tab=invitations',
    });

    return NextResponse.json({
      success: true,
      message: `Invitation email sent successfully to ${trimmedEmail}.`,
      user: {
        id: invitedUserId,
        email: trimmedEmail,
        fullName: trimmedName,
        role,
      },
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Invite API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
