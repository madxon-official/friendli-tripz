import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { canManageTargetRole, AdminRole } from '@/lib/rbac/roles';
import { logActivity } from '@/lib/rbac/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetUserId, status, isActive } = body;

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Target User ID is required.' },
        { status: 400 }
      );
    }

    const targetStatus = status || (isActive ? 'active' : 'inactive');
    const targetIsActive = targetStatus === 'active';

    const requiredPermission = targetIsActive ? 'team.activate' : 'team.deactivate';

    const caller = await requirePermission(requiredPermission);

    const serviceClient = createServiceRoleClient();

    const { data: targetProfile, error: targetError } = await serviceClient
      .from('admin_profiles')
      .select('id, full_name, role, is_active, status')
      .eq('id', targetUserId)
      .single();

    if (targetError || !targetProfile) {
      return NextResponse.json(
        { success: false, error: 'Target admin profile not found.' },
        { status: 404 }
      );
    }

    // Protection rule: Cannot modify Owner if caller is Admin
    if (!canManageTargetRole(caller.role, targetProfile.role as AdminRole)) {
      return NextResponse.json(
        { success: false, error: `You do not have permission to modify an '${targetProfile.role}' account.` },
        { status: 403 }
      );
    }

    // Protection rule: Cannot deactivate/suspend the only active Owner account
    if (!targetIsActive && targetProfile.role === 'owner') {
      const { count: activeOwnerCount } = await serviceClient
        .from('admin_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'owner')
        .eq('is_active', true);

      if ((activeOwnerCount || 0) <= 1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot deactivate or suspend the only active Owner account.',
          },
          { status: 400 }
        );
      }
    }

    // Update target profile status
    const { error: updateError } = await serviceClient
      .from('admin_profiles')
      .update({
        is_active: targetIsActive,
        status: targetStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (updateError) {
      console.error('Status update database error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update user status.' },
        { status: 500 }
      );
    }

    await logActivity({
      actorId: caller.userId,
      targetType: 'team_member',
      targetId: targetUserId,
      action: 'status_changed',
      oldData: { status: targetProfile.status, is_active: targetProfile.is_active },
      newData: { status: targetStatus, is_active: targetIsActive, user_name: targetProfile.full_name },
      req,
    });

    return NextResponse.json({
      success: true,
      message: `${targetProfile.full_name} status set to '${targetStatus}'.`,
      profile: {
        id: targetUserId,
        fullName: targetProfile.full_name,
        status: targetStatus,
        isActive: targetIsActive,
      },
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Status change API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
