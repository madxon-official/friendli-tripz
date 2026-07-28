import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';

export async function POST(req: NextRequest) {
  try {
    const caller = await requirePermission('team.department.change');

    const body = await req.json();
    const { targetUserId, departmentId } = body;

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Target User ID is required.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    const { data: targetProfile, error: targetError } = await serviceClient
      .from('admin_profiles')
      .select('id, full_name, department_id')
      .eq('id', targetUserId)
      .single();

    if (targetError || !targetProfile) {
      return NextResponse.json(
        { success: false, error: 'Target admin profile not found.' },
        { status: 404 }
      );
    }

    const oldDeptId = targetProfile.department_id;

    const { error: updateError } = await serviceClient
      .from('admin_profiles')
      .update({
        department_id: departmentId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (updateError) {
      console.error('Department update error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update department assignment.' },
        { status: 500 }
      );
    }

    await logActivity({
      actorId: caller.userId,
      targetType: 'department',
      targetId: targetUserId,
      action: 'department_changed',
      oldData: { department_id: oldDeptId },
      newData: { department_id: departmentId, user_name: targetProfile.full_name },
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Department for ${targetProfile.full_name} updated successfully.`,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Department update API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
