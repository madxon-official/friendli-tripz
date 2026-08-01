'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { SectionHeading } from '@/components/v3/ui/SectionHeading';
import { Badge } from '@/components/v3/ui/Badge';
import { UPCOMING_DEPARTURES } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';

export function UpcomingTripsSection() {
  // Group departures by month
  const grouped = UPCOMING_DEPARTURES.reduce((acc, dep) => {
    const month = dep.month;
    if (!acc[month]) acc[month] = [];
    acc[month].push(dep);
    return acc;
  }, {} as Record<string, typeof UPCOMING_DEPARTURES>);

  return (
    <section id="upcoming" className="py-section-sm sm:py-section bg-white border-b border-surface-200/40">
      <Container>
        <SectionHeading
          badge="PLAN AHEAD"
          title="Upcoming Departures"
          subtitle="Choose your dates and lock in your spot early. Good vibes await."
          actionText="View full schedule"
          actionHref={ROUTES.PACKAGES}
        />

        <div className="space-y-10">
          {Object.entries(grouped).map(([month, departures]) => (
            <div key={month}>
              {/* Month Label */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-button bg-brand-navy flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-brand-orange" />
                </div>
                <h3 className="text-heading-sm font-heading font-extrabold text-brand-navy">
                  {month}
                </h3>
                <div className="flex-1 h-px bg-surface-200/60" />
              </div>

              {/* Departure Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {departures.map((dep, idx) => (
                  <motion.div
                    key={dep.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                  >
                    <Link
                      href={ROUTES.PACKAGES}
                      className="group flex items-center gap-4 p-4 bg-surface-50 rounded-card border border-surface-200/80 hover:bg-white hover:shadow-card hover:border-brand-orange/20 transition-all duration-300"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-button overflow-hidden shrink-0">
                        <Image
                          src={dep.image}
                          alt={dep.destination}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="80px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-body-sm font-heading font-extrabold text-brand-navy group-hover:text-brand-orange transition-colors">
                            {dep.destination}
                          </span>
                          {dep.seatsLeft <= 5 && (
                            <Badge variant="danger" size="xs" pulse>
                              {dep.seatsLeft} left
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-caption text-brand-muted">
                          <span>{dep.date}</span>
                          <span>•</span>
                          <span>{dep.duration}</span>
                        </div>
                        <div className="text-body-sm font-extrabold text-brand-navy mt-1">
                          {dep.price}
                          <span className="text-caption text-brand-muted font-normal"> /person</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-orange shrink-0 transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
