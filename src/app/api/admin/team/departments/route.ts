import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('team.view');
    const serviceClient = createServiceRoleClient();

    const url = new URL(req.url);
    const includeArchived = url.searchParams.get('includeArchived') === 'true';

    let query = serviceClient
      .from('departments')
      .select('id, name, color, active, manager_id, archived_at')
      .order('name', { ascending: true });

    if (!includeArchived) {
      query = query.is('archived_at', null);
    }

    const { data: depts, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, departments: depts || [] });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const caller = await requirePermission('team.department.change');

    const body = await req.json();
    const { id, name, color, active, manager_id, action } = body;

    const serviceClient = createServiceRoleClient();

    // Restore action handling
    if (action === 'restore' && id) {
      const { data, error } = await serviceClient
        .from('departments')
        .update({
          active: true,
          archived_at: null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await logActivity({
        actorId: caller.userId,
        targetType: 'department',
        targetId: id,
        action: 'department_changed',
        newData: { action: 'restore', active: true },
        req,
      });

      return NextResponse.json({
        success: true,
        message: `Department '${data.name}' restored successfully.`,
        department: data,
      });
    }

    // Archive action handling
    if (action === 'archive' && id) {
      // Verify no members exist in this department
      const { count, error: countErr } = await serviceClient
        .from('admin_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('department_id', id)
        .eq('is_active', true);

      if (countErr) throw countErr;

      if (count && count > 0) {
        return NextResponse.json(
          { success: false, error: `Cannot archive department containing ${count} active member(s). Reassign them first.` },
          { status: 400 }
        );
      }

      const { data, error } = await serviceClient
        .from('departments')
        .update({
          active: false,
          archived_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await logActivity({
        actorId: caller.userId,
        targetType: 'department',
        targetId: id,
        action: 'department_changed',
        newData: { action: 'archive', archived_at: new Date().toISOString() },
        req,
      });

      return NextResponse.json({
        success: true,
        message: 'Department archived successfully.',
        department: data,
      });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Department name is required.' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const deptColor = color || '#F97316';
    const managerId = manager_id || null;

    let resultData;

    if (id) {
      // Update existing department
      const { data, error } = await serviceClient
        .from('departments')
        .update({
          name: trimmedName,
          color: deptColor,
          active: active !== undefined ? Boolean(active) : true,
          manager_id: managerId,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    } else {
      // Insert new department
      const { data, error } = await serviceClient
        .from('departments')
        .insert({
          name: trimmedName,
          color: deptColor,
          active: active !== undefined ? Boolean(active) : true,
          manager_id: managerId,
        })
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    }

    await logActivity({
      actorId: caller.userId,
      targetType: 'department',
      targetId: resultData.id,
      action: 'department_changed',
      newData: { name: trimmedName, color: deptColor, manager_id: managerId },
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Department '${trimmedName}' saved successfully.`,
      department: resultData,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Save department error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to save department.' }, { status: 500 });
  }
}
