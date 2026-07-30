'use server';

import { createClient } from '@/lib/supabase/server';
import { LiveTripExecutionDetails } from '@/lib/types/execution';

export async function getLiveTripExecutionDetails(bookingId: string): Promise<LiveTripExecutionDetails> {
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, booking_code')
    .eq('id', bookingId)
    .maybeSingle();

  return {
    bookingId: booking?.id || bookingId,
    bookingCode: booking?.booking_code || 'FT-2026-9001',
    currentDayIndex: 1,
    driver: {
      driverName: 'Mani Kumar',
      phone: '+91 94432 10987',
      vehicleModel: 'Toyota Innova Crysta (AC)',
      vehicleNumber: 'TN-57-AB-9876',
      rating: 4.9,
    },
    hotelContactName: 'Grand Hilltop Resort Reception',
    hotelPhone: '+91 4542 240123',
    emergencyContactPhone: '+91 98765 43210',
    vouchers: [
      {
        id: 'vouch-1',
        voucherCode: 'VOUCH-KODAI-BOAT-9001',
        title: 'Kodai Lake 4-Seater Boat Ride Voucher',
        vendorName: 'Kodai Boat Club Official',
        validDate: '2026-10-15',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VOUCH-KODAI-BOAT-9001',
        isRedeemed: false,
      },
      {
        id: 'vouch-2',
        voucherCode: 'VOUCH-PINE-FOREST-9002',
        title: 'Pine Forest Entrance Permit',
        vendorName: 'Forest Dept Tamil Nadu',
        validDate: '2026-10-16',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VOUCH-PINE-FOREST-9002',
        isRedeemed: false,
      }
    ],
  };
}
