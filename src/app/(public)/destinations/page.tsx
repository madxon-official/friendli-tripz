import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, Sun, Compass, ArrowRight } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { Badge } from '@/components/v3/ui/Badge';
import { DESTINATIONS } from '@/lib/data/destinations';

export const metadata: Metadata = {
  title: 'Curated Destinations | Friendli Tripz',
  description: 'Explore pre-audited hill stations and curated travel destinations across South India.',
};

export const revalidate = 3600; // Enable ISR static caching every 1 hour

export default function DestinationsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5" />
        <Container className="relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <Badge variant="brand" size="sm" icon={<Compass className="w-3.5 h-3.5" />}>
              Curated Escapes
            </Badge>
            <h1 className="text-display sm:text-display-lg font-heading font-extrabold text-white">
              Discover{' '}
              <span className="text-gradient-warm inline-block">Magical Destinations</span>
            </h1>
            <p className="text-body-lg text-white/70 max-w-xl mx-auto">
              Every destination is pre-audited with verified local partners, boutique stays, and curated activity itineraries.
            </p>
          </div>
        </Container>
      </section>

      {/* Destination Cards Grid */}
      <section className="py-section-sm sm:py-section bg-surface-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {DESTINATIONS.map((dest) => (
              <div key={dest.slug}>
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="group block bg-white rounded-card-lg border border-surface-200/80 shadow-subtle overflow-hidden card-interactive"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden">
                      <Image
                        src={dest.heroImage}
                        alt={dest.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />
                      <div className="absolute top-3 left-3 md:hidden">
                        <span className="text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {dest.state}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="hidden md:flex items-center justify-between text-caption text-surface-400 mb-2">
                          <span className="font-semibold text-brand-orange uppercase tracking-wider text-[11px]">
                            {dest.state}
                          </span>
                          <span>{dest.weather}</span>
                        </div>

                        <h2 className="text-heading-md font-heading font-bold text-surface-900 group-hover:text-brand-orange transition-colors">
                          {dest.name}
                        </h2>
                        <p className="text-body-sm text-surface-500 mt-1 line-clamp-2">
                          {dest.description}
                        </p>
                      </div>

                      {/* Highlights & Meta */}
                      <div className="space-y-3 pt-2 border-t border-surface-100">
                        <div className="flex flex-wrap gap-1.5">
                          {dest.highlights.slice(0, 3).map((hl) => (
                            <span
                              key={hl}
                              className="text-[11px] font-medium text-surface-600 bg-surface-100 px-2 py-0.5 rounded-full"
                            >
                              {hl}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="text-caption text-surface-500">
                            <span className="font-bold text-surface-900">{dest.packageCount}</span>{' '}
                            trips available
                          </div>
                          <span className="inline-flex items-center gap-1 text-label-sm font-bold text-brand-orange group-hover:translate-x-1 transition-transform">
                            Explore <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
