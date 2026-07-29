import React from 'react';
import { getPackageReleases, getPackageFamilies } from '@/lib/actions/package';
import { getDestinations } from '@/lib/actions/destination';
import { PackageListClient } from '@/components/admin/packages/PackageListClient';

export const metadata = {
  title: 'Package Releases | Friendli Travel Catalog Admin',
  description: 'Manage versioned package releases, pricing trees, and temporal itineraries.',
};

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const status = (resolvedParams?.status || 'all') as any;
  const destination_id = resolvedParams?.destination_id;
  const search = resolvedParams?.search || '';

  const [releaseResult, families, destinationResult] = await Promise.all([
    getPackageReleases({
      search,
      status,
      destination_id,
      limit: 50,
    }),
    getPackageFamilies(),
    getDestinations({ limit: 100 }),
  ]);

  return (
    <PackageListClient
      initialData={releaseResult}
      families={families}
      destinations={destinationResult.destinations.map((d) => ({ id: d.id, name: d.name }))}
    />
  );
}
