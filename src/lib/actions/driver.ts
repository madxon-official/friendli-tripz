'use server';

import { createClient } from '@/lib/supabase/server';
import { DriverPickupTask } from '@/lib/types/driver';

export async function getDriverPickups(): Promise<DriverPickupTask[]> {
  return [
    {
      id: 'pickup-1',
      bookingCode: 'FT-2026-9001',
      passengerName: 'Rahul Sharma',
      passengerPhone: '+91 98765 43210',
      pickupLocation: 'Madurai Junction Railway Station (Platform 1 Exit)',
      pickupTime: '08:30 AM',
      destination: 'Grand Hilltop Resort Kodaikanal',
      boardingStatus: 'boarded',
    },
    {
      id: 'pickup-2',
      bookingCode: 'FT-2026-9002',
      passengerName: 'Priya Iyer',
      passengerPhone: '+91 98421 87654',
      pickupLocation: 'Kodai Road Railway Station',
      pickupTime: '10:15 AM',
      destination: 'Sterling Kodai Lake',
      boardingStatus: 'pending',
    }
  ];
}

export async function updateBoardingStatus(pickupId: string, status: 'boarded' | 'no_show'): Promise<{ success: boolean }> {
  return { success: true };
}
