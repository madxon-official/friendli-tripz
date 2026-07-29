import React from 'react';
import { notFound, redirect, RedirectType } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  Clock,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { getActivityBySlug } from '@/lib/actions/activity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { activity } = await getActivityBySlug(resolvedParams.slug);

  if (!activity) {
    return { title: 'Activity Not Found | Friendli Tripz' };
  }

  return {
    title: activity.meta_title || `${activity.name} Activity Guide | Friendli Tripz`,
    description:
      activity.meta_description ||
      activity.short_description ||
      `Explore ${activity.name} experiences across South India travel destinations.`,
    alternates: {
      canonical: `/activities/${activity.slug}`,
    },
  };
}

export default async function StandaloneMasterActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { activity, redirectedSlug } = await getActivityBySlug(resolvedParams.slug);

  if (redirectedSlug) {
    redirect(redirectedSlug, RedirectType.replace);
  }

  if (!activity) {
    notFound();
  }

  const heroImage = activity.hero_image_url || '/images/kodaikanal/kodaikanal-lake.webp';

  return (
    <article className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[380px] w-full bg-slate-950 overflow-hidden flex items-end">
        <Image src={heroImage} alt={activity.name} fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-mono font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>{activity.category?.name || 'Master Activity'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-white">
            {activity.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl">
            {activity.short_description || 'Explore operational venues and activity offerings.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="prose prose-slate max-w-none text-slate-700">
              <h2 className="text-2xl font-heading font-black text-slate-900">About {activity.name}</h2>
              <p>{activity.full_description || activity.short_description}</p>
            </div>

            {/* Offerings by Venue */}
            {activity.offerings && activity.offerings.length > 0 && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <h3 className="text-xl font-heading font-bold text-slate-900">
                  Where you can experience {activity.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activity.offerings.map((offering: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                      <div className="text-xs font-mono font-bold text-brand-orange">
                        {offering.attraction?.destination?.name || 'Destination Venue'}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{offering.title}</h4>
                      {offering.attraction && (
                        <div className="text-xs text-slate-500 font-medium">
                          Venue: {offering.attraction.name}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-mono">
                        <span>Duration: {offering.duration_mins} mins</span>
                        <span className="font-bold text-emerald-600">
                          {offering.pricing_rules?.[0]
                            ? `₹${offering.pricing_rules[0].base_price}`
                            : 'Standard'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
              <h3 className="font-heading font-bold text-slate-900 text-base">Activity Guidelines</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Fitness Level:</span>
                  <span className="font-bold capitalize">{activity.fitness_level}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Age Suitability:</span>
                  <span className="font-bold capitalize">{activity.age_suitability}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Weather Dependent:</span>
                  <span className="font-bold">{activity.weather_dependent ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </article>
  );
}
