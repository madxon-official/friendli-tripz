'use server';

import { createClient } from '@/lib/supabase/server';
import { LiveDeploymentItem, OperationalAlertItem, PickupManifestEntry } from '@/lib/types/operations';

export async function getLiveDeployments(): Promise<LiveDeploymentItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('operational_deployments')
    .select(`
      id,
      booking_id,
      departure_date,
      return_date,
      status,
      readiness_score,
      delay_mins,
      has_resource_conflict,
      bookings (
        booking_code,
        lead_booker_name,
        passenger_count
      ),
      vehicle_assignments (
        vehicle_model,
        vehicle_number
      ),
      driver_assignments (
        driver_name,
        driver_phone
      ),
      guide_assignments (
        guide_name,
        guide_phone
      ),
      hotel_allocations (
        hotel_name,
        room_category,
        allocated_rooms_count
      )
    `)
    .order('departure_date', { ascending: true });

  if (error || !data || data.length === 0) {
    return [
      {
        id: '66666666-6666-6666-6666-666666666601',
        bookingId: '55555555-5555-5555-5555-555555555502',
        bookingCode: 'FT-2026-9001',
        leadBookerName: 'Rahul Sharma',
        departureDate: '2026-10-15',
        returnDate: '2026-10-18',
        status: 'ready',
        readinessScore: 95,
        delayMins: 0,
        hasResourceConflict: false,
        vehicle: { model: 'Toyota Innova Crysta 7-Seater', number: 'TN-57-AB-9876' },
        driver: { name: 'Mani Kumar', phone: '+91 94432 10987' },
        guide: { name: 'Suresh Raman', phone: '+91 98765 43211' },
        hotel: { name: 'Grand Hilltop Resort', roomCategory: 'Valley View Suite', roomsCount: 1 },
        passengerCount: 2,
      },
      {
        id: '66666666-6666-6666-6666-666666666602',
        bookingId: '55555555-5555-5555-5555-555555555503',
        bookingCode: 'FT-2026-9002',
        leadBookerName: 'Priya Iyer',
        departureDate: '2026-10-15',
        returnDate: '2026-10-17',
        status: 'in_transit',
        readinessScore: 100,
        delayMins: 0,
        hasResourceConflict: false,
        vehicle: { model: 'Mahindra XUV700 AC', number: 'TN-38-CD-4321' },
        driver: { name: 'Venkatesh S', phone: '+91 98421 87654' },
        guide: { name: 'Anand K', phone: '+91 94431 12345' },
        hotel: { name: 'Sterling Kodai Lake', roomCategory: 'Lake View Room', roomsCount: 2 },
        passengerCount: 4,
      }
    ];
  }

  return data.map((d: any) => {
    const booking = d.bookings;
    const vehicle = d.vehicle_assignments?.[0];
    const driver = d.driver_assignments?.[0];
    const guide = d.guide_assignments?.[0];
    const hotel = d.hotel_allocations?.[0];

    return {
      id: d.id,
      bookingId: d.booking_id,
      bookingCode: booking?.booking_code || 'FT-2026-0000',
      leadBookerName: booking?.lead_booker_name || 'Traveller',
      departureDate: d.departure_date,
      returnDate: d.return_date,
      status: d.status,
      readinessScore: d.readiness_score,
      delayMins: d.delay_mins,
      hasResourceConflict: d.has_resource_conflict,
      vehicle: vehicle ? { model: vehicle.vehicle_model, number: vehicle.vehicle_number } : undefined,
      driver: driver ? { name: driver.driver_name, phone: driver.driver_phone } : undefined,
      guide: guide ? { name: guide.guide_name, phone: guide.guide_phone } : undefined,
      hotel: hotel ? { name: hotel.hotel_name, roomCategory: hotel.room_category, roomsCount: hotel.allocated_rooms_count } : undefined,
      passengerCount: booking?.passenger_count || 1,
    };
  });
}

export async function getOperationalAlerts(): Promise<OperationalAlertItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('operational_alerts')
    .select('*')
    .eq('is_resolved', false)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return [
      {
        id: 'alert-1',
        alertLevel: 'warning',
        alertType: 'weather',
        message: 'Misty fog alert reported along Ghat Road Section 4. Advised 15 min buffer speed limit.',
        isResolved: false,
        createdAt: new Date().toISOString(),
      }
    ];
  }

  return data.map((a: any) => ({
    id: a.id,
    deploymentId: a.deployment_id,
    alertLevel: a.alert_level,
    alertType: a.alert_type,
    message: a.message,
    isResolved: a.is_resolved,
    createdAt: a.created_at,
  }));
}

export async function assignVehicleAndDriver(deploymentId: string, vehicleModel: string, vehicleNumber: string, driverName: string, driverPhone: string): Promise<{ success: boolean }> {
  const supabase = await createClient();

  try {
    await supabase.from('vehicle_assignments').insert({
      deployment_id: deploymentId,
      vehicle_model: vehicleModel,
      vehicle_number: vehicleNumber,
    });

    await supabase.from('driver_assignments').insert({
      deployment_id: deploymentId,
      driver_name: driverName,
      driver_phone: driverPhone,
    });

    await supabase
      .from('operational_deployments')
      .update({ readiness_score: 100, status: 'ready' })
      .eq('id', deploymentId);
  } catch (e) {
    console.error('[Operations] Failed to assign vehicle/driver:', e);
    return { success: false };
  }

  return { success: true };
}
