import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';
import { createAdminNotification } from '@/lib/rbac/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { success: false, error: 'User ID and email are required.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();
    const cleanEmail = email.toLowerCase().trim();

    // 1. Find invitation for this email
    const { data: inv } = await serviceClient
      .from('admin_invitations')
      .select('id, email, phone, role, department_id, invited_by, full_name')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (inv) {
      // 2. Mark invitation as Accepted
      await serviceClient
        .from('admin_invitations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', inv.id);
    }

    // 3. Upsert admin_profiles to ensure user profile exists and is active
    const { error: profileErr } = await serviceClient
      .from('admin_profiles')
      .upsert({
        id: userId,
        full_name: inv?.full_name || email.split('@')[0],
        role: inv?.role || 'admin',
        department_id: inv?.department_id || null,
        phone: inv?.phone || null,
        status: 'active',
        is_active: true,
        updated_at: new Date().toISOString(),
      });

    if (profileErr) {
      console.error('[invitation-accepted Profile Upsert Error]', profileErr);
    }

    // 4. Audit Log
    try {
      await logActivity({
        actorId: userId,
        targetType: 'invitation',
        targetId: inv?.id || userId,
        action: 'accept',
        newData: { email: cleanEmail, accepted_at: new Date().toISOString() },
        req,
      });
    } catch {
      // Fallback ignore
    }

    // 5. Notify owner
    try {
      if (inv?.invited_by) {
        await createAdminNotification({
          recipientId: inv.invited_by,
          title: 'Invitation Accepted',
          body: `${cleanEmail} has accepted their invitation and set up their password.`,
          type: 'invitation_accepted',
          link: '/admin/team',
        });
      }
    } catch {
      // Fallback ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation lifecycle completed successfully.',
    });
  } catch (error: any) {
    console.error('Invitation accepted API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to finalize invitation acceptance.' },
      { status: 500 }
    );
  }
}
