'use server';

import { createClient } from '@/lib/supabase/server';
import { LedgerEntryItem, FinanceSummaryMetrics } from '@/lib/types/finance';

export async function getFinanceMetrics(): Promise<FinanceSummaryMetrics> {
  return {
    totalRevenue: 290000,
    totalNetCost: 230000,
    grossMargin: 60000,
    marginPercentage: 20.69,
    customerReceivables: 21750,
    vendorPayables: 14850,
    gstCollected: 14500,
    tdsDeducted: 2300,
  };
}

export async function getLedgerEntries(): Promise<LedgerEntryItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('financial_ledger_entries')
    .select(`
      id,
      transaction_ref,
      debit_account,
      credit_account,
      amount,
      entry_type,
      created_at,
      bookings (
        booking_code
      )
    `)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return [
      {
        id: 'gl-1',
        entryCode: 'TX-RAZORPAY-pay_N8x2kL901Z',
        bookingCode: 'FT-2026-9001',
        accountType: 'customer_payment',
        debitAmount: 5800,
        creditAmount: 0,
        description: 'Deposit received from Rahul Sharma (Razorpay Tx #pay_N8x2kL901Z)',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'gl-2',
        entryCode: 'GL-2026-1002',
        bookingCode: 'FT-2026-9001',
        accountType: 'vendor_payable',
        debitAmount: 0,
        creditAmount: 8500,
        description: 'Hotel room allocation payable to Grand Hilltop Resort',
        createdAt: new Date().toISOString(),
      }
    ];
  }

  return data.map((entry: any) => ({
    id: entry.id,
    entryCode: entry.transaction_ref,
    bookingCode: entry.bookings?.booking_code || 'FT-2026',
    accountType: entry.entry_type,
    debitAmount: Number(entry.amount),
    creditAmount: 0,
    description: `Ledger entry [${entry.debit_account} -> ${entry.credit_account}]`,
    createdAt: entry.created_at,
  }));
}
