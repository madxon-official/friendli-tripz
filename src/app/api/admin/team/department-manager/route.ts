import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';

export async function POST(req: NextRequest) {
  try {
    const caller = await requirePermission('team.department.change');

    const body = await req.json();
    const { departmentId, managerId } = body;

    if (!departmentId || typeof departmentId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Department ID is required.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    if (managerId) {
      // Validate manager is an Active member
      const { data: managerProfile, error: mgrErr } = await serviceClient
        .from('admin_profiles')
        .select('id, full_name, is_active, status')
        .eq('id', managerId)
        .single();

      if (mgrErr || !managerProfile) {
        return NextResponse.json(
          { success: false, error: 'Selected manager profile not found.' },
          { status: 404 }
        );
      }

      if (!managerProfile.is_active || managerProfile.status !== 'active') {
        return NextResponse.json(
          { success: false, error: 'Only Active team members can be assigned as Department Managers.' },
          { status: 400 }
        );
      }
    }

    // Fetch department
    const { data: dept, error: deptErr } = await serviceClient
      .from('departments')
      .select('id, name, manager_id')
      .eq('id', departmentId)
      .single();

    if (deptErr || !dept) {
      return NextResponse.json(
        { success: false, error: 'Department not found.' },
        { status: 404 }
      );
    }

    const { error: updateErr } = await serviceClient
      .from('departments')
      .update({
        manager_id: managerId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', departmentId);

    if (updateErr) {
      console.error('Update department manager error:', updateErr);
      return NextResponse.json(
        { success: false, error: 'Failed to assign department manager.' },
        { status: 500 }
      );
    }

    await logActivity({
      actorId: caller.userId,
      targetType: 'department',
      targetId: departmentId,
      action: 'department_changed',
      oldData: { manager_id: dept.manager_id },
      newData: { manager_id: managerId },
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Department manager for ${dept.name} updated successfully.`,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Department manager API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
