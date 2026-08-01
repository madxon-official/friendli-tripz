'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Sun, Compass, ArrowRight } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { Badge } from '@/components/v3/ui/Badge';
import { DESTINATIONS } from '@/lib/data/destinations';

export default function DestinationsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5" />
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-4"
          >
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
          </motion.div>
        </Container>
      </section>

      {/* Destination Cards Grid */}
      <section className="py-section-sm sm:py-section bg-surface-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {DESTINATIONS.map((dest, idx) => (
              <motion.div
                key={dest.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
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
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out-expo"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="info" size="xs" icon={<MapPin className="w-3 h-3" />}>
                          {dest.state}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:w-1/2 flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="text-overline text-brand-orange uppercase">
                          {dest.tagline}
                        </span>
                        <h2 className="text-heading font-heading font-extrabold text-brand-navy group-hover:text-brand-orange transition-colors">
                          {dest.name}
                        </h2>
                        <p className="text-body-sm text-brand-muted leading-relaxed line-clamp-3">
                          {dest.description}
                        </p>

                        {/* Info pills */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-badge bg-surface-100 text-caption font-bold text-brand-muted">
                            <Sun className="w-3 h-3 text-amber-500" />
                            {dest.bestSeason}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-badge bg-surface-100 text-caption font-bold text-brand-muted">
                            {dest.weather}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-surface-200/60 mt-5">
                        <div>
                          <span className="text-caption text-brand-muted block">From</span>
                          <span className="text-heading-sm font-heading font-extrabold text-brand-navy">
                            {dest.avgPrice}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-body-sm font-bold text-brand-orange group-hover:gap-2.5 transition-all">
                          View Packages
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
