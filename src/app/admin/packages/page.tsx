import React from 'react';
import dynamicImport from 'next/dynamic';
import { getPackageReleases, getPackageFamilies } from '@/lib/actions/package';
import { getDestinations } from '@/lib/actions/destination';

const DynamicPackageListClient = dynamicImport(
  () => import('@/components/admin/packages/PackageListClient').then((mod) => mod.PackageListClient),
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
    <DynamicPackageListClient
      initialData={releaseResult}
      families={families}
      destinations={destinationResult.destinations.map((d) => ({ id: d.id, name: d.name }))}
    />
  );
}
