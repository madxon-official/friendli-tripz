'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin, Sun, CloudRain, Compass, Camera, ArrowRight,
  Mountain, Utensils, Calendar, Star, ChevronRight,
} from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { SectionHeading } from '@/components/v3/ui/SectionHeading';
import { Badge } from '@/components/v3/ui/Badge';
import { Card } from '@/components/v3/ui/Card';
import { Accordion } from '@/components/v3/ui/Accordion';
import { GradientButton } from '@/components/v3/ui/GradientButton';
import { ROUTES } from '@/lib/routes';
import { DESTINATIONS } from '@/lib/data/destinations';
import { TRENDING_TRIPS, FAQ_ITEMS, UPCOMING_DEPARTURES } from '@/lib/data/trips';

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dest = DESTINATIONS.find((d) => d.slug === slug);

  if (!dest) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-display font-heading font-extrabold text-brand-navy">Destination Not Found</h1>
          <GradientButton href={ROUTES.DESTINATIONS}>Browse Destinations</GradientButton>
        </div>
      </main>
    );
  }

  const relatedTrips = TRENDING_TRIPS.filter((t) =>
    t.location.toLowerCase().includes(dest.state.toLowerCase()) ||
    t.name.toLowerCase().includes(dest.name.toLowerCase())
  ).slice(0, 3);

  const destinationFAQs = [
    { id: 'dfaq-1', title: `What is the best time to visit ${dest.name}?`, content: `The best season to visit ${dest.name} is ${dest.bestSeason}. During this period, the weather is pleasant with temperatures ranging from ${dest.weather}, making it ideal for sightseeing and outdoor activities.` },
    { id: 'dfaq-2', title: `How do I reach ${dest.name}?`, content: `${dest.name} is well-connected by road. Our group trips include comfortable AC transport from the departure city. We handle all logistics so you just need to show up at the meeting point.` },
    { id: 'dfaq-3', title: `What should I pack for ${dest.name}?`, content: `Pack light layers, comfortable walking shoes, a light rain jacket, sunscreen, and a camera. We provide a detailed packing list after booking.` },
    { id: 'dfaq-4', title: `Is ${dest.name} safe for solo travellers?`, content: `Absolutely! Over 60% of our travellers join solo. You'll be paired with same-gender room-mates and our trip leaders ensure everyone feels included from day one.` },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <Image
          src={dest.heroImage}
          alt={dest.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />

        <Container className="relative z-10 pb-12 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <Badge variant="brand" size="sm" icon={<MapPin className="w-3 h-3" />}>
                {dest.state}
              </Badge>
              <Badge variant="success" size="xs" icon={<Sun className="w-3 h-3" />}>
                {dest.bestSeason}
              </Badge>
            </div>
            <h1 className="text-display-lg sm:text-display-xl font-heading font-extrabold text-white">
              {dest.name}
            </h1>
            <p className="text-body-lg text-white/70 max-w-xl">{dest.tagline}</p>
            <div className="flex items-center gap-4 pt-2">
              <GradientButton href={ROUTES.PACKAGES} variant="orange" size="md">
                View {dest.packageCount} Packages
              </GradientButton>
              <GradientButton href={ROUTES.PLANNER} variant="glass" size="md" icon={<Compass className="w-4 h-4" />}>
                Plan Trip Here
              </GradientButton>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Story / About */}
      <section className="py-section-sm sm:py-section bg-white border-b border-surface-200/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3 space-y-6">
              <SectionHeading
                badge="THE STORY"
                title={`Discover ${dest.name}`}
                size="sm"
              />
              <p className="text-body text-brand-muted leading-relaxed">
                {dest.description}
              </p>
              <p className="text-body text-brand-muted leading-relaxed">
                Friendli Tripz brings you a curated experience of {dest.name} — not a rushed checklist, but a journey designed around the best this destination has to offer. Our local experts know every hidden waterfall, the best sunrise spots, and where to find the most authentic local cuisine.
              </p>
            </div>

            {/* Highlight Cards */}
            <div className="lg:col-span-2 space-y-4">
              <Card variant="elevated" padding="lg">
                <h3 className="text-heading-sm font-heading font-extrabold text-brand-navy mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  {[
                    { icon: Sun, label: 'Best Season', value: dest.bestSeason },
                    { icon: CloudRain, label: 'Temperature', value: dest.weather },
                    { icon: Compass, label: 'Available Packages', value: `${dest.packageCount} trips` },
                    { icon: Star, label: 'Starting Price', value: dest.avgPrice },
                  ].map((fact) => (
                    <div key={fact.label} className="flex items-center gap-3 py-2 border-b border-surface-200/40 last:border-0">
                      <div className="w-9 h-9 rounded-button bg-brand-soft-orange flex items-center justify-center shrink-0">
                        <fact.icon className="w-4 h-4 text-brand-orange" />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-body-sm text-brand-muted">{fact.label}</span>
                        <span className="text-body-sm font-bold text-brand-navy">{fact.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Highlights / Things To Do */}
      <section className="py-section-sm sm:py-section bg-surface-50 border-b border-surface-200/40">
        <Container>
          <SectionHeading
            badge="EXPERIENCES"
            title={`Things To Do in ${dest.name}`}
            subtitle="Curated activities and hidden gems handpicked by our local experts."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dest.thingsToDo.map((activity, idx) => (
              <motion.div
                key={activity}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07, duration: 0.4 }}
              >
                <Card variant="interactive" padding="lg" className="h-full group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-card bg-brand-soft-orange flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all">
                      <Mountain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-body font-bold text-brand-navy group-hover:text-brand-orange transition-colors">
                        {activity}
                      </h3>
                      <p className="text-caption text-brand-muted mt-1">
                        Included in select packages
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Gallery */}
      {dest.gallery.length > 0 && (
        <section className="py-section-sm sm:py-section bg-white border-b border-surface-200/40">
          <Container>
            <SectionHeading
              badge="GALLERY"
              title={`${dest.name} in Pictures`}
              subtitle="Real photos from our trips — no stock images."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {dest.gallery.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.4 }}
                  className="relative aspect-[4/3] rounded-card overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={img}
                    alt={`${dest.name} photo ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out-expo"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/30 transition-all duration-300 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Related Trips */}
      {relatedTrips.length > 0 && (
        <section className="py-section-sm sm:py-section bg-surface-50 border-b border-surface-200/40">
          <Container>
            <SectionHeading
              badge="RELATED TRIPS"
              title={`${dest.name} Packages`}
              actionText="View all packages"
              actionHref={ROUTES.PACKAGES}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTrips.map((trip, idx) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={`${ROUTES.PACKAGES}/${trip.slug}`}
                    className="group block bg-white rounded-card-lg border border-surface-200/80 shadow-subtle overflow-hidden card-interactive"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={trip.image} alt={trip.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                      {trip.badge && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="brand" size="xs">{trip.badge}</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="text-heading-sm font-heading font-extrabold text-brand-navy group-hover:text-brand-orange transition-colors">
                        {trip.name}
                      </h3>
                      <div className="flex items-center gap-3 text-caption text-brand-muted">
                        <span>{trip.duration}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{trip.rating}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-surface-200/60">
                        <span className="text-heading-sm font-extrabold text-brand-navy">{trip.price}</span>
                        <span className="text-body-sm font-bold text-brand-orange flex items-center gap-1">
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ */}
      <section className="py-section-sm sm:py-section bg-white border-b border-surface-200/40">
        <Container size="narrow">
          <SectionHeading
            badge="FAQ"
            title={`${dest.name} Trip FAQs`}
            centered
          />
          <Accordion items={destinationFAQs} variant="card" />
        </Container>
      </section>

      {/* CTA */}
      <section className="py-section sm:py-section-lg bg-gradient-brand relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5" />
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <h2 className="text-display font-heading font-extrabold text-white">
              Ready to explore {dest.name}?
            </h2>
            <p className="text-body-lg text-white/70">
              Join {dest.packageCount} curated packages starting from {dest.avgPrice} per person.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <GradientButton href={ROUTES.CUSTOMIZE} variant="orange" size="lg" glow>
                Join a Trip
              </GradientButton>
              <GradientButton href={ROUTES.CONTACT} variant="glass" size="lg">
                Talk to Us
              </GradientButton>
            </div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
