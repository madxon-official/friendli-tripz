'use server';

import { TripEnquiryInput, TripEnquiryRecord, TripStatusStep } from '@/lib/types/platform';
import { tripEnquirySchema } from '@/lib/validations/enquiry';
import { sendEnquiryConfirmationEmail } from '@/lib/integrations/email';
import { revalidatePath } from 'next/cache';

// Map UI step titles to database status values (5 Core Stages)
const stepToDbStatus: Record<string, string> = {
  'Enquiry Received': 'new',
  'Under Review': 'contacted',
  'Trip Confirmed': 'confirmed',
  'Trip Started': 'trip_started',
  'Trip Completed': 'completed',
  'Cancelled': 'cancelled',
};

// Map database status values to UI step titles
const dbStatusToStep: Record<string, TripStatusStep> = {
  new: 'Enquiry Received',
  contacted: 'Under Review',
  planning: 'Under Review',
  quote_ready: 'Under Review',
  follow_up: 'Under Review',
  customer_confirmed: 'Trip Confirmed',
  confirmed: 'Trip Confirmed',
  driver_assigned: 'Trip Confirmed',
  trip_started: 'Trip Started',
  completed: 'Trip Completed',
  cancelled: 'Cancelled',
};

/**
 * Atomically submits a trip enquiry directly to Supabase database.
 * Executes full chain: Validation -> Supabase insert -> Audit Log -> Admin Notification -> Customer Email.
 */
export async function submitTripEnquiry(input: TripEnquiryInput): Promise<{ success: boolean; reference: string; error?: string }> {
  try {
    // 1. Validate inputs using Zod
    const validationResult = tripEnquirySchema.safeParse(input);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Invalid input data.';
      return { success: false, reference: '', error: firstError };
    }

    const validatedData = validationResult.data;

    // 2. Generate unique reference code
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const reference = `FT-2026-${randomDigits}`;

    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();

    // 3. Insert record into Supabase enquiries table
    const { data: newEnq, error: enqError } = await supabase
      .from('enquiries')
      .insert({
        reference,
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        starting_location: validatedData.starting_location || 'Coimbatore',
        destination: validatedData.destination,
        preferred_date: validatedData.travel_date || null,
        traveller_count: (validatedData.adults || 1) + (validatedData.children || 0),
        notes_from_traveller: validatedData.message || null,
        status: 'new',
        created_source: 'website',
      })
      .select()
      .single();

    if (enqError) {
      console.error('[Supabase Enquiry Submit Error]', enqError);
      return { success: false, reference: '', error: `Database error: ${enqError.message}` };
    }

    // 4. Record Audit Log
    try {
      await supabase.from('admin_audit_log').insert({
        action: 'Enquiry Submitted',
        metadata: { reference, name: validatedData.name, destination: validatedData.destination, phone: validatedData.phone },
      });
    } catch (auditErr) {
      console.error('[Enquiry Audit Log Warning]', auditErr);
    }

    // 5. Insert Admin Notification
    try {
      await supabase.from('admin_notifications').insert({
        recipient_id: null,
        title: 'New Trip Enquiry Received!',
        body: `${validatedData.name} submitted enquiry ${reference} for ${validatedData.destination} (${validatedData.adults} Adults).`,
        type: 'enquiry',
        link: '/admin/enquiries',
        is_read: false,
      });
    } catch (notifErr) {
      console.error('[Enquiry Notification Warning]', notifErr);
    }

    // 6. Send Customer Transactional Confirmation Email
    if (validatedData.email) {
      try {
        await sendEnquiryConfirmationEmail({
          toEmail: validatedData.email,
          customerName: validatedData.name,
          reference,
          destination: validatedData.destination,
        });
      } catch (emailErr) {
        console.error('[Enquiry Email Dispatch Warning]', emailErr);
      }
    }

    revalidatePath('/admin/enquiries');
    revalidatePath('/admin');

    return { success: true, reference };
  } catch (err: any) {
    console.error('[submitTripEnquiry Exception]', err);
    return { success: false, reference: '', error: 'Failed to process trip enquiry.' };
  }
}

/**
 * Fetches trip enquiry by reference directly from Supabase database.
 */
export async function fetchTripByReference(reference: string): Promise<TripEnquiryRecord | null> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .eq('reference', reference.trim().toUpperCase())
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    let assignedStaffName: string | undefined;
    let assignedStaffEmail: string | undefined;
    let assignedStaffPhone: string | undefined;
    let assignedStaffRole: string | undefined;

    if (data.assigned_to) {
      try {
        const [profRes, authUserRes] = await Promise.all([
          supabase.from('admin_profiles').select('*').eq('id', data.assigned_to).maybeSingle(),
          supabase.auth.admin.getUserById(data.assigned_to),
        ]);

        const prof = profRes.data;
        const authUser = authUserRes.data?.user;

        assignedStaffName = prof?.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Travel Planner';
        assignedStaffEmail = authUser?.email || 'support@friendlitripz.com';
        assignedStaffPhone = prof?.phone || authUser?.user_metadata?.phone || '+91 98765 43210';
        assignedStaffRole = prof?.role ? prof.role.toUpperCase() : 'TRAVEL PLANNER';
      } catch (staffErr) {
        console.error('[Staff Fetch Warning]', staffErr);
      }
    }

    return {
      id: data.id,
      reference: data.reference,
      created_at: data.created_at,
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      destination: data.destination || 'Kodaikanal',
      starting_location: data.starting_location || data.starting_city || 'Coimbatore',
      travel_date: data.preferred_date || 'Flexible',
      budget: '₹4,000 - ₹6,000 / person',
      adults: data.traveller_count || 1,
      children: 0,
      message: data.notes_from_traveller || '',
      status: dbStatusToStep[data.status] || 'Enquiry Received',
      status_history: [
        {
          status: dbStatusToStep[data.status] || 'Enquiry Received',
          timestamp: data.created_at,
          note: 'Enquiry record created',
        },
      ],
      planner_notes: data.notes_from_traveller || data.planner_notes || 'Live database record.',
      assigned_to: data.assigned_to || null,
      assigned_staff_name: assignedStaffName,
      assigned_staff_email: assignedStaffEmail,
      assigned_staff_phone: assignedStaffPhone,
      assigned_staff_role: assignedStaffRole,
    };
  } catch (err) {
    console.error('[fetchTripByReference Exception]', err);
    return null;
  }
}

