import React from 'react';
import { getAttractionCategories, getDestinationZones } from '@/lib/actions/attraction';
import { getDestinations } from '@/lib/actions/destination';
import { AttractionForm } from '@/components/admin/attractions/AttractionForm';

export const metadata = {
  title: 'Create Attraction | Friendli Travel Catalog Admin',
  description: 'Add a new point of interest to the travel catalog.',
};

export default async function NewAttractionPage() {
  const [destinationResult, categories, zones] = await Promise.all([
    getDestinations({ limit: 100 }),
    getAttractionCategories(),
    getDestinationZones(),
  ]);

  return (
    <AttractionForm
      initialData={null}
      destinations={destinationResult.destinations.map((d) => ({ id: d.id, name: d.name }))}
      categories={categories}
      zones={zones}
    />
  );
}
