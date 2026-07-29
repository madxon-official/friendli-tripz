import React from 'react';
import {
  getMasterCountries,
  getMasterStates,
  getMasterCategories,
  getMasterTags,
} from '@/lib/actions/destination';
import { DestinationForm } from '@/components/admin/destinations/DestinationForm';

export const metadata = {
  title: 'Create Destination | Friendli Travel Catalog Admin',
  description: 'Create a new destination in the travel catalog.',
};

export default async function NewDestinationPage() {
  const [countries, states, categories, masterTags] = await Promise.all([
    getMasterCountries(),
    getMasterStates(),
    getMasterCategories(),
    getMasterTags(),
  ]);

  return (
    <DestinationForm
      initialData={null}
      countries={countries}
      states={states}
      categories={categories}
      masterTags={masterTags}
    />
  );
}
