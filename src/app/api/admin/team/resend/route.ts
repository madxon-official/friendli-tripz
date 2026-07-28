import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';

export async function POST(req: NextRequest) {
  try {
    const caller = await requirePermission('team.invite');

    const body = await req.json();
    const { invitationId, email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Target invitation email is required.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    // Determine production/development App URL dynamically
    let baseAppUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    if (!baseAppUrl) {
      const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
      const proto = req.headers.get('x-forwarded-proto') || 'https';
      if (host) {
        baseAppUrl = `${proto}://${host}`;
      } else {
        baseAppUrl = 'http://localhost:3000';
      }
    }
    const appUrl = baseAppUrl.replace(/\/$/, '');
    const redirectTo = `${appUrl}/admin/set-password`;

    // Resend invitation via Supabase Auth Admin API
    const { data: inviteData, error: inviteError } = await serviceClient.auth.admin.inviteUserByEmail(
      email.trim(),
      { redirectTo }
    );

    if (inviteError) {
      return NextResponse.json(
        { success: false, error: inviteError.message || 'Failed to resend invitation.' },
        { status: 400 }
      );
    }

    if (invitationId) {
      await serviceClient
        .from('admin_invitations')
        .update({
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', invitationId);
    }

    await logActivity({
      actorId: caller.userId,
      targetType: 'invitation',
      targetId: invitationId || null,
      action: 'resend',
      newData: { email },
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Invitation email resent successfully to ${email}.`,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Resend invitation error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
