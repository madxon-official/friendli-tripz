import React from 'react';
import { getPackageFamilies } from '@/lib/actions/package';
import { getDestinations } from '@/lib/actions/destination';
import { getAttractions } from '@/lib/actions/attraction';
import { getMasterActivities } from '@/lib/actions/activity';
import { PackageReleaseForm } from '@/components/admin/packages/PackageReleaseForm';

export const metadata = {
  title: 'Build Package Release | Friendli Travel Catalog Admin',
  description: 'Create a new versioned commercial package release.',
};

export default async function NewPackageReleasePage() {
  const [families, destinationResult, attractionResult, activities] = await Promise.all([
    getPackageFamilies(),
    getDestinations({ limit: 100 }),
    getAttractions({ limit: 100 }),
    getMasterActivities('all'),
  ]);

  const activityOfferings: { id: string; title: string }[] = [];
  activities.forEach((act: any) => {
    if (act.offerings) {
      act.offerings.forEach((off: any) => {
        activityOfferings.push({ id: off.id, title: `${act.name} - ${off.title}` });
      });
    }
  });

  return (
    <PackageReleaseForm
      families={families}
      destinations={destinationResult.destinations.map((d) => ({ id: d.id, name: d.name }))}
      attractions={attractionResult.attractions}
      activityOfferings={activityOfferings}
    />
  );
}
