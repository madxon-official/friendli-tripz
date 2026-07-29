import React from 'react';
import { notFound } from 'next/navigation';
import {
  getDestinationById,
  getMasterCountries,
  getMasterStates,
  getMasterCategories,
  getMasterTags,
} from '@/lib/actions/destination';
import { DestinationForm } from '@/components/admin/destinations/DestinationForm';

export const metadata = {
  title: 'Edit Destination | Friendli Travel Catalog Admin',
  description: 'Update destination parameters and travel guides.',
};

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const destinationId = resolvedParams.id;

  const [destination, countries, states, categories, masterTags] = await Promise.all([
    getDestinationById(destinationId),
    getMasterCountries(),
    getMasterStates(),
    getMasterCategories(),
    getMasterTags(),
  ]);

  if (!destination) {
    notFound();
  }

  return (
    <DestinationForm
      initialData={destination}
      countries={countries}
      states={states}
      categories={categories}
      masterTags={masterTags}
    />
  );
}
