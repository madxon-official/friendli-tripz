'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Star, ArrowRight, Search, SlidersHorizontal, X,
  Compass, Users, Filter,
} from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { Badge } from '@/components/v3/ui/Badge';
import { Tabs } from '@/components/v3/ui/Tabs';
import { Input } from '@/components/v3/ui/Input';
import { Button } from '@/components/v3/ui/Button';
import { GradientButton } from '@/components/v3/ui/GradientButton';
import { TRENDING_TRIPS, VIBE_CATEGORIES } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';

const FILTER_TABS = [
  { id: 'all', label: 'All Trips' },
  { id: 'trending', label: 'Trending', count: 6 },
  { id: 'weekend', label: 'Weekend' },
  { id: 'long', label: 'Long Trips' },
];

export default function PackagesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  const filteredTrips = useMemo(() => {
    let trips = TRENDING_TRIPS;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      trips = trips.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'trending') {
      trips = trips.filter((t) => t.badge);
    }

    return trips;
  }, [activeFilter, searchQuery]);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5" />
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <Badge variant="brand" size="sm" icon={<Compass className="w-3.5 h-3.5" />}>
              Curated Packages
            </Badge>
            <h1 className="text-display sm:text-display-lg font-heading font-extrabold text-white">
              Trip Packages
            </h1>
            <p className="text-body-lg text-white/70 max-w-xl mx-auto">
              Fixed departures. Verified stays. Zero hassle. Pick your escape and we&apos;ll handle the rest.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Filters & Grid */}
      <section className="py-section-sm sm:py-section bg-surface-50">
        <Container>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <Tabs
              tabs={FILTER_TABS}
              defaultTab="all"
              onChange={(id) => setActiveFilter(id)}
              variant="pills"
              size="sm"
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Input
                placeholder="Search trips..."
                icon={<Search className="w-4 h-4" />}
                size="sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!rounded-badge"
              />
            </div>
          </div>

          {/* Vibe Filters (horizontal scroll) */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
            {VIBE_CATEGORIES.slice(0, 8).map((vibe) => (
              <button
                key={vibe.id}
                onClick={() => setSelectedVibe(selectedVibe === vibe.title ? null : vibe.title)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-badge border text-body-sm font-bold transition-all ${
                  selectedVibe === vibe.title
                    ? 'border-brand-orange bg-brand-soft-orange text-brand-orange'
                    : 'border-surface-200 bg-white text-brand-muted hover:border-brand-orange/40'
                }`}
              >
                <span>{vibe.title}</span>
                {selectedVibe === vibe.title && <X className="w-3 h-3" />}
              </button>
            ))}
          </div>

          {/* Trip Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={`${ROUTES.PACKAGES}/${trip.slug}`}
                    className="group block bg-white rounded-card-lg border border-surface-200/80 shadow-subtle overflow-hidden card-interactive"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={trip.image}
                        alt={trip.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out-expo"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {trip.badge && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="brand" size="xs">{trip.badge}</Badge>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-badge bg-black/40 backdrop-blur-md text-white text-caption font-bold">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{trip.rating}</span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="warning" size="xs" pulse>{trip.seatsLeft}</Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3 text-caption text-brand-muted">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                          {trip.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {trip.duration}
                        </span>
                      </div>
                      <h3 className="text-heading-sm font-heading font-extrabold text-brand-navy group-hover:text-brand-orange transition-colors leading-tight">
                        {trip.name}
                      </h3>
                      <div className="flex items-center justify-between pt-3 border-t border-surface-200/60">
                        <div>
                          <span className="text-caption text-brand-muted block">From</span>
                          <span className="text-heading-sm font-heading font-extrabold text-brand-navy">{trip.price}</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-body-sm font-bold text-brand-orange group-hover:gap-2.5 transition-all">
                          View Trip
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto text-brand-muted/40">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-heading-sm font-heading font-bold text-brand-navy">No trips found</h3>
              <p className="text-body-sm text-brand-muted">Try adjusting your filters or search query.</p>
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setActiveFilter('all'); setSelectedVibe(null); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
