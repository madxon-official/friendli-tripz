import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize caller has 'team.delete' permission (Owner ONLY)
    const caller = await requirePermission('team.delete');

    const body = await req.json();
    const { targetUserId } = body;

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Target User ID is required.' },
        { status: 400 }
      );
    }

    if (targetUserId === caller.userId) {
      return NextResponse.json(
        { success: false, error: 'You cannot delete your own account.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    // Fetch target user profile
    const { data: targetProfile, error: targetError } = await serviceClient
      .from('admin_profiles')
      .select('id, full_name, role')
      .eq('id', targetUserId)
      .single();

    if (targetError || !targetProfile) {
      return NextResponse.json(
        { success: false, error: 'Target admin profile not found.' },
        { status: 404 }
      );
    }

    // Protection rule: Cannot delete an Owner if single active Owner
    if (targetProfile.role === 'owner') {
      const { count: activeOwnerCount } = await serviceClient
        .from('admin_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'owner')
        .eq('is_active', true);

      if ((activeOwnerCount || 0) <= 1) {
        return NextResponse.json(
          { success: false, error: 'Cannot delete the only active Owner account.' },
          { status: 400 }
        );
      }
    }

    // Delete profile and Auth user
    const { error: profileDeleteErr } = await serviceClient
      .from('admin_profiles')
      .delete()
      .eq('id', targetUserId);

    if (profileDeleteErr) {
      console.error('Profile deletion error:', profileDeleteErr);
    }

    const { error: authDeleteErr } = await serviceClient.auth.admin.deleteUser(targetUserId);

    if (authDeleteErr) {
      console.warn('Auth user deletion error:', authDeleteErr);
    }

    await logActivity({
      actorId: caller.userId,
      targetType: 'team_member',
      targetId: targetUserId,
      action: 'deleted',
      oldData: { name: targetProfile.full_name, role: targetProfile.role },
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Team member ${targetProfile.full_name} deleted successfully.`,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Delete team member error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