/**
 * Fetches all enquiries dynamically from Supabase database with assigned staff mappings.
 */
export async function getAllEnquiries(): Promise<TripEnquiryRecord[]> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();

    const [enqRes, profileRes, authRes] = await Promise.all([
      supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_profiles').select('id, full_name'),
      supabase.auth.admin.listUsers(),
    ]);

    const data = enqRes.data || [];
    const profiles = profileRes.data || [];
    const authUsers = authRes.data?.users || [];

    const staffMap = new Map<string, string>();
    profiles.forEach((p: any) => staffMap.set(p.id, p.full_name));
    authUsers.forEach((u: any) => {
      if (!staffMap.has(u.id)) {
        staffMap.set(u.id, u.user_metadata?.full_name || u.email?.split('@')[0] || 'Staff Member');
      }
    });

    return data.map((row: any) => ({
      id: row.id,
      reference: row.reference,
      created_at: row.created_at,
      name: row.name,
      phone: row.phone,
      email: row.email || '',
      destination: row.destination || 'Kodaikanal',
      starting_location: row.starting_location || row.starting_city || 'Coimbatore',
      travel_date: row.preferred_date || 'Flexible',
      budget: '₹4,000 - ₹6,000 / person',
      adults: row.traveller_count || 1,
      children: 0,
      message: row.notes_from_traveller || '',
      status: dbStatusToStep[row.status] || 'Enquiry Received',
      status_history: [
        {
          status: dbStatusToStep[row.status] || 'Enquiry Received',
          timestamp: row.created_at,
          note: 'Enquiry record created',
        },
      ],
      planner_notes: row.notes_from_traveller || row.planner_notes || 'Live database record.',
      assigned_to: row.assigned_to || null,
      assigned_staff_name: row.assigned_to ? staffMap.get(row.assigned_to) || 'Staff Member' : undefined,
    }));
  } catch (err) {
    console.error('[getAllEnquiries Exception]', err);
    return [];
  }
}

/**
 * Updates status, planner notes, lead staff assignment, and dispatches audit log + targeted notifications.
 */
export async function updateEnquiryStatus(
  reference: string,
  newStatus: TripStatusStep,
  notes?: string,
  assignedTo?: string | null
): Promise<boolean> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/service');
    const supabase = createServiceRoleClient();

    const targetDbStatus = stepToDbStatus[newStatus] || 'contacted';

    const updatePayload: Record<string, any> = {
      status: targetDbStatus,
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) updatePayload.notes_from_traveller = notes;

    if (assignedTo !== undefined) {
      updatePayload.assigned_to = assignedTo || null;
      if (assignedTo) {
        updatePayload.assigned_at = new Date().toISOString();
      }
    }

    const { data: updated, error } = await supabase
      .from('enquiries')
      .update(updatePayload)
      .eq('reference', reference)
      .select()
      .single();

    if (error || !updated) {
      console.error('[updateEnquiryStatus DB Error]', error);
      return false;
    }

    // Insert status history
    try {
      await supabase.from('enquiry_status_history').insert({
        enquiry_id: updated.id,
        new_status: targetDbStatus,
      });
    } catch {}

    // Audit Log
    try {
      await supabase.from('admin_audit_log').insert({
        action: assignedTo ? 'Lead Assigned' : 'Enquiry Status Updated',
        metadata: { reference, new_status: newStatus, db_status: targetDbStatus, assigned_to: assignedTo, notes },
      });
    } catch {}

    // Targeted Notification to Assigned Staff Member
    if (assignedTo) {
      try {
        await supabase.from('admin_notifications').insert({
          recipient_id: assignedTo,
          title: 'New Lead Assigned to You! 🎯',
          body: `You have been assigned to Enquiry ${reference} for ${updated.name} (${updated.destination || 'Trip'}).`,
          type: 'lead_assigned',
          link: '/admin/enquiries',
          is_read: false,
        });
      } catch (notifErr) {
        console.error('[Targeted Lead Notification Warning]', notifErr);
      }
    } else {
      // General Notification
      try {
        await supabase.from('admin_notifications').insert({
          recipient_id: null,
          title: 'Enquiry Status Changed',
          body: `Enquiry ${reference} for ${updated.name} updated to ${newStatus}.`,
          type: 'enquiry',
          link: '/admin/enquiries',
          is_read: false,
        });
      } catch {}
    }

    revalidatePath('/admin/enquiries');
    revalidatePath('/admin/team');
    revalidatePath('/admin');
    revalidatePath(`/track/${reference}`);

    return true;
  } catch (err) {
    console.error('[updateEnquiryStatus Exception]', err);
    return false;
  }
}
