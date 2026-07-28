import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';

export async function GET() {
  try {
    const caller = await requirePermission();
    const serviceClient = createServiceRoleClient();

    const { data: notifications, error } = await serviceClient
      .from('admin_notifications')
      .select('*')
      .or(`recipient_id.eq.${caller.userId},recipient_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    const unreadCount = (notifications || []).filter((n) => !n.is_read).length;

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      unreadCount,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const caller = await requirePermission();
    const body = await req.json();
    const { notificationIds, markAllRead } = body;

    const serviceClient = createServiceRoleClient();

    if (markAllRead) {
      await serviceClient
        .from('admin_notifications')
        .update({ is_read: true })
        .or(`recipient_id.eq.${caller.userId},recipient_id.is.null`);
    } else if (Array.isArray(notificationIds) && notificationIds.length > 0) {
      await serviceClient
        .from('admin_notifications')
        .update({ is_read: true })
        .in('id', notificationIds);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
