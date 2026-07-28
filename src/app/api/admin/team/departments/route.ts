import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';

export async function GET() {
  try {
    await requirePermission('team.view');
    const serviceClient = createServiceRoleClient();

    const { data: depts, error } = await serviceClient
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

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
    const { id, name, color, active } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Department name is required.' }, { status: 400 });
    }

    const serviceClient = createServiceRoleClient();
    const trimmedName = name.trim();
    const deptColor = color || '#F97316';

    let resultData;

    if (id) {
      // Update existing
      const { data, error } = await serviceClient
        .from('departments')
        .update({
          name: trimmedName,
          color: deptColor,
          active: active !== undefined ? Boolean(active) : true,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    } else {
      // Insert new
      const { data, error } = await serviceClient
        .from('departments')
        .insert({
          name: trimmedName,
          color: deptColor,
          active: active !== undefined ? Boolean(active) : true,
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
      newData: { name: trimmedName, color: deptColor },
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
