import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, CheckCircle2, MapPin, MessageSquare } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PackageService } from '@/lib/services/packageService';
import { resolveDestinationImage, formatINR } from '@/lib/utils/imageResolver';
import { ROUTES } from '@/lib/routes';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await PackageService.getPackageBySlug(slug);
  if (!pkg) return { title: 'Package Not Found | Friendli Tripz' };

  return {
    title: `${pkg.name} | Friendli Tripz`,
    description: pkg.overview,
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await PackageService.getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const heroImage = resolveDestinationImage(pkg.hero_image, pkg.destination?.slug || 'kodaikanal');

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-28 pb-24">
      {/* Hero Header */}
      <section className="relative h-[55vh] min-h-[400px] w-full overflow-hidden bg-slate-950">
        <Image src={heroImage} alt={pkg.name} fill className="object-cover brightness-75" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <Container className="relative z-10 h-full flex flex-col justify-end pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3 w-fit">
            <Clock className="w-3.5 h-3.5" />
            <span>{pkg.duration}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">{pkg.name}</h1>
          <p className="text-base text-slate-300 mt-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-orange" /> {pkg.destination?.name || 'Hill Station'}
          </p>
        </Container>
      </section>

      <Container className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Package Overview</h2>
              <p className="text-slate-300 text-base leading-relaxed">{pkg.overview}</p>
            </div>

            {/* Day by Day Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Detailed Itinerary</h2>
                <div className="space-y-6">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      <span className="text-xs font-extrabold text-brand-orange uppercase block mb-1">Day {day.day}</span>
                      <h3 className="text-lg font-bold text-white mb-2">{day.title}</h3>
                      <div className="space-y-1">
                        {day.activities.map((act, i) => (
                          <p key={i} className="text-xs text-slate-300 leading-relaxed">• {act}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions */}
            {pkg.includes && pkg.includes.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> What’s Included
                </h3>
                <ul className="space-y-2.5">
                  {pkg.includes.map((inc, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar CTA Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-elevated space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Estimated Price</span>
                <span className="text-3xl font-extrabold text-white">{formatINR(pkg.starting_price)}</span>
                <span className="text-xs text-slate-400 block mt-0.5">/ person estimated starting rate</span>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <Button
                  href={`${ROUTES.ENQUIRE}?package=${encodeURIComponent(pkg.name)}`}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center shadow-button"
                  icon={<MessageSquare className="w-4 h-4" />}
                >
                  Enquire This Package
                </Button>
                <p className="text-[11px] text-slate-500 text-center">
                  No advance payment needed. Get full price quote and itinerary customizations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
