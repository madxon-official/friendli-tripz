import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, AuthorizationError } from '@/lib/auth/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { isValidRole } from '@/lib/auth/roles';

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize caller has 'team.change_role' permission (Owner only)
    const caller = await authorizeAdmin('team.change_role');

    const body = await req.json();
    const { targetUserId, newRole } = body;

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Target User ID is required.' },
        { status: 400 }
      );
    }

    if (!newRole || !isValidRole(newRole) || newRole === 'owner') {
      return NextResponse.json(
        { success: false, error: 'Role can only be changed to Admin, Operations, or Sales.' },
        { status: 400 }
      );
    }

    if (targetUserId === caller.userId) {
      return NextResponse.json(
        { success: false, error: 'You cannot change your own role.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    // Fetch target user's current profile
    const { data: targetProfile, error: targetError } = await serviceClient
      .from('admin_profiles')
      .select('id, full_name, role, is_active')
      .eq('id', targetUserId)
      .single();

    if (targetError || !targetProfile) {
      return NextResponse.json(
        { success: false, error: 'Target admin profile not found.' },
        { status: 404 }
      );
    }

    // Protection rule: cannot change an Owner's role via normal API
    if (targetProfile.role === 'owner') {
      return NextResponse.json(
        { success: false, error: 'Owner roles cannot be modified.' },
        { status: 403 }
      );
    }

    const oldRole = targetProfile.role;

    if (oldRole === newRole) {
      return NextResponse.json({
        success: true,
        message: 'Role is already set to ' + newRole,
      });
    }

    // Update target profile role
    const { error: updateError } = await serviceClient
      .from('admin_profiles')
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (updateError) {
      console.error('Role update database error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update user role in database.' },
        { status: 500 }
      );
    }

    // Write security audit log
    try {
      await serviceClient.from('admin_audit_log').insert({
        admin_id: caller.userId,
        action: 'team.role_changed',
        target_user_id: targetUserId,
        metadata: {
          target_name: targetProfile.full_name,
          old_role: oldRole,
          new_role: newRole,
        },
      });
    } catch (auditErr) {
      console.warn('Could not record audit log:', auditErr);
    }

    return NextResponse.json({
      success: true,
      message: `Role for ${targetProfile.full_name} updated from ${oldRole} to ${newRole}.`,
      profile: {
        id: targetUserId,
        fullName: targetProfile.full_name,
        role: newRole,
      },
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Role change API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
