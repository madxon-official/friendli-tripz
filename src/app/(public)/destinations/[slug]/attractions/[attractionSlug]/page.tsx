import React from 'react';
import { notFound, redirect, RedirectType } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Compass,
  Phone,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { getAttractionBySlug } from '@/lib/actions/attraction';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; attractionSlug: string }>;
}) {
  const resolvedParams = await params;
  const { attraction } = await getAttractionBySlug(resolvedParams.slug, resolvedParams.attractionSlug);

  if (!attraction) {
    return { title: 'Attraction Not Found | Friendli Tripz' };
  }

  return {
    title: attraction.meta_title || `${attraction.name} (${attraction.destination?.name}) | Friendli Tripz`,
    description:
      attraction.meta_description ||
      attraction.short_tagline ||
      `Explore ${attraction.name} in ${attraction.destination?.name}. Read operating hours, entry fees, and travel details.`,
    alternates: {
      canonical: `/destinations/${resolvedParams.slug}/attractions/${attraction.slug}`,
    },
  };
}

export default async function CanonicalAttractionDetailPage({
  params,
}: {
  params: Promise<{ slug: string; attractionSlug: string }>;
}) {
  const resolvedParams = await params;
  const { slug: destSlug, attractionSlug } = resolvedParams;

  const { attraction, redirectedSlug } = await getAttractionBySlug(destSlug, attractionSlug);

  if (redirectedSlug) {
    redirect(redirectedSlug, RedirectType.replace);
  }

  if (!attraction) {
    notFound();
  }

  const heroImage =
    attraction.hero_banner_url ||
    attraction.featured_image_url ||
    '/images/kodaikanal/kodaikanal-lake.webp';

  // Generate Schema.org JSON-LD TouristAttraction Markup
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: attraction.name,
    description: attraction.short_tagline || attraction.description,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: attraction.latitude,
      longitude: attraction.longitude,
    },
    isAccessibleForFree: attraction.entry_fee_type === 'free',
  };

  return (
    <article className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Banner Header */}
      <section className="relative h-[55vh] min-h-[420px] w-full bg-slate-950 overflow-hidden flex items-end">
        <Image src={heroImage} alt={attraction.name} fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
            <Link
              href={`/destinations/${attraction.destination?.slug}`}
              className="px-3 py-1 rounded-full bg-brand-orange text-white hover:bg-orange-600 transition-colors uppercase tracking-wider"
            >
              {attraction.destination?.name}
            </Link>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
              {attraction.category?.name}
            </span>
            {attraction.zone && (
              <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                {attraction.zone.name}
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-white leading-tight">
            {attraction.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl">
            {attraction.short_tagline || 'Explore coordinates, opening schedules, and available activities.'}
          </p>
        </div>
      </section>

      {/* Quick Attributes Ribbon */}
      <section className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20 text-xs font-mono font-semibold text-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange" />
              <span>Suggested Visit: {attraction.suggested_duration_mins || 90} mins</span>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              <span>Entry: {attraction.entry_fee_type === 'free' ? 'Free' : `₹${attraction.adult_entry_fee}`}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>
                {attraction.latitude}, {attraction.longitude}
              </span>
            </div>
          </div>

          <Link
            href={`/customize?destination=${attraction.destination?.slug}`}
            className="px-4 py-2 bg-brand-orange text-white rounded-xl font-bold shadow-button hover:bg-orange-600 transition-colors"
          >
            Add to Custom Trip
          </Link>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
              <h2 className="text-2xl font-heading font-black text-slate-900">Overview</h2>
              <p>{attraction.description || `${attraction.name} is a major highlight in ${attraction.destination?.name}.`}</p>
            </div>

            {/* Bound Activities */}
            {attraction.offerings && attraction.offerings.length > 0 && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <h3 className="text-xl font-heading font-bold text-slate-900">Available Activities & Offerings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attraction.offerings.map((offering: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                      <div className="text-xs font-mono font-bold text-brand-orange uppercase">
                        {offering.master_activity?.name || 'Activity Offering'}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{offering.title}</h4>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-mono">
                        <span>Duration: {offering.duration_mins} mins</span>
                        <span className="font-bold text-emerald-600">
                          {offering.pricing_rules?.[0]
                            ? `₹${offering.pricing_rules[0].base_price}`
                            : 'Included'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-slate-900 text-base">Amenities & Rules</h3>
              <div className="space-y-2 text-xs font-semibold text-slate-700 font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${attraction.wheelchair_accessible ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>Wheelchair Accessible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${attraction.parking_available ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>Parking Onsite</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${attraction.restrooms_available ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>Restrooms Onsite</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${attraction.pet_allowed ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>Pet Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </article>
  );
}
