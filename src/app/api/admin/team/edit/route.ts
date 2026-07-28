import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';
import { isValidRole, AdminRole } from '@/lib/rbac/roles';

export async function POST(req: NextRequest) {
  try {
    const caller = await requirePermission('team.edit');
    const body = await req.json();
    const { targetUserId, fullName, phone, departmentId, role, status } = body;

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Target user ID is required.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    // Fetch target user profile
    const { data: targetProfile, error: fetchErr } = await serviceClient
      .from('admin_profiles')
      .select('id, full_name, phone, role, department_id, is_active, status')
      .eq('id', targetUserId)
      .single();

    if (fetchErr || !targetProfile) {
      return NextResponse.json(
        { success: false, error: 'Target profile not found.' },
        { status: 404 }
      );
    }

    // Owner protection safeguards
    const isTargetOwner = targetProfile.role === 'owner';
    const isSelf = targetUserId === caller.userId;

    if (isTargetOwner && caller.role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'Only an Owner can edit another Owner account.' },
        { status: 403 }
      );
    }

    if (role && role === 'owner' && targetProfile.role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'Owner role cannot be set via edit. Use Transfer Ownership.' },
        { status: 400 }
      );
    }

    if (isSelf && caller.role === 'owner' && status && status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'As Owner, you cannot suspend or deactivate your own account.' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (fullName && typeof fullName === 'string') updates.full_name = fullName.trim();
    if (phone !== undefined) updates.phone = phone ? phone.trim() : null;
    if (departmentId !== undefined) updates.department_id = departmentId || null;

    if (role && isValidRole(role) && !isTargetOwner) {
      updates.role = role;
    }

    if (status && ['active', 'inactive', 'suspended'].includes(status) && !isSelf) {
      updates.status = status;
      updates.is_active = status === 'active';
    }

    const { error: updateErr } = await serviceClient
      .from('admin_profiles')
      .update(updates)
      .eq('id', targetUserId);

    if (updateErr) {
      console.error('Update member profile error:', updateErr);
      return NextResponse.json(
        { success: false, error: 'Failed to update member profile.' },
        { status: 500 }
      );
    }

    // Audit Log
    await logActivity({
      actorId: caller.userId,
      targetType: 'team_member',
      targetId: targetUserId,
      action: 'member_edited',
      oldData: targetProfile,
      newData: updates,
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Profile updated successfully for ${updates.full_name || targetProfile.full_name}.`,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Edit member API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
