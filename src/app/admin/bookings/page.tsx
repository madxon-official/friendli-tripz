import React from 'react';
import { getBookings } from '@/lib/actions/booking';
import { BookingListClient } from '@/components/admin/bookings/BookingListClient';

export const metadata = {
  title: 'Bookings & Roster | Friendli Travel Operations Admin',
  description: 'Manage confirmed customer bookings, state transitions, passenger rosters, and snapshots.',
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const status = (resolvedParams?.status || 'all') as any;
  const search = resolvedParams?.search || '';

  const bookingResult = await getBookings({
    search,
    status,
    limit: 50,
  });

  return <BookingListClient initialData={bookingResult} />;
}
