'use server';

import { createClient } from '@/lib/supabase/server';
import { ExecutiveMetrics, DestinationPerformanceItem } from '@/lib/types/analytics';

export async function getExecutiveMetrics(): Promise<ExecutiveMetrics> {
  return {
    totalRevenue: 2450000,
    totalBookings: 148,
    conversionRate: 4.8,
    cancellationRate: 1.2,
    averageMargin: 20.69,
    topDestination: 'Kodaikanal',
    aiPlannerSessions: 1240,
  };
}

export async function getDestinationPerformance(): Promise<DestinationPerformanceItem[]> {
  return [
    { destinationName: 'Kodaikanal', bookingsCount: 68, grossRevenue: 1120000, averageRating: 4.9 },
    { destinationName: 'Ooty', bookingsCount: 42, grossRevenue: 680000, averageRating: 4.7 },
    { destinationName: 'Wayanad', bookingsCount: 24, grossRevenue: 410000, averageRating: 4.8 },
    { destinationName: 'Coorg', bookingsCount: 14, grossRevenue: 240000, averageRating: 4.9 },
  ];
}
