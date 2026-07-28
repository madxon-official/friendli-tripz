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

    // 1. Find pending invitation for this email
    const { data: inv, error: invErr } = await serviceClient
      .from('admin_invitations')
      .select('id, email, phone, role, department_id, invited_by, status')
      .eq('email', email.toLowerCase().trim())
      .eq('status', 'pending')
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

      // 3. Update admin profile to active status
      const { data: profile } = await serviceClient
        .from('admin_profiles')
        .select('phone, department_id')
        .eq('id', userId)
        .single();

      const profileUpdates: Record<string, any> = {
        status: 'active',
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      if (inv.phone && (!profile || !profile.phone)) {
        profileUpdates.phone = inv.phone;
      }
      if (inv.department_id && (!profile || !profile.department_id)) {
        profileUpdates.department_id = inv.department_id;
      }

      await serviceClient
        .from('admin_profiles')
        .update(profileUpdates)
        .eq('id', userId);

      // 4. Audit Log
      await logActivity({
        actorId: userId,
        targetType: 'invitation',
        targetId: inv.id,
        action: 'accept',
        newData: { email, role: inv.role, accepted_at: new Date().toISOString() },
        req,
      });

      // 5. Notify the invited_by user / Owners
      if (inv.invited_by) {
        await createAdminNotification({
          recipientId: inv.invited_by,
          title: 'Invitation Accepted',
          body: `${email} has accepted their invitation and set up their password.`,
          type: 'invitation_accepted',
          link: '/admin/team',
        });
      }
    } else {
      // Direct user password update fallback
      await serviceClient
        .from('admin_profiles')
        .update({
          status: 'active',
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
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
