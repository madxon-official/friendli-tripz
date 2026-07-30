import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MapPin, Clock, Star, ShieldCheck, CheckCircle2, XCircle, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { ItineraryTimeline } from '@/components/public/ItineraryTimeline';
import { AvailableDepartures } from '@/components/public/AvailableDepartures';
import { AIExplainBadge } from '@/components/public/AIExplainBadge';
import { WishlistButton } from '@/components/public/WishlistButton';
import { SEOStructuredData } from '@/components/public/SEOStructuredData';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ').toUpperCase()} | Friendli Tripz`,
    description: `Book signature ${slug.replace(/-/g, ' ')} holiday package with verified hilltop stays, private transport, and boating vouchers.`,
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: family } = await supabase
    .from('package_families')
    .select(`
      id,
      name,
      family_slug,
      description,
      destinations (
        id,
        name,
        slug,
        hero_banner_url,
        travel_difficulty
      ),
      package_releases (
        id,
        version_tag,
        title,
        duration_days,
        duration_nights,
 base_pricing_tree_json,
        commercial_terms_text,
        status
      )
    `)
    .eq('family_slug', slug)
    .maybeSingle();

  const release = family?.package_releases?.find((r: any) => r.status === 'active') || family?.package_releases?.[0];

  // Fetch real package instance if available
  const { data: realInstance } = release?.id
    ? await supabase
        .from('package_instances')
        .select('id, title, custom_pricing_tree_json')
        .eq('release_id', release.id)
        .limit(1)
        .maybeSingle()
    : { data: null };

  // Fetch real itinerary days and segments if available
  const { data: dbItineraryDays } = release?.id
    ? await supabase
        .from('itinerary_days')
        .select(`
          id,
          day_number,
          theme_title,
          description,
          itinerary_day_segments (
            id,
            sequence_order,
            segment_type,
            planned_start_time,
            planned_end_time,
            duration_mins,
            segment_title,
            cost_override,
            is_included_in_package
          )
        `)
        .eq('release_id', release.id)
        .order('day_number', { ascending: true })
    : { data: null };

  const title = release?.title || family?.name || '4-Day Signature Escape';
  const durationDays = release?.duration_days || 4;
  const durationNights = release?.duration_nights || 3;
  const pricing = release?.base_pricing_tree_json || {};
  const startingPrice = pricing.base_adult_price || 14500;

  const destObj = Array.isArray(family?.destinations) ? family?.destinations[0] : (family?.destinations as any);
  const destName = destObj?.name || 'Hill Station';
  const heroUrl = destObj?.hero_banner_url || 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0';
  const instanceId = realInstance?.id || release?.id || family?.id || '44444444-4444-4444-4444-444444444401';

  const mappedItinerary = dbItineraryDays && dbItineraryDays.length > 0
    ? dbItineraryDays.map((d: any) => ({
        dayNumber: d.day_number,
        title: d.theme_title || `Day ${d.day_number}: Exploration`,
        description: d.description || `Sightseeing & activity schedule for day ${d.day_number}.`,
        segments: (d.itinerary_day_segments || [])
          .sort((a: any, b: any) => a.sequence_order - b.sequence_order)
          .map((s: any) => ({
            sequenceOrder: s.sequence_order,
            type: (s.segment_type === 'lodging' || s.segment_type === 'activity' ? s.segment_type : 'attraction') as 'lodging' | 'attraction' | 'activity',
            title: s.segment_title,
            startTime: s.planned_start_time || '09:00',
            endTime: s.planned_end_time || '10:30',
            durationMins: s.duration_mins || 90,
            cost: Number(s.cost_override || 0),
            isIncluded: s.is_included_in_package ?? true,
          })),
      }))
    : [
        {
          dayNumber: 1,
          title: `Arrival & ${destName} Sightseeing`,
          description: `Check-in, refreshment drink, and evening promenade stroll in ${destName}.`,
          segments: [
            { sequenceOrder: 1, type: 'lodging' as const, title: 'Resort Check-In & Welcome', startTime: '12:00', endTime: '13:00', durationMins: 60, cost: 0, isIncluded: true },
            { sequenceOrder: 2, type: 'attraction' as const, title: `${destName} Viewpoint Walk`, startTime: '15:00', endTime: '17:00', durationMins: 120, cost: 0, isIncluded: true },
            { sequenceOrder: 3, type: 'activity' as const, title: 'Signature Sightseeing Experience', startTime: '17:15', endTime: '18:00', durationMins: 45, cost: 350, isIncluded: true }
          ]
        },
        {
          dayNumber: 2,
          title: 'Forest Trails & Cliff Viewpoint Exploration',
          description: `Dedicated sightseeing covering local nature trails and scenic cliffs.`,
          segments: [
            { sequenceOrder: 1, type: 'attraction' as const, title: 'Pine Forest & Nature Trail', startTime: '09:30', endTime: '11:00', durationMins: 90, cost: 50, isIncluded: true },
            { sequenceOrder: 2, type: 'attraction' as const, title: 'Valley Cliff Viewpoint', startTime: '11:30', endTime: '13:00', durationMins: 90, cost: 100, isIncluded: true }
          ]
        }
      ];

  const sampleExplanations = [
    { reasoningType: 'budget_match' as const, explanationText: 'Optimized commercial pricing tree for 3-star MAP hilltop hotel inclusions.', confidenceScore: 0.98 },
    { reasoningType: 'timing_optimization' as const, explanationText: 'Sequenced sightseeing activities during golden hour for maximum experience.', confidenceScore: 0.95 }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: title,
    description: family?.description || 'Signature hill station package.',
    offers: {
      '@type': 'Offer',
      price: startingPrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <SEOStructuredData data={jsonLd} />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Gallery Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {destName}
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {durationDays} Days / {durationNights} Nights
                </span>
                <AIExplainBadge explanations={sampleExplanations} />
              </div>
              <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <WishlistButton packageFamilyId={family?.id || '11111111-1111-1111-1111-111111111101'} />
              <Link
                href={`/customize/${instanceId}`}
                className="px-5 py-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 text-slate-900 hover:text-amber-600 font-bold text-xs transition-all shadow-sm flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                Customize Trip
              </Link>
              <Link
                href={`/checkout/${instanceId}`}
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-2"
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Banner */}
          <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-sm">
            <Image src={heroUrl} alt={title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 text-white space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-xs font-bold">4.9 / 5.0 Rating (38 verified reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Itinerary Timeline */}
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                Interactive Trip Itinerary
              </h2>
              <ItineraryTimeline itinerary={mappedItinerary} />
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-slate-900 text-base">Inclusions & Exclusions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Included</span>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      3 Nights accommodation in 3-Star MAP Hilltop Resort
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Private Dedicated SUV for all sightseeing & transfers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Pre-issued Kodai Lake boating vouchers
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">Excluded</span>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      Personal expenses & optional camera fees
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      Airfare / Inter-state train tickets to pickup point
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Pricing Summary Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500">Starting Commercial Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ₹{startingPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500">/ adult</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lock trip with only <strong>25% deposit</strong> today!</span>
              </div>

              <div className="space-y-2">
                <Link
                  href={`/checkout/${instanceId}`}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  Book This Package
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/customize/${instanceId}`}
                  className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors border border-slate-200 flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  Customize Stays & Activities
                </Link>
              </div>
            </div>

            {/* Available Fixed Departures */}
            <AvailableDepartures packageInstanceId={instanceId} />
          </div>
        </div>
      </div>
    </main>
  );
}
