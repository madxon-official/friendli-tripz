import React from 'react';
import {
  getDestinations,
  getMasterCategories,
  getMasterStates,
  getMasterCountries,
} from '@/lib/actions/destination';
import { DestinationListClient } from '@/components/admin/destinations/DestinationListClient';

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

  // Fetch initial dataset on server component
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
    <DestinationListClient
      initialData={initialData}
      categories={categories}
      states={states}
      countries={countries}
    />
  );
}
