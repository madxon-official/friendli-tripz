import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, AuthorizationError } from '@/lib/auth/authorize';
import { createServiceRoleClient } from '@/lib/supabase/service';

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize caller has 'enquiries.archive' permission (Owner & Admin only)
    const caller = await authorizeAdmin('enquiries.archive');

    const body = await req.json();
    const { enquiryId, archive } = body;

    if (!enquiryId || typeof enquiryId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Enquiry ID is required.' },
        { status: 400 }
      );
    }

    if (typeof archive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'archive parameter must be a boolean.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    const archivedAt = archive ? new Date().toISOString() : null;

    const { error: updateError } = await serviceClient
      .from('enquiries')
      .update({
        archived_at: archivedAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', enquiryId);

    if (updateError) {
      console.error('Enquiry archive error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update enquiry archive status.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Enquiry ${archive ? 'archived' : 'restored'} successfully.`,
      archivedAt,
    });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    console.error('Archive API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
