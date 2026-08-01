import React from 'react';
import { getDepartures } from '@/lib/actions/departure';
import { DepartureListClient } from '@/components/admin/departures/DepartureListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Fixed Departures | Friendli Travel Operations Admin',
  description: 'Manage group tour departures, capacity pools, and room match pools.',
};

export default async function AdminDeparturesPage() {
  const departures = await getDepartures();
  return <DepartureListClient departures={departures} />;
}
