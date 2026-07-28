import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';
import { createAdminNotification } from '@/lib/rbac/notifications';
import { AdminRole, isValidRole } from '@/lib/rbac/roles';

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

    if (role && role === 'owner') {
      return NextResponse.json(
        { success: false, error: 'Owner role cannot be set via edit. Use Transfer Ownership.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    // Fetch existing profile
    const { data: existingProfile, error: profileErr } = await serviceClient
      .from('admin_profiles')
      .select('id, full_name, phone, role, department_id, status, is_active')
      .eq('id', targetUserId)
      .single();

    if (profileErr || !existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Target member profile not found.' },
        { status: 404 }
      );
    }

    // Owner protection: Admin cannot edit Owner profile
    if (existingProfile.role === 'owner' && caller.role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to edit the Owner profile.' },
        { status: 403 }
      );
    }

    // Prepare updates
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (fullName && fullName.trim() !== existingProfile.full_name) {
      updates.full_name = fullName.trim();
    }

    if (phone !== undefined && phone !== existingProfile.phone) {
      // Normalize Indian Phone Number: +91 98765 43210 -> 919876543210
      const cleanPhone = phone ? phone.replace(/\D/g, '') : null;
      updates.phone = cleanPhone;
    }

    if (departmentId !== undefined && departmentId !== existingProfile.department_id) {
      updates.department_id = departmentId || null;
    }

    if (role && isValidRole(role) && role !== existingProfile.role) {
      updates.role = role;
    }

    if (status && status !== existingProfile.status) {
      updates.status = status;
      updates.is_active = status === 'active';
      if (status === 'archived') {
        updates.archived_at = new Date().toISOString();
        // Unassign active enquiries upon archive
        await serviceClient
          .from('enquiries')
          .update({ assigned_to: null })
          .eq('assigned_to', targetUserId);
      } else if (status === 'active') {
        updates.archived_at = null;
      }
    }

    // NO-OP CHECK: If only updated_at changed, return early without logging audit entry
    if (Object.keys(updates).length === 1) {
      return NextResponse.json({
        success: true,
        message: 'No changes detected.',
      });
    }

    // Execute update
    const { error: updateErr } = await serviceClient
      .from('admin_profiles')
      .update(updates)
      .eq('id', targetUserId);

    if (updateErr) {
      console.error('Update profile error:', updateErr);
      return NextResponse.json(
        { success: false, error: 'Failed to update member profile.' },
        { status: 500 }
      );
    }

    // Audit trail
    await logActivity({
      actorId: caller.userId,
      targetType: 'team_member',
      targetId: targetUserId,
      action: 'role_changed',
      oldData: existingProfile,
      newData: { ...existingProfile, ...updates },
      req,
    });

    // Send notifications if role, department, or status changed
    if (updates.role || updates.department_id || updates.status) {
      await createAdminNotification({
        recipientId: targetUserId,
        title: 'Profile Updated',
        body: 'Your account permissions or department details were updated by an administrator.',
        type: 'role_changed',
        link: '/admin/team',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Member profile updated successfully.',
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
