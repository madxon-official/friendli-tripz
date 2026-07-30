'use server';

import { createClient } from '@/lib/supabase/server';
import { VendorServiceOrder, VendorSettlementSummary } from '@/lib/types/vendor';

export async function getVendorServiceOrders(): Promise<VendorServiceOrder[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('service_orders')
    .select(`
      id,
      service_type,
      service_date,
      agreed_cost,
      status,
      bookings (
        booking_code
      ),
      vendors (
        business_name
      )
    `)
    .order('service_date', { ascending: false });

  if (error || !data || data.length === 0) {
    return [
      {
        id: 'ord-1',
        orderCode: 'ORD-BOAT-9001',
        serviceTitle: 'Kodai Lake 4-Seater Boat Ride Voucher',
        eventDate: '2026-10-15',
        passengerCount: 2,
        grossAmount: 350,
        netPayable: 298,
        qrVoucherCode: 'VOUCH-KODAI-BOAT-9001',
        isValidated: true,
      },
      {
        id: 'ord-2',
        orderCode: 'ORD-PINE-9002',
        serviceTitle: 'Pine Forest Entry Permit Pass',
        eventDate: '2026-10-16',
        passengerCount: 2,
        grossAmount: 100,
        netPayable: 85,
        qrVoucherCode: 'VOUCH-PINE-FOREST-9002',
        isValidated: false,
      }
    ];
  }

  return data.map((item: any) => ({
    id: item.id,
    orderCode: item.bookings?.booking_code || 'ORD-2026',
    serviceTitle: `${item.service_type.replace('_', ' ')} (${item.vendors?.business_name || 'Vendor'})`,
    eventDate: item.service_date,
    passengerCount: 2,
    grossAmount: Number(item.agreed_cost),
    netPayable: Math.round(Number(item.agreed_cost) * 0.85),
    qrVoucherCode: `VOUCH-${item.id.substring(0, 8).toUpperCase()}`,
    isValidated: item.status === 'reconciled' || item.status === 'settled',
  }));
}

export async function validateVendorQRVoucher(voucherCode: string): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { data: voucher } = await supabase
    .from('vendor_vouchers')
    .select('id, redemption_status, agreed_amount')
    .eq('voucher_code', voucherCode)
    .maybeSingle();

  if (voucher) {
    if (voucher.redemption_status === 'verified_offline' || voucher.redemption_status === 'redeemed') {
      return {
        success: false,
        message: `Voucher ${voucherCode} has already been redeemed/validated.`,
      };
    }

    await supabase
      .from('vendor_vouchers')
      .update({ redemption_status: 'verified_offline', redeemed_at: new Date().toISOString() })
      .eq('id', voucher.id);

    return {
      success: true,
      message: `Voucher ${voucherCode} successfully validated! Agreed Amount: ₹${voucher.agreed_amount}`,
    };
  }

  return {
    success: false,
    message: `Invalid or non-existent voucher code: ${voucherCode}. Validation rejected.`,
  };
}
