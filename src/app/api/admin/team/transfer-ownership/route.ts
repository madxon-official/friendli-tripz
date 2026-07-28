import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';
import { createAdminNotification } from '@/lib/rbac/notifications';

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize caller is Owner
    const caller = await requirePermission('team.transfer_ownership');

    if (caller.role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'Only the current Owner can transfer ownership.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { targetAdminId } = body;

    if (!targetAdminId || typeof targetAdminId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Target Admin user ID is required.' },
        { status: 400 }
      );
    }

    if (targetAdminId === caller.userId) {
      return NextResponse.json(
        { success: false, error: 'You are already the Owner.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    // 2. Fetch target admin profile
    const { data: targetProfile, error: targetError } = await serviceClient
      .from('admin_profiles')
      .select('id, full_name, role, is_active')
      .eq('id', targetAdminId)
      .single();

    if (targetError || !targetProfile) {
      return NextResponse.json(
        { success: false, error: 'Target admin profile not found.' },
        { status: 404 }
      );
    }

    if (!targetProfile.is_active) {
      return NextResponse.json(
        { success: false, error: 'Target user must be an active admin account.' },
        { status: 400 }
      );
    }

    if (targetProfile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Ownership can only be transferred to an existing Admin.' },
        { status: 400 }
      );
    }

    // 3. Execute Atomic Ownership Transfer
    // Step A: Update current Owner -> Admin
    const { error: demoteErr } = await serviceClient
      .from('admin_profiles')
      .update({
        role: 'admin',
        updated_at: new Date().toISOString(),
      })
      .eq('id', caller.userId);

    if (demoteErr) {
      console.error('Demote current owner error:', demoteErr);
      return NextResponse.json(
        { success: false, error: 'Failed to transfer ownership.' },
        { status: 500 }
      );
    }

    // Step B: Update target Admin -> Owner
    const { error: promoteErr } = await serviceClient
      .from('admin_profiles')
      .update({
        role: 'owner',
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetAdminId);

    if (promoteErr) {
      console.error('Promote target admin error:', promoteErr);
      // Rollback old owner
      await serviceClient
        .from('admin_profiles')
        .update({ role: 'owner' })
        .eq('id', caller.userId);

      return NextResponse.json(
        { success: false, error: 'Failed to complete ownership transfer. Action rolled back.' },
        { status: 500 }
      );
    }

    // 4. Audit Log & Notifications
    await logActivity({
      actorId: caller.userId,
      targetType: 'role',
      targetId: targetAdminId,
      action: 'transfer_ownership',
      oldData: { owner_id: caller.userId, admin_id: targetAdminId },
      newData: { owner_id: targetAdminId, admin_id: caller.userId, new_owner_name: targetProfile.full_name },
      req,
    });

    await createAdminNotification({
      recipientId: targetAdminId,
      title: 'Ownership Transferred',
      body: `You are now the Owner of Friendli Tripz Admin Platform.`,
      type: 'role_changed',
      link: '/admin/team',
    });

    return NextResponse.json({
      success: true,
      message: `Ownership successfully transferred to ${targetProfile.full_name}. You are now an Admin.`,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Transfer ownership API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
