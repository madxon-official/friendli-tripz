import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Search,
  Compass,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { getDestinations, getMasterCategories, getMasterStates } from '@/lib/actions/destination';

export const metadata = {
  title: 'Explore Travel Destinations | Friendli Tripz',
  description:
    'Discover curated hill stations, beach escapes, and offbeat travel destinations with Friendli Tripz.',
};

export default async function PublicDestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const category_id = resolvedParams?.category;
  const state_id = resolvedParams?.state;
  const search = resolvedParams?.search || '';

  const [destinationResult, categories, states] = await Promise.all([
    getDestinations({
      search,
      category_id,
      state_id,
      limit: 100,
    }),
    getMasterCategories(),
    getMasterStates(),
  ]);

  const destinations = destinationResult.destinations.filter(
    (d) => (d.status === 'published' || d.status === 'coming_soon') && d.website_visibility !== false
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Header Section */}
      <section className="relative bg-brand-navy text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-orange text-xs font-mono font-bold tracking-wider uppercase border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FRIENDLI DESTINATION CATALOG</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Where do you want to travel next?
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Handcrafted travel escapes designed for good company, relaxed pacing, and unforgettable memories.
          </p>
        </div>
      </section>

      {/* Main Content & Filters */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-10">
        {/* Search & Category Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xl space-y-4">
          <form method="GET" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search destinations (e.g. Kodaikanal, Ooty, Munnar)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-brand-orange text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors shadow-button shrink-0"
            >
              Search
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            <Link
              href="/destinations"
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                !category_id
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Destinations
            </Link>
            {categories.map((cat) => {
              const isSelected = category_id === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={`/destinations?category=${cat.id}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Destination Cards Grid (NOT Table!) */}
        {destinations.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center space-y-4 border border-slate-200 shadow-sm">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800">No destinations found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              We couldn&apos;t find any destinations matching your search. Check back soon as we add new escapes every week!
            </p>
            <Link
              href="/destinations"
              className="inline-block px-5 py-2.5 bg-brand-orange text-white text-xs font-bold rounded-xl"
            >
              View All Destinations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => {
              const isComingSoon = dest.status === 'coming_soon';
              const imageSrc =
                dest.featured_image_url || dest.hero_banner_url || '/images/kodaikanal/kodaikanal-hero.webp';

              return (
                <div
                  key={dest.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Hero Image Container */}
                    <div className="relative h-60 w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={dest.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-900 shadow-sm">
                          {dest.category?.name || 'Hill Station'}
                        </span>

                        {isComingSoon ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Coming Soon
                          </span>
                        ) : dest.is_featured ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </span>
                        ) : null}
                      </div>

                      {/* Title & Location Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h2 className="text-2xl font-heading font-black tracking-tight leading-none text-white drop-shadow-md">
                          {dest.name}
                        </h2>
                        <div className="text-xs font-semibold text-slate-200 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                          <span>
                            {dest.state?.name}, {dest.country?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {dest.short_description || 'Misty roads, pine forests, and mountain air with good company.'}
                      </p>

                      {/* Quick Pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold font-mono text-slate-600 border-t border-slate-100">
                        {dest.ideal_duration && (
                          <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5 text-brand-orange" />
                            <span>{dest.ideal_duration}</span>
                          </div>
                        )}
                        {dest.best_season && (
                          <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                            <span>{dest.best_season}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="p-6 pt-0">
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className={`w-full py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                        isComingSoon
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-brand-orange text-white hover:bg-orange-600 shadow-button'
                      }`}
                    >
                      <span>{isComingSoon ? 'Explore Preview' : 'Explore Destination'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
