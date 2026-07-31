'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { recordTransactionSchema, RecordTransactionFormValues } from '@/lib/validations/payment';
import crypto from 'crypto';

async function checkPermission(requiredPermission: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized: Authentication required');
  }

  // Verify RBAC permission against user's admin profile role
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active) {
    throw new Error('Unauthorized: Admin profile not found or inactive');
  }

  const { hasPermission } = await import('@/lib/rbac/permissions');
  if (!hasPermission(profile.role, requiredPermission as any)) {
    throw new Error(`Forbidden: Missing required permission '${requiredPermission}'`);
  }

  return { supabase, user };
}

// 1. Fetch Payment Schedules for a Booking
export async function getPaymentSchedules(bookingId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('payment_schedules')
    .select('*')
    .eq('booking_id', bookingId)
    .order('due_date');

  if (error) throw new Error(error.message);
  return data || [];
}

// 2. Fetch Double-Entry Financial Ledger Entries (Audit Trail)
export async function getFinancialLedgerEntries(bookingId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('financial_ledger_entries').select('*').order('created_at', { ascending: false });

  if (bookingId) {
    query = query.eq('booking_id', bookingId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

// 3. Record Successful Gateway Payment Transaction & Post Double-Entry Ledger Entry
export async function recordPaymentTransaction(rawValues: RecordTransactionFormValues) {
  const { supabase, user } = await checkPermission('destination.update');

  const validated = recordTransactionSchema.parse(rawValues);

  // 1. Insert Gateway Transaction
  const { data: newTx, error: txError } = await supabase
    .from('payment_transactions')
    .insert({
      booking_id: validated.booking_id,
      schedule_id: validated.schedule_id || null,
      gateway_provider: validated.gateway_provider,
      gateway_transaction_id: validated.gateway_transaction_id,
      amount: validated.amount,
      currency: validated.currency || 'INR',
      payment_method: validated.payment_method || 'upi',
      status: 'success',
    })
    .select()
    .single();

  if (txError || !newTx) {
    throw new Error(`Failed to record transaction: ${txError?.message}`);
  }

  // 2. Post Immutable Double-Entry Ledger Entry
  const transaction_ref = `TX-${validated.gateway_provider.toUpperCase()}-${validated.gateway_transaction_id}`;
  const entry_hash = crypto
    .createHash('sha256')
    .update(`${transaction_ref}:${validated.booking_id}:${validated.amount}`)
    .digest('hex');

  await supabase.from('financial_ledger_entries').insert({
    transaction_ref,
    booking_id: validated.booking_id,
    debit_account: `bank_${validated.gateway_provider}`,
    credit_account: 'customer_receivable',
    amount: validated.amount,
    currency: validated.currency || 'INR',
    entry_type: 'customer_payment',
    entry_hash,
  });

  // 3. Update Payment Schedule Milestone Status
  if (validated.schedule_id) {
    await supabase
      .from('payment_schedules')
      .update({
        amount_paid: validated.amount,
        status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', validated.schedule_id);
  }

  revalidatePath('/admin/bookings');
  return newTx;
}
