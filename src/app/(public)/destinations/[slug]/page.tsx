import React from 'react';
import { notFound, redirect, RedirectType } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Clock,
  Globe,
  Sparkles,
  Phone,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Plane,
  Train,
  Bus,
  Utensils,
  ShoppingBag,
  AlertTriangle,
  Heart,
  Mountain,
  Compass,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { getDestinationBySlug, incrementDestinationViewCount } from '@/lib/actions/destination';
import {
  DestinationHighlight,
  DestinationGallery,
  DestinationEmergencyContact,
  DestinationFAQ,
} from '@/lib/types/destination';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { destination } = await getDestinationBySlug(resolvedParams.slug);

  if (!destination) {
    return { title: 'Destination Not Found | Friendli Tripz' };
  }

  return {
    title: destination.meta_title || `${destination.name} Travel Guide | Friendli Tripz`,
    description:
      destination.meta_description ||
      destination.short_description ||
      `Explore ${destination.name} travel details and curated trips with Friendli Tripz.`,
    keywords: destination.meta_keywords || [destination.name, 'Friendli Tripz', 'Travel'],
  };
}

export default async function PublicDestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const requestedSlug = resolvedParams.slug;

  const { destination, redirectedSlug } = await getDestinationBySlug(requestedSlug);

  // SEO 301 Permanent Redirect handling if old slug accessed
  if (redirectedSlug) {
    redirect(`/destinations/${redirectedSlug}`, RedirectType.replace);
  }

  if (!destination) {
    notFound();
  }

  // Increment view count asynchronously
  incrementDestinationViewCount(requestedSlug);

  const heroImage =
    destination.hero_banner_url ||
    destination.featured_image_url ||
    '/images/kodaikanal/kodaikanal-hero.webp';

  const isComingSoon = destination.status === 'coming_soon';

  return (
    <article className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      {/* Hero Banner Header */}
      <section className="relative h-[65vh] min-h-[480px] w-full bg-slate-950 overflow-hidden flex items-end">
        <Image src={heroImage} alt={destination.name} fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-orange text-white uppercase tracking-wider shadow-sm">
              {destination.category?.name || 'Hill Station'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
              {destination.state?.name}, {destination.country?.name}
            </span>
            {isComingSoon && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-600 text-white uppercase">
                Coming Soon
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-white leading-tight">
            {destination.name}
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 font-medium max-w-3xl leading-relaxed">
            {destination.short_description ||
              'Misty roads, mountain views and a trip worth remembering with good company.'}
          </p>
        </div>
      </section>

      {/* Quick Facts Ribbon Bar */}
      <section className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs font-mono font-semibold text-slate-700">
            {destination.ideal_duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-orange shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Duration</span>
                  <span>{destination.ideal_duration}</span>
                </div>
              </div>
            )}

            {destination.best_season && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-orange shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Best Season</span>
                  <span>{destination.best_season}</span>
                </div>
              </div>
            )}

            {destination.climate && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-orange shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Climate</span>
                  <span>{destination.climate}</span>
                </div>
              </div>
            )}

            {destination.travel_difficulty && (
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-brand-orange shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Difficulty</span>
                  <span className="capitalize">{destination.travel_difficulty}</span>
                </div>
              </div>
            )}

            {destination.elevation && (
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-orange shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Elevation</span>
                  <span>{destination.elevation}</span>
                </div>
              </div>
            )}

            {destination.average_budget_per_day && (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Avg Budget</span>
                  <span>{destination.average_budget_per_day}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Body Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Overview & Description */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-brand-orange" />
              <span>About {destination.name}</span>
            </h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base">
              <p>
                {destination.long_description ||
                  `${destination.name} is a serene escape located in ${destination.state?.name}. Known for its lush landscapes, refreshing mountain breezes, and peaceful atmosphere, it offers an ideal getaway for travelers looking to slow down and enjoy the journey.`}
              </p>
            </div>

            {/* Repeatable Highlight Cards */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <h3 className="text-xl font-heading font-bold text-slate-900">Destination Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.highlights.map((h: DestinationHighlight, idx: number) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4"
                    >
                      <div className="p-3 rounded-xl bg-orange-50 text-brand-orange shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{h.title}</h4>
                        {h.description && (
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{h.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA Widget */}
          <div className="space-y-6">
            <div className="bg-brand-navy text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl pointer-events-none" />
              <div>
                <span className="text-xs font-mono font-bold text-brand-orange uppercase tracking-wider block">
                  FRIENDLI TRIP EXPERIENCE
                </span>
                <h3 className="text-2xl font-heading font-black text-white mt-1">
                  Want to visit {destination.name}?
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  We handle the accommodation, local transport, and curated itinerary details so you can simply show up with good company.
                </p>
              </div>

              <Link
                href={`/customize?destination=${destination.slug}`}
                className="w-full py-3.5 px-6 rounded-2xl bg-brand-orange text-white font-bold text-sm flex items-center justify-center gap-2 shadow-button hover:bg-orange-600 transition-colors"
              >
                <span>Customize This Trip</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 space-y-2 font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Curated local experiences</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Friendli operational support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery Grid */}
        {destination.gallery && destination.gallery.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight">
              Photo Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {destination.gallery.map((img: DestinationGallery, idx: number) => (
                <div
                  key={idx}
                  className="group relative h-48 rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-sm"
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-semibold">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rich SEO Guides (Food, Shopping, Travel Tips, Things to Avoid) */}
        {(destination.food_guide || destination.shopping_guide || destination.travel_tips || destination.things_to_avoid) && (
          <section className="space-y-6 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight">
              Local Travel Guide & Essentials
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destination.food_guide && (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-brand-orange font-bold text-sm">
                    <Utensils className="w-4 h-4" />
                    <span>Food & Local Cuisine</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{destination.food_guide}</p>
                </div>
              )}

              {destination.shopping_guide && (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-brand-orange font-bold text-sm">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shopping & Souvenirs</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{destination.shopping_guide}</p>
                </div>
              )}

              {destination.travel_tips && (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Traveler Recommendations</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{destination.travel_tips}</p>
                </div>
              )}

              {destination.things_to_avoid && (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Things to Keep in Mind</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{destination.things_to_avoid}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Travel Logistics & Transportation */}
        <section className="space-y-6 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight">
            How to Reach & Local Logistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destination.nearest_airport && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Plane className="w-4 h-4" />
                  <span>Nearest Airport</span>
                </div>
                <p className="text-xs text-slate-700 font-semibold">{destination.nearest_airport}</p>
              </div>
            )}

            {destination.nearest_railway_station && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Train className="w-4 h-4" />
                  <span>Nearest Railway Station</span>
                </div>
                <p className="text-xs text-slate-700 font-semibold">{destination.nearest_railway_station}</p>
              </div>
            )}

            {destination.nearest_bus_stand && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Bus className="w-4 h-4" />
                  <span>Nearest Bus Stand</span>
                </div>
                <p className="text-xs text-slate-700 font-semibold">{destination.nearest_bus_stand}</p>
              </div>
            )}
          </div>
        </section>

        {/* Emergency Contacts */}
        {destination.emergency_contacts && destination.emergency_contacts.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Phone className="w-5 h-5 text-brand-orange" />
              <span>Local Emergency Contacts</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {destination.emergency_contacts.map((c: DestinationEmergencyContact, idx: number) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {c.service_type}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                  <div className="text-xs font-mono font-bold text-brand-orange">{c.phone_number}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Frequently Asked Questions */}
        {destination.faqs && destination.faqs.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-orange" />
              <span>Frequently Asked Questions</span>
            </h2>

            <div className="space-y-4 max-w-3xl">
              {destination.faqs.map((faq: DestinationFAQ, idx: number) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">{faq.question}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Placeholders for Future Expansion Modules */}
        <section className="p-8 rounded-3xl bg-slate-100 border border-slate-200 space-y-4">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            FUTURE MODULE PLACEHOLDERS
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-600">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-2 opacity-60">
              <Mountain className="w-4 h-4 text-slate-400" />
              <span>Top Attractions (Soon)</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-2 opacity-60">
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Things To Do (Soon)</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-2 opacity-60">
              <Package className="w-4 h-4 text-slate-400" />
              <span>Package Templates (Soon)</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-2 opacity-60">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Departures (Soon)</span>
            </div>
          </div>
        </section>
      </main>
    </article>
  );
}
