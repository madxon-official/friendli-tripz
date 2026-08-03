import React from 'react';
import dynamicImport from 'next/dynamic';
import { getBookings } from '@/lib/actions/booking';

const DynamicBookingListClient = dynamicImport(
  () => import('@/components/admin/bookings/BookingListClient').then((mod) => mod.BookingListClient),
  {
    loading: () => (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="h-64 bg-slate-100 rounded-2xl w-full" />
      </div>
    ),
  }
);

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

  return <DynamicBookingListClient initialData={bookingResult} />;
}
