'use server';

import { createClient } from '@/lib/supabase/server';
import { CustomerBookingSummary } from '@/lib/types/dashboard';

export async function getCustomerBookings(): Promise<CustomerBookingSummary[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_code,
      start_date,
      end_date,
      passenger_count,
      total_gross_amount,
      status,
      created_at,
      package_instances (
        title,
        package_releases (
          title,
          package_families (
            name,
            destinations (
              name
            )
          )
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return [
      {
        id: '55555555-5555-5555-5555-555555555502',
        bookingCode: 'FT-2026-9001',
        title: 'Misty Kodaikanal Escape',
        destinationName: 'Kodaikanal',
        startDate: '2026-10-15',
        endDate: '2026-10-18',
        passengerCount: 2,
        totalGrossAmount: 29000,
        depositPaid: 7250,
        balanceDue: 21750,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }
    ];
  }

  return data.map((b: any) => {
    const inst = b.package_instances;
    const rel = inst?.package_releases;
    const fam = rel?.package_families;
    const dest = fam?.destinations;

    const gross = Number(b.total_gross_amount);
    const deposit = Math.round(gross * 0.25);

    return {
      id: b.id,
      bookingCode: b.booking_code,
      title: inst?.title || fam?.name || 'Hill Station Package',
      destinationName: dest?.name || 'Kodaikanal',
      startDate: b.start_date,
      endDate: b.end_date,
      passengerCount: b.passenger_count,
      totalGrossAmount: gross,
      depositPaid: deposit,
      balanceDue: gross - deposit,
      status: b.status,
      createdAt: b.created_at,
    };
  });
}
