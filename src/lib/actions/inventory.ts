'use me';
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { HoldRequestItem, ReservationSession } from '@/lib/types/inventory';
import crypto from 'crypto';

// 1. Create Reservation Session & Acquire Atomic Inventory Holds (with Saga Rollback)
export async function acquireInventoryHolds(items: HoldRequestItem[]): Promise<{
  success: boolean;
  session?: ReservationSession;
  error?: string;
}> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const session_token = `SESS-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15-minute hold

  // Insert Session Container
  const { data: session, error: sessErr } = await supabase
    .from('reservation_sessions')
    .insert({
      session_token,
      user_id: user?.id || null,
      expires_at,
      status: 'active',
    })
    .select()
    .single();

  if (sessErr || !session) {
    return { success: false, error: `Failed to initialize reservation session: ${sessErr?.message}` };
  }

  const acquiredReservations: string[] = [];

  try {
    // Attempt Atomic Hold for each requested resource
    for (const item of items) {
      const { data: reservation, error: resErr } = await supabase
        .from('inventory_reservations')
        .insert({
          session_id: session.id,
          resource_type: item.resource_type,
          resource_id: item.resource_id,
          target_date: item.target_date,
          quantity: item.quantity,
          hold_status: 'temporary_hold',
          expires_at,
        })
        .select()
        .single();

      if (resErr || !reservation) {
        // SAGA ROLLBACK: Rollback all previously acquired holds
        await rollbackReservationSession(session.id);
        return {
          success: false,
          error: `Resource unavailable (${item.resource_type}:${item.resource_id}). Rolled back all holds.`,
        };
      }

      acquiredReservations.push(reservation.id);
    }

    return { success: true, session };
  } catch (err: any) {
    await rollbackReservationSession(session.id);
    return { success: false, error: `Inventory hold failure: ${err.message}` };
  }
}

// 2. Saga Rollback Session
export async function rollbackReservationSession(sessionId: string) {
  const supabase = await createServerSupabaseClient();

  // Mark all holds as released
  await supabase
    .from('inventory_reservations')
    .update({ hold_status: 'released' })
    .eq('session_id', sessionId);

  // Mark session as rolled_back
  await supabase
    .from('reservation_sessions')
    .update({ status: 'rolled_back' })
    .eq('id', sessionId);
}

// 3. Commit Reservation Session (On Successful Booking Confirmation)
export async function commitReservationSession(sessionId: string) {
  const supabase = await createServerSupabaseClient();

  await supabase
    .from('inventory_reservations')
    .update({ hold_status: 'committed' })
    .eq('session_id', sessionId);

  await supabase
    .from('reservation_sessions')
    .update({ status: 'committed' })
    .eq('id', sessionId);
}
