'use server';

import { createClient } from '@/lib/supabase/server';
import { HotelArrivalItem } from '@/lib/types/hotel';

export async function getUpcomingHotelArrivals(): Promise<HotelArrivalItem[]> {
  return [
    {
      id: 'arr-1',
      bookingCode: 'FT-2026-9001',
      leadGuestName: 'Rahul Sharma',
      roomCategory: 'Valley View Suite',
      roomsCount: 1,
      checkInDate: '2026-10-15',
      checkOutDate: '2026-10-18',
      mealPlan: 'MAP (Breakfast & Dinner Included)',
      specialRequests: '2nd floor lake view room requested.',
      checkInStatus: 'checked_in',
    },
    {
      id: 'arr-2',
      bookingCode: 'FT-2026-9002',
      leadGuestName: 'Priya Iyer',
      roomCategory: 'Lake View Room',
      roomsCount: 2,
      checkInDate: '2026-10-15',
      checkOutDate: '2026-10-17',
      mealPlan: 'CP (Continental Breakfast)',
      specialRequests: 'Early check-in at 11:00 AM.',
      checkInStatus: 'pending',
    }
  ];
}
