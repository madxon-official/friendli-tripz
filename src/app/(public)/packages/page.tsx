import React, { Suspense } from 'react';
import { searchPackages } from '@/lib/actions/discovery';
import { PackageCard } from '@/components/public/PackageCard';
import { PackageFilterSidebar } from '@/components/public/PackageFilterSidebar';
import { PackageFilterState } from '@/lib/types/discovery';
import { Compass, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Explore Tour Packages & Itineraries | Friendli Tripz',
  description: 'Filter and discover fixed departures, private tour quotes, and customized hill station packages.',
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const filters: PackageFilterState = {
    searchQuery: resolvedParams.searchQuery,
    destinationSlug: resolvedParams.destinationSlug,
    minDuration: resolvedParams.minDuration ? Number(resolvedParams.minDuration) : undefined,
    maxDuration: resolvedParams.maxDuration ? Number(resolvedParams.maxDuration) : undefined,
    maxBudget: resolvedParams.maxBudget ? Number(resolvedParams.maxBudget) : undefined,
    difficulty: resolvedParams.difficulty,
    familyFriendly: resolvedParams.familyFriendly === 'true',
    honeymoon: resolvedParams.honeymoon === 'true',
    adventure: resolvedParams.adventure === 'true',
    sortBy: (resolvedParams.sortBy as any) || 'popular',
    page: resolvedParams.page ? Number(resolvedParams.page) : 1,
  };

  const { packages, totalCount, page, totalPages } = await searchPackages(filters);

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              Package Catalog
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900">
              Curated Tour Packages ({totalCount})
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Hand-crafted itineraries powered by live pricing and commercial inventory engine.
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <PackageFilterSidebar
              filters={filters}
              onFilterChange={() => {}}
              onReset={() => {}}
            />
          </div>

          {/* Grid */}
          <div className="lg:col-span-3 space-y-6">
            {packages.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No packages matched your filters</h3>
                <p className="text-sm text-slate-500 mt-1">Try broadening your budget or duration parameters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <PackageCard key={pkg.id} packageItem={pkg} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
