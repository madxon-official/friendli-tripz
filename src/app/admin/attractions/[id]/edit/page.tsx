import React from 'react';
import { notFound } from 'next/navigation';
import { getAttractionById, getAttractionCategories, getDestinationZones } from '@/lib/actions/attraction';
import { getDestinations } from '@/lib/actions/destination';
import { AttractionForm } from '@/components/admin/attractions/AttractionForm';

export const metadata = {
  title: 'Edit Attraction | Friendli Travel Catalog Admin',
  description: 'Update attraction details, coordinates, and operating schedules.',
};

export default async function EditAttractionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const attractionId = resolvedParams.id;

  const [attraction, destinationResult, categories, zones] = await Promise.all([
    getAttractionById(attractionId),
    getDestinations({ limit: 100 }),
    getAttractionCategories(),
    getDestinationZones(),
  ]);

  if (!attraction) {
    notFound();
  }

  return (
    <AttractionForm
      initialData={attraction}
      destinations={destinationResult.destinations.map((d) => ({ id: d.id, name: d.name }))}
      categories={categories}
      zones={zones}
    />
  );
}
