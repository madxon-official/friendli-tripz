'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Users, ArrowRight } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { SectionHeading } from '@/components/v3/ui/SectionHeading';
import { Badge } from '@/components/v3/ui/Badge';
import { TRENDING_TRIPS } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';

function TripCard({
  slug,
  name,
  location,
  duration,
  price,
  rating,
  reviewsCount,
  nextDeparture,
  seatsLeft,
  image,
  badge,
  index,
}: (typeof TRENDING_TRIPS)[number] & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`${ROUTES.PACKAGES}/${slug}`}
        className="group block bg-white rounded-card-lg border border-surface-200/80 shadow-subtle overflow-hidden card-interactive"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out-expo"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {badge && (
              <Badge variant="brand" size="xs">
                {badge}
              </Badge>
            )}
          </div>

          {/* Rating pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-badge bg-black/40 backdrop-blur-md text-white text-caption font-bold">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{rating}</span>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Seats badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="warning" size="xs" pulse>
              {seatsLeft}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Location & Duration */}
          <div className="flex items-center gap-3 text-caption text-brand-muted">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-heading-sm font-heading font-extrabold text-brand-navy group-hover:text-brand-orange transition-colors leading-tight">
            {name}
          </h3>

          {/* Footer: Price + Next departure */}
          <div className="flex items-center justify-between pt-3 border-t border-surface-200/60">
            <div>
              <span className="text-caption text-brand-muted block">From</span>
              <span className="text-heading-sm font-heading font-extrabold text-brand-navy">
                {price}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-orange text-body-sm font-bold group-hover:gap-2.5 transition-all">
              <span>View Trip</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function TrendingTripsSection() {
  return (
    <section id="trending" className="py-section-sm sm:py-section bg-surface-50 border-b border-surface-200/40">
      <Container>
        <SectionHeading
          badge="COMMUNITY FAVOURITES"
          title="Trending Escapes"
          subtitle="Top rated group trips loved by travellers. Fixed departures, handpicked stays, zero hassle."
          actionText="View all packages"
          actionHref={ROUTES.PACKAGES}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TRENDING_TRIPS.slice(0, 6).map((trip, index) => (
            <TripCard key={trip.id} {...trip} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
