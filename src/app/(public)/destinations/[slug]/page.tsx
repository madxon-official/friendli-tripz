import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Compass, Navigation, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { DestinationService } from '@/lib/services/destinationService';
import { resolveDestinationImage, formatINR } from '@/lib/utils/imageResolver';
import { ROUTES } from '@/lib/routes';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SUPPORTED_SLUGS = ['kodaikanal', 'ooty', 'valparai'];

export async function generateStaticParams() {
  return SUPPORTED_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!SUPPORTED_SLUGS.includes(slug.toLowerCase())) {
    return { title: 'Destination Not Found | Friendli Tripz' };
  }

  const data = await DestinationService.getDestinationBySlug(slug);
  if (!data) return { title: 'Destination Not Found | Friendli Tripz' };

  return {
    title: `${data.destination.name} Travel Guide & Packages | Friendli Tripz`,
    description: data.destination.overview,
  };
}

export default async function DestinationDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const normSlug = slug.toLowerCase();

  // Enforce HTTP 404 for unsupported destination routes (e.g. /destinations/coorg)
  if (!SUPPORTED_SLUGS.includes(normSlug)) {
    notFound();
  }

  const data = await DestinationService.getDestinationBySlug(normSlug);

  if (!data) {
    notFound();
  }

  const { destination, attractions, experiences, packages } = data;
  const heroImage = resolveDestinationImage(destination.gallery?.find((g) => g.image_type === 'hero')?.image, destination.slug);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-28 pb-24">
      {/* Compact Hero Section */}
      <section className="relative h-[42vh] min-h-[360px] w-full overflow-hidden bg-slate-950">
        <Image src={heroImage} alt={destination.name} fill className="object-cover brightness-75" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <Container className="relative z-10 h-full flex flex-col justify-end pb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3 w-fit">
            <Compass className="w-3.5 h-3.5" />
            <span>{destination.tagline}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">{destination.name}</h1>
          <p className="text-base sm:text-lg font-medium text-slate-200 mt-2 max-w-2xl">
            Everything you need to know before your trip.
          </p>
        </Container>
      </section>

      <Container className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview & Why Visit */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-elevated">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Compass className="w-4 h-4 text-brand-orange" /> Destination Overview
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">{destination.overview}</p>
              {destination.why_visit && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
                  <strong className="text-brand-orange block mb-1">Why Visit {destination.name}:</strong>
                  <span>{destination.why_visit}</span>
                </div>
              )}
            </div>

            {/* Travel Routes Table */}
            {destination.routes && destination.routes.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-elevated">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Navigation className="w-4 h-4 text-brand-orange" /> How To Reach {destination.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {destination.routes.map((route) => (
                    <div key={route.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                      <span className="text-xs font-bold text-white block">{route.origin_city}</span>
                      <span className="text-sm font-mono font-extrabold text-brand-orange block">{route.duration}</span>
                      <span className="text-[11px] text-slate-400 block">{route.distance} ({route.travel_mode})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attractions List */}
            {attractions && attractions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-white">Top Attractions & Spots</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attractions.map((attr) => (
                    <div key={attr.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
                          {attr.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-brand-orange">
                          {attr.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{attr.description}</p>
                      <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                        <span>Duration: {attr.duration}</span>
                        {attr.best_time && <span>Best: {attr.best_time}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Experiences */}
            {experiences && experiences.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-white">Recommended Experiences</h2>
                  <Link href={`${ROUTES.EXPERIENCES}?destination=${destination.slug}`} className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
                    See All ({experiences.length}) <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {experiences.map((exp) => {
                    const expImg = resolveDestinationImage(exp.image, destination.slug);

                    return (
                      <div key={exp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-950">
                          <Image src={expImg} alt={exp.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-extrabold text-white">{exp.title}</h3>
                            <span className="text-[10px] text-slate-400">{exp.duration} • {exp.difficulty}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-brand-orange">{formatINR(exp.starting_price)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA Card (Right col) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-elevated space-y-6">
              <div>
                <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 tracking-wider block">Starting Rate</span>
                <span className="text-3xl font-extrabold text-white">{formatINR(destination.starting_price)}</span>
                <span className="text-xs text-slate-400 block mt-0.5">/ person estimated starting rate</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Best Season</span>
                  <span className="font-semibold text-brand-orange">{destination.best_season}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Elevation</span>
                  <span className="font-semibold">{destination.elevation}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">District</span>
                  <span className="font-semibold">{destination.district}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <Button
                  href={`${ROUTES.PACKAGES}?destination=${destination.slug}`}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center shadow-button"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  View Packages ({packages.length})
                </Button>

                <Link
                  href={`${ROUTES.EXPERIENCES}?destination=${destination.slug}`}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 hover:text-white font-extrabold text-xs text-center block transition-colors"
                >
                  See Experiences ({experiences.length})
                </Link>

                <Button
                  href={`${ROUTES.ENQUIRE}?destination=${encodeURIComponent(destination.name)}`}
                  variant="outline"
                  size="lg"
                  className="w-full justify-center border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                  icon={<MessageSquare className="w-4 h-4 text-brand-orange" />}
                >
                  Enquire Directly
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
