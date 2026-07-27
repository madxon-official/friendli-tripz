import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, AuthorizationError } from '@/lib/auth/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { isValidRole } from '@/lib/auth/roles';

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize caller has 'team.invite' permission (Owner only)
    const caller = await authorizeAdmin('team.invite');

    const body = await req.json();
    const { fullName, email, role } = body;

    // 2. Validate input fields
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

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    if (!role || !isValidRole(role) || role === 'owner') {
      return NextResponse.json(
        { success: false, error: 'Invalid role choice. Choose Admin, Operations, or Sales.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    // Determine production/development App URL
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
    const redirectTo = `${appUrl}/admin/set-password`;

    // 3. Send Invitation via Supabase Auth Admin API
    const { data: inviteData, error: inviteError } = await serviceClient.auth.admin.inviteUserByEmail(
      trimmedEmail,
      {
        redirectTo,
        data: {
          full_name: trimmedName,
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

    // 4. Create/Upsert pre-configured admin profile safely
    const { error: profileError } = await serviceClient
      .from('admin_profiles')
      .upsert({
        id: invitedUserId,
        full_name: trimmedName,
        role: role,
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Admin profile upsert error:', profileError);
      return NextResponse.json(
        { success: false, error: 'User invited, but failed to create admin profile.' },
        { status: 500 }
      );
    }

    // 5. Write security audit log
    try {
      await serviceClient.from('admin_audit_log').insert({
        admin_id: caller.userId,
        action: 'team.invited',
        target_user_id: invitedUserId,
        metadata: {
          invited_email: trimmedEmail,
          assigned_role: role,
          full_name: trimmedName,
        },
      });
    } catch (auditErr) {
      console.warn('Could not record audit log:', auditErr);
    }

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
