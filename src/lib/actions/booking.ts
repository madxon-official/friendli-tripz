'use me';
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { bookingFormSchema, bookingAmendmentSchema, BookingFormValues, BookingAmendmentFormValues } from '@/lib/validations/booking';
import { BookingFilterParams, BookingStatus } from '@/lib/types/booking';
import crypto from 'crypto';

async function checkPermission(requiredPermission: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized: Authentication required');
  }
  return { supabase, user };
}

// 1. Fetch Bookings (Admin List with Filters)
export async function getBookings(params: BookingFilterParams = {}) {
  const supabase = await createServerSupabaseClient();
  const { search = '', status = 'all', page = 1, limit = 20 } = params;

  let query = supabase.from('bookings').select(
    `
      *,
      passengers:passenger_roster(*),
      instance:package_instances(
        id, title,
        release:package_releases(
          id, version_tag,
          family:package_families(id, name, family_slug)
        )
      )
    `,
    { count: 'exact' }
  );

  if (search.trim()) {
    query = query.or(`booking_code.ilike.%${search}%,lead_booker_name.ilike.%${search}%,lead_booker_email.ilike.%${search}%`);
  }

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  query = query.order('created_at', { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    bookings: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    page,
    limit,
  };
}

// 2. Fetch Single Booking by ID or Code with Full Roster & Snapshots
export async function getBookingById(idOrCode: string) {
  const supabase = await createServerSupabaseClient();

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);

  let query = supabase.from('bookings').select(`
    *,
    passengers:passenger_roster(*),
    snapshots:booking_snapshots(*),
    amendments:booking_amendments(*),
    instance:package_instances(
      id, title, custom_pricing_tree_json,
      release:package_releases(
        id, version_tag,
        family:package_families(id, name, family_slug)
      )
    )
  `);

  if (isUuid) {
    query = query.eq('id', idOrCode);
  } else {
    query = query.eq('booking_code', idOrCode);
  }

  const { data, error } = await query.single();
  if (error || !data) return null;
  return data;
}

// 3. Create Booking & Roster (Initial Draft or Pending Payment)
export async function createBooking(rawValues: BookingFormValues) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const validated = bookingFormSchema.parse(rawValues);
  const { passengers, ...bookingPayload } = validated;

  // Generate Unique Booking Code e.g. FT-2026-8941
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const booking_code = `FT-${new Date().getFullYear()}-${randomDigits}`;

  const { data: newBooking, error } = await supabase
    .from('bookings')
    .insert({
      ...bookingPayload,
      booking_code,
      status: 'pending_payment',
      created_by: user?.id || null,
    })
    .select()
    .single();

  if (error || !newBooking) throw new Error(`Failed to create booking: ${error?.message}`);

  // Insert Passenger Roster
  if (passengers && passengers.length > 0) {
    await supabase.from('passenger_roster').insert(
      passengers.map((p) => ({
        booking_id: newBooking.id,
        first_name: p.first_name,
        last_name: p.last_name,
        age: p.age,
        gender: p.gender,
        dietary_preference: p.dietary_preference,
        special_assistance_notes: p.special_assistance_notes || null,
      }))
    );
  }

  // Record Initial State Transition
  await supabase.from('booking_state_transitions').insert({
    booking_id: newBooking.id,
    from_status: 'draft',
    to_status: 'pending_payment',
    reason: 'Initial booking creation during checkout',
    initiated_by: user?.id || null,
  });

  revalidatePath('/admin/bookings');
  return newBooking;
}

// 4. Transition Booking Status & Compile Immutable Snapshot on Confirmation
export async function transitionBookingStatus(bookingId: string, toStatus: BookingStatus, reason?: string) {
  const { supabase, user } = await checkPermission('destination.update');

  const { data: current } = await supabase.from('bookings').select('*').eq('id', bookingId).single();
  if (!current) throw new Error('Booking not found');

  const from_status = current.status;

  // Update Status
  const { data: updated, error } = await supabase
    .from('bookings')
    .update({
      status: toStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw new Error(`Status transition failed: ${error.message}`);

  // Audit State Transition
  await supabase.from('booking_state_transitions').insert({
    booking_id: bookingId,
    from_status,
    to_status: toStatus,
    reason: reason || `Status changed to ${toStatus}`,
    initiated_by: user.id,
  });

  // If Flipped to 'confirmed', Compile Immutable Booking Snapshot #1
  if (toStatus === 'confirmed' && from_status !== 'confirmed') {
    const { data: fullBooking } = await supabase
      .from('bookings')
      .select('*, passengers:passenger_roster(*), instance:package_instances(*)')
      .eq('id', bookingId)
      .single();

    const serialized_contract_json = fullBooking;
    const snapshot_hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(serialized_contract_json))
      .digest('hex');

    await supabase.from('booking_snapshots').upsert(
      {
        booking_id: bookingId,
        revision_number: current.current_revision_number || 1,
        serialized_contract_json,
        snapshot_hash,
      },
      { onConflict: 'booking_id,revision_number' }
    );
  }

  revalidatePath('/admin/bookings');
  return updated;
}

// 5. Submit Booking Amendment Request (3-Point Impact Analysis)
export async function submitBookingAmendment(rawValues: BookingAmendmentFormValues) {
  const { supabase, user } = await checkPermission('destination.update');

  const validated = bookingAmendmentSchema.parse(rawValues);

  // 3-Point Impact Analysis Simulation
  const operational_impact_json = {
    room_availability: 'confirmed_available',
    transport_seat_shift: 'no_conflict',
    activity_slot_status: 'available',
  };

  const commercial_price_diff = 1500.0; // Simulated price adjustment
  const financial_refund_or_due = 1500.0;

  const { data: amendment, error } = await supabase
    .from('booking_amendments')
    .insert({
      booking_id: validated.booking_id,
      amendment_type: validated.amendment_type,
      requested_by: user.id,
      amendment_payload_json: validated.amendment_payload_json,
      operational_impact_json,
      commercial_price_diff,
      financial_refund_or_due,
      status: 'impact_analyzed',
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to submit amendment: ${error.message}`);

  // Mark Booking Status as 'amendment_pending'
  await supabase
    .from('bookings')
    .update({ status: 'amendment_pending', updated_at: new Date().toISOString() })
    .eq('id', validated.booking_id);

  revalidatePath('/admin/bookings');
  return amendment;
}
