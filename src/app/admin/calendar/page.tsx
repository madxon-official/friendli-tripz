import React from 'react';
import { getBookings } from '@/lib/actions/booking';
import { OperationsCalendarClient } from '@/components/admin/calendar/OperationsCalendarClient';

export const metadata = {
  title: 'Operations Calendar | Friendli Travel Admin',
  description: 'Interactive booking calendar for daily, weekly, monthly, and agenda tour schedules.',
};

export default async function OperationsCalendarPage() {
  const bookingResult = await getBookings({ limit: 100 });

  return <OperationsCalendarClient initialBookings={bookingResult.bookings || []} />;
}
