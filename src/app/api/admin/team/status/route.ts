import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, AuthorizationError } from '@/lib/auth/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize caller has 'team.change_status' permission (Owner only)
    const caller = await authorizeAdmin('team.change_status');

    const body = await req.json();
    const { targetUserId, isActive } = body;

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Target User ID is required.' },
        { status: 400 }
      );
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isActive must be a boolean.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    // Fetch target user's profile
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

    // Protection rule: If deactivating an owner account, check if it's the last active owner
    if (!isActive && targetProfile.role === 'owner') {
      // Check total count of active owners
      const { count: activeOwnerCount } = await serviceClient
        .from('admin_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'owner')
        .eq('is_active', true);

      if ((activeOwnerCount || 0) <= 1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot deactivate the only active Owner account. At least one active Owner is required.',
          },
          { status: 400 }
        );
      }
    }

    // Protection rule: Owner cannot deactivate their own account if they are the only active owner
    if (!isActive && targetUserId === caller.userId) {
      const { count: activeOwnerCount } = await serviceClient
        .from('admin_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'owner')
        .eq('is_active', true);

      if ((activeOwnerCount || 0) <= 1) {
        return NextResponse.json(
          {
            success: false,
            error: 'You cannot deactivate your own account as you are the only active Owner.',
          },
          { status: 400 }
        );
      }
    }

    // Update target profile status
    const { error: updateError } = await serviceClient
      .from('admin_profiles')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (updateError) {
      console.error('Status update database error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update user status in database.' },
        { status: 500 }
      );
    }

    const action = isActive ? 'team.reactivated' : 'team.deactivated';

    // Write security audit log
    try {
      await serviceClient.from('admin_audit_log').insert({
        admin_id: caller.userId,
        action,
        target_user_id: targetUserId,
        metadata: {
          target_name: targetProfile.full_name,
          target_role: targetProfile.role,
          new_is_active: isActive,
        },
      });
    } catch (auditErr) {
      console.warn('Could not record audit log:', auditErr);
    }

    return NextResponse.json({
      success: true,
      message: `${targetProfile.full_name} has been ${isActive ? 'reactivated' : 'deactivated'}.`,
      profile: {
        id: targetUserId,
        fullName: targetProfile.full_name,
        isActive,
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
