import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';

export async function POST(req: NextRequest) {
  try {
    const caller = await requirePermission('team.invite');

    const body = await req.json();
    const { invitationId } = body;

    if (!invitationId || typeof invitationId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invitation ID is required.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    const { data: inv, error: fetchErr } = await serviceClient
      .from('admin_invitations')
      .select('id, email, full_name, role, status')
      .eq('id', invitationId)
      .single();

    if (fetchErr || !inv) {
      return NextResponse.json(
        { success: false, error: 'Invitation record not found.' },
        { status: 404 }
      );
    }

    if (inv.status === 'accepted') {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel an accepted invitation.' },
        { status: 400 }
      );
    }

    const { error: cancelErr } = await serviceClient
      .from('admin_invitations')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', invitationId);

    if (cancelErr) {
      console.error('Cancel invitation error:', cancelErr);
      return NextResponse.json(
        { success: false, error: 'Failed to cancel invitation.' },
        { status: 500 }
      );
    }

    await logActivity({
      actorId: caller.userId,
      targetType: 'invitation',
      targetId: invitationId,
      action: 'status_changed',
      oldData: { status: inv.status },
      newData: { status: 'cancelled', cancelled_at: new Date().toISOString() },
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Invitation for ${inv.email} has been cancelled.`,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Cancel invite API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
