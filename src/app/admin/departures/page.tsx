import React from 'react';
import dynamicImport from 'next/dynamic';
import { getDepartures } from '@/lib/actions/departure';

const DynamicDepartureListClient = dynamicImport(
  () => import('@/components/admin/departures/DepartureListClient').then((mod) => mod.DepartureListClient),
  {
    loading: () => (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="h-64 bg-slate-100 rounded-2xl w-full" />
      </div>
    ),
  }
);

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Fixed Departures | Friendli Travel Operations Admin',
  description: 'Manage group tour departures, capacity pools, and room match pools.',
};

export default async function AdminDeparturesPage() {
  const departures = await getDepartures();
  return <DynamicDepartureListClient departures={departures} />;
}
