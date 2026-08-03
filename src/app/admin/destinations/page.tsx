import React from 'react';
import dynamicImport from 'next/dynamic';
import {
  getDestinations,
  getMasterCategories,
  getMasterStates,
  getMasterCountries,
} from '@/lib/actions/destination';

const DynamicDestinationListClient = dynamicImport(
  () => import('@/components/admin/destinations/DestinationListClient').then((mod) => mod.DestinationListClient),
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
  title: 'Destinations | Friendli Travel Catalog Admin',
  description: 'Manage public destinations, travel guides, and catalog attributes.',
};

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const status = (resolvedParams?.status || 'all') as any;
  const category_id = resolvedParams?.category_id;
  const state_id = resolvedParams?.state_id;
  const search = resolvedParams?.search || '';

  const [initialData, categories, states, countries] = await Promise.all([
    getDestinations({
      search,
      status,
      category_id,
      state_id,
      limit: 50,
    }),
    getMasterCategories(),
    getMasterStates(),
    getMasterCountries(),
  ]);

  return (
    <DynamicDestinationListClient
      initialData={initialData}
      categories={categories}
      states={states}
      countries={countries}
    />
  );
}
