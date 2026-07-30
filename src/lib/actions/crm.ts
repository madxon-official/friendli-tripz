'use server';

import { createClient } from '@/lib/supabase/server';
import { CustomerProfileItem } from '@/lib/types/crm';

export async function getCustomerProfiles(): Promise<CustomerProfileItem[]> {
  return [
    {
      id: 'c-1',
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      totalTripsCompleted: 2,
      lifetimeValue: 58000,
      segmentTier: 'High Value',
      preferredTravelStyle: 'Honeymoon / Relaxed',
    },
    {
      id: 'c-2',
      fullName: 'Priya Iyer',
      email: 'priya.iyer@example.com',
      phone: '+91 98421 87654',
      totalTripsCompleted: 1,
      lifetimeValue: 24500,
      segmentTier: 'Repeat Traveller',
      preferredTravelStyle: 'Family Stays',
    }
  ];
}
