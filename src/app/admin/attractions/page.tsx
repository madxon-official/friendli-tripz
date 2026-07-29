import React from 'react';
import { getAttractions, getAttractionCategories, getDestinationZones } from '@/lib/actions/attraction';
import { getDestinations } from '@/lib/actions/destination';
import { AttractionListClient } from '@/components/admin/attractions/AttractionListClient';

export const metadata = {
  title: 'Attractions | Friendli Travel Catalog Admin',
  description: 'Manage points of interest, coordinates, operating schedules, and bound activities.',
};

export default async function AdminAttractionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const status = (resolvedParams?.status || 'all') as any;
  const destination_id = resolvedParams?.destination_id;
  const category_id = resolvedParams?.category_id;
  const search = resolvedParams?.search || '';

  const [attractionResult, destinationResult, categories, zones] = await Promise.all([
    getAttractions({
      search,
      status,
      destination_id,
      category_id,
      limit: 50,
    }),
    getDestinations({ limit: 100 }),
    getAttractionCategories(),
    getDestinationZones(),
  ]);

  return (
    <AttractionListClient
      initialData={attractionResult}
      destinations={destinationResult.destinations.map((d) => ({ id: d.id, name: d.name }))}
      categories={categories}
      zones={zones}
    />
  );
}
