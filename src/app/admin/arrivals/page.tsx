import React from 'react';
import { getBookings } from '@/lib/actions/booking';
import { ArrivalQueueClient } from '@/components/admin/arrivals/ArrivalQueueClient';

export const metadata = {
  title: 'Today’s Arrivals Queue | Friendli Travel Operations Admin',
  description: 'Manage passenger arrival schedules, airport/station pickups, driver greetings, and hotel check-in readiness.',
};

export default async function ArrivalsPage() {
  const bookingResult = await getBookings({ limit: 100 });

  return <ArrivalQueueClient initialBookings={bookingResult.bookings || []} />;
}
