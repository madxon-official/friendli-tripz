import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthorizationError } from '@/lib/rbac/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { logActivity } from '@/lib/rbac/audit';
import { createAdminNotification } from '@/lib/rbac/notifications';

export async function POST(req: NextRequest) {
  try {
    const caller = await requirePermission('enquiry.assign');

    const body = await req.json();
    const { enquiryId, assignedTo } = body;

    if (!enquiryId || typeof enquiryId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Enquiry ID is required.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    const { data: enquiry, error: enqErr } = await serviceClient
      .from('enquiries')
      .select('id, reference, name, assigned_to')
      .eq('id', enquiryId)
      .single();

    if (enqErr || !enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found.' },
        { status: 404 }
      );
    }

    const oldAssignedTo = enquiry.assigned_to;
    const targetUserId = assignedTo && typeof assignedTo === 'string' ? assignedTo : null;

    let targetUserName = 'Unassigned';
    if (targetUserId) {
      const { data: targetProfile } = await serviceClient
        .from('admin_profiles')
        .select('full_name')
        .eq('id', targetUserId)
        .single();
      if (targetProfile) targetUserName = targetProfile.full_name;
    }

    const { error: updateErr } = await serviceClient
      .from('enquiries')
      .update({
        assigned_to: targetUserId,
        assigned_by: caller.userId,
        assigned_at: new Date().toISOString(),
      })
      .eq('id', enquiryId);

    if (updateErr) {
      console.error('Enquiry assignment error:', updateErr);
      return NextResponse.json(
        { success: false, error: 'Failed to assign enquiry.' },
        { status: 500 }
      );
    }

    await logActivity({
      actorId: caller.userId,
      targetType: 'enquiry',
      targetId: enquiryId,
      action: 'assigned',
      oldData: { assigned_to: oldAssignedTo },
      newData: { assigned_to: targetUserId, target_name: targetUserName, reference: enquiry.reference },
      req,
    });

    if (targetUserId && targetUserId !== caller.userId) {
      await createAdminNotification({
        recipientId: targetUserId,
        title: 'New Trip Lead Assigned',
        body: `${caller.fullName} assigned enquiry ${enquiry.reference} (${enquiry.name}) to you.`,
        type: 'assignment',
        link: `/admin/enquiries/${enquiryId}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Enquiry ${enquiry.reference} assigned to ${targetUserName}.`,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Assign enquiry error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
