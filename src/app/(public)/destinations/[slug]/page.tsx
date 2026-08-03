import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  MapPin, Sun, Compass,
} from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { SectionHeading } from '@/components/v3/ui/SectionHeading';
import { Badge } from '@/components/v3/ui/Badge';
import { Card } from '@/components/v3/ui/Card';
import { Accordion } from '@/components/v3/ui/Accordion';
import { GradientButton } from '@/components/v3/ui/GradientButton';
import { ROUTES } from '@/lib/routes';
import { DESTINATIONS } from '@/lib/data/destinations';
import { TRENDING_TRIPS } from '@/lib/data/trips';

export const revalidate = 3600; // Enable ISR static caching

export async function generateStaticParams() {
  return DESTINATIONS.map((dest) => ({
    slug: dest.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = DESTINATIONS.find((d) => d.slug === slug);
  if (!dest) return { title: 'Destination Not Found | Friendli Tripz' };

  return {
    title: `${dest.name} Travel Guide | Friendli Tripz`,
    description: dest.description,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = DESTINATIONS.find((d) => d.slug === slug);

  if (!dest) {
    notFound();
  }

  const relatedTrips = TRENDING_TRIPS.filter(
    (t) =>
      t.location.toLowerCase().includes(dest.state.toLowerCase()) ||
      t.name.toLowerCase().includes(dest.name.toLowerCase())
  ).slice(0, 3);

  const destinationFAQs = [
    {
      id: 'dfaq-1',
      title: `What is the best time to visit ${dest.name}?`,
      content: `The best season to visit ${dest.name} is ${dest.bestSeason}. During this period, the weather is pleasant with temperatures ranging from ${dest.weather}, making it ideal for sightseeing and outdoor activities.`,
    },
    {
      id: 'dfaq-2',
      title: `How do I reach ${dest.name}?`,
      content: `${dest.name} is well-connected by road. Our group trips include comfortable AC transport from the departure city. We handle all logistics so you just need to show up at the meeting point.`,
    },
    {
      id: 'dfaq-3',
      title: `What should I pack for ${dest.name}?`,
      content: `Pack light layers, comfortable walking shoes, a light rain jacket, sunscreen, and a camera. We provide a detailed packing list after booking.`,
    },
    {
      id: 'dfaq-4',
      title: `Is ${dest.name} safe for solo travellers?`,
      content: `Absolutely! Over 60% of our travellers join solo. You'll be paired with same-gender room-mates and our trip leaders ensure everyone feels included from day one.`,
    },
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
          <div className="max-w-3xl space-y-4">
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
          </div>
        </Container>
      </section>

      {/* Story / About */}
      <section className="py-section-sm sm:py-section bg-white border-b border-surface-200/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3 space-y-6">
              <SectionHeading
                badge="About Destination"
                title={`Experience the Magic of ${dest.name}`}
              />
              <p className="text-body-lg text-surface-600 leading-relaxed">
                {dest.description}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Card variant="outline" padding="md" className="border border-surface-200">
                  <div className="text-caption text-surface-400 font-semibold uppercase tracking-wider">
                    Best Season
                  </div>
                  <div className="text-body-lg font-bold text-surface-900 mt-1">{dest.bestSeason}</div>
                </Card>
                <Card variant="outline" padding="md" className="border border-surface-200">
                  <div className="text-caption text-surface-400 font-semibold uppercase tracking-wider">
                    Average Temp
                  </div>
                  <div className="text-body-lg font-bold text-surface-900 mt-1">{dest.weather}</div>
                </Card>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="lg:col-span-2 space-y-4">
              <Card variant="outline" padding="lg" className="bg-surface-50 space-y-4">
                <h3 className="text-heading-sm font-heading font-bold text-surface-900">
                  Top Highlights
                </h3>
                <div className="space-y-2.5">
                  {dest.highlights.map((hl) => (
                    <div key={hl} className="flex items-center gap-3 text-body-sm text-surface-700">
                      <div className="w-2 h-2 rounded-full bg-brand-orange shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Things to Do */}
      <section className="py-section-sm sm:py-section bg-surface-50">
        <Container>
          <SectionHeading
            badge="Activities & Experiences"
            title={`Things to Do in ${dest.name}`}
            subtitle="Curated experiences included in our group trip itineraries."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {dest.thingsToDo.map((thing, idx) => (
              <Card key={thing} variant="interactive" padding="md" className="bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold font-mono text-sm shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-body-md font-bold text-surface-900">{thing}</h3>
                    <p className="text-caption text-surface-500 mt-1">
                      Guided activity with experienced local trip hosts.
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Related Packages */}
      {relatedTrips.length > 0 && (
        <section className="py-section-sm sm:py-section bg-white border-t border-surface-200/40">
          <Container>
            <SectionHeading
              badge="Active Trips"
              title={`Trips to ${dest.name}`}
              subtitle="Handcrafted itineraries with fixed departure dates and all-inclusive pricing."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {relatedTrips.map((trip) => (
                <Card key={trip.id} variant="interactive" padding="none" className="bg-white overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={trip.image}
                      alt={trip.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="text-body-md font-bold text-surface-900">{trip.name}</h3>
                    <div className="flex items-center justify-between text-caption text-surface-500 pt-2 border-t border-surface-100">
                      <span>{trip.duration}</span>
                      <span className="text-body-md font-extrabold text-brand-navy">{trip.price}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQs */}
      <section className="py-section-sm sm:py-section bg-surface-50">
        <Container className="max-w-3xl">
          <SectionHeading
            badge="Helpful Info"
            title="Frequently Asked Questions"
            subtitle={`Everything you need to know before visiting ${dest.name}.`}
          />
          <div className="mt-10">
            <Accordion items={destinationFAQs} />
          </div>
        </Container>
      </section>
    </main>
  );
}
