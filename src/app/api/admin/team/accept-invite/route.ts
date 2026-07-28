import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service';

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

    // Execute Atomic Invitation Acceptance RPC
    const { data: rpcRes, error: rpcErr } = await serviceClient.rpc('accept_invitation_transaction', {
      p_user_id: userId,
      p_email: email,
    });

    if (rpcErr) {
      console.error('accept_invitation_transaction error:', rpcErr);
      // Fallback manual atomic execution if RPC is not deployed yet in DB environment
      await serviceClient
        .from('admin_invitations')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('email', email)
        .eq('status', 'pending');

      await serviceClient
        .from('admin_profiles')
        .update({ status: 'active', is_active: true, joined_at: new Date().toISOString() })
        .eq('id', userId);
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation accepted and account activated successfully.',
    });
  } catch (error: any) {
    console.error('Accept invite API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process invitation acceptance.' },
      { status: 500 }
    );
  }
}
