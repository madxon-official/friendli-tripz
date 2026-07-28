import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { isValidRole, AdminRole, canManageTargetRole, getRoleLabel } from '@/lib/rbac/roles';
import { logActivity } from '@/lib/rbac/audit';
import { createAdminNotification } from '@/lib/rbac/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetUserId, newRole } = body;

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Target User ID is required.' },
        { status: 400 }
      );
    }

    if (!newRole || !isValidRole(newRole)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role choice.' },
        { status: 400 }
      );
    }

    if (newRole === 'owner') {
      return NextResponse.json(
        { success: false, error: 'Owner role cannot be set via role change. Use Transfer Ownership.' },
        { status: 400 }
      );
    }

    // 1. Authorize caller has 'team.role.change' permission
    const caller = await requirePermission('team.role.change', newRole as AdminRole);

    if (targetUserId === caller.userId) {
      return NextResponse.json(
        { success: false, error: 'You cannot change your own role.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    // Fetch target user profile
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

    // Protection rule: Admin cannot manage Owner or change an Owner's role
    if (!canManageTargetRole(caller.role, targetProfile.role as AdminRole)) {
      return NextResponse.json(
        { success: false, error: `You do not have permission to modify a user with the '${targetProfile.role}' role.` },
        { status: 403 }
      );
    }

    const oldRole = targetProfile.role;

    if (oldRole === newRole) {
      return NextResponse.json({
        success: true,
        message: 'Role is already set to ' + getRoleLabel(newRole),
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
      console.error('Role update error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update user role in database.' },
        { status: 500 }
      );
    }

    // Audit log & notification
    await logActivity({
      actorId: caller.userId,
      targetType: 'role',
      targetId: targetUserId,
      action: 'role_changed',
      oldData: { role: oldRole },
      newData: { role: newRole, user_name: targetProfile.full_name },
      req,
    });

    await createAdminNotification({
      recipientId: targetUserId,
      title: 'Role Updated',
      body: `Your Friendli Admin role has been updated to ${getRoleLabel(newRole)}.`,
      type: 'role_changed',
      link: '/admin',
    });

    return NextResponse.json({
      success: true,
      message: `Role for ${targetProfile.full_name} updated from ${getRoleLabel(oldRole)} to ${getRoleLabel(newRole)}.`,
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
