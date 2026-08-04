import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Zap,
  Users,
  MessageSquare,
  Clock
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';
import { DestinationService } from '@/lib/services/destinationService';
import { ExperienceService } from '@/lib/services/experienceService';
import { PackageService } from '@/lib/services/packageService';
import { resolveDestinationImage } from '@/lib/utils/imageResolver';
import { IMAGE_REGISTRY } from '@/lib/constants/imageRegistry';
import { DestinationCard } from '@/components/public/DestinationCard';
import { ExperienceCard } from '@/components/public/ExperienceCard';
import { PackageCard } from '@/components/public/PackageCard';

export const metadata = {
  title: 'Friendli Tripz | Destination-First Travel Platform',
  description: 'Explore Kodaikanal, Ooty, and Valparai with verified stays, experiences, and packages.',
};

const HOMEPAGE_TESTIMONIALS = [
  {
    id: 'test-1',
    author_name: 'Ananya & Squad',
    location: 'Bengaluru',
    avatar_url: IMAGE_REGISTRY.kodaikanal.hero,
    rating: 5,
    quote: 'The cliffside trek in Kodai was the absolute highlight of our year! No generic hotel packages, just raw vibes, bonfire acoustic tunes, and flawless coordination.',
    trip_type: 'Weekend Squad Getaway',
    destination: 'Kodaikanal',
  },
  {
    id: 'test-2',
    author_name: 'Karthik Raja',
    location: 'Chennai',
    avatar_url: IMAGE_REGISTRY.ooty.hero,
    rating: 5,
    quote: 'Being able to track our trip status in real-time with our Reference ID made us feel super confident. Our driver and guide were top tier.',
    trip_type: 'Family Nature Retreat',
    destination: 'Ooty',
  }
];

const HOMEPAGE_BLOGS = [
  {
    id: 'blog-1',
    title: '7 Hidden Offbeat Spots in Kodaikanal You Won’t Find on Google Maps',
    slug: 'hidden-spots-kodaikanal',
    category: 'Hidden Gems',
    excerpt: 'Escape the tourist crowds and discover secret pine glades, tranquil sheep farms, and cliffside cafes in Kodai.',
    cover_image: IMAGE_REGISTRY.kodaikanal.cover,
    read_time_minutes: 5,
  },
  {
    id: 'blog-2',
    title: 'Why Ooty Toy Train is a Must-Do Heritage Journey',
    slug: 'ooty-toy-train-guide',
    category: 'Heritage',
    excerpt: 'Everything you need to know about booking and riding the UNESCO Nilgiri Mountain Railway.',
    cover_image: IMAGE_REGISTRY.ooty.cover,
    read_time_minutes: 4,
  }
];

export default async function HomePage() {
  // Fetch live database records via Service Layer
  const destinations = await DestinationService.getExploreDestinations();
  const experiences = await ExperienceService.getExperiences();
  const packages = await PackageService.getPackages();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-brand-orange selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-navy/60 via-slate-950/80 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/15 blur-[140px] rounded-full pointer-events-none" />

        <Container className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand-orange/30 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-6 shadow-glow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Destination-First Travel Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Explore Kodaikanal, Ooty <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange via-orange-400 to-amber-300">& Valparai.</span>
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-slate-300 mb-10 max-w-2xl mx-auto">
            Stop Scrolling. Start Living.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href={ROUTES.DISCOVER}
              variant="primary"
              size="lg"
              icon={<Compass className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-button hover:shadow-button-hover"
            >
              Explore Destinations
            </Button>
            <Button
              href={ROUTES.PACKAGES}
              variant="outline"
              size="lg"
              icon={<ArrowRight className="w-5 h-5 text-brand-orange" />}
              className="w-full sm:w-auto border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
            >
              Browse Packages
            </Button>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. FEATURED DESTINATIONS (3) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 border-b border-slate-900">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <span className="text-brand-orange text-xs font-bold uppercase tracking-widest">Our Supported Destinations</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">Featured Destinations</h2>
            </div>
            <Link
              href={ROUTES.DISCOVER}
              className="text-sm font-semibold text-brand-orange hover:underline flex items-center gap-1 mt-4 md:mt-0"
            >
              View all destinations <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} experienceCount={4} />
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FEATURED EXPERIENCES */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 border-b border-slate-900 bg-slate-900/20">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <span className="text-brand-orange text-xs font-bold uppercase tracking-widest">Things To Do</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">Featured Experiences</h2>
            </div>
            <Link href={ROUTES.EXPERIENCES} className="text-sm font-semibold text-brand-orange hover:underline flex items-center gap-1 mt-4 md:mt-0">
              Browse all experiences <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. FEATURED PACKAGES */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 border-b border-slate-900">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <span className="text-brand-orange text-xs font-bold uppercase tracking-widest">Ready Trips</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">Featured Packages</h2>
            </div>
            <Link href={ROUTES.PACKAGES} className="text-sm font-semibold text-brand-orange hover:underline flex items-center gap-1 mt-4 md:mt-0">
              View all packages <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} packageData={pkg} />
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. WHY FRIENDLI TRIPZ */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 border-b border-slate-900 bg-slate-900/40">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest">Built Different</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">Why Friendli Tripz</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { title: 'Simple Process', desc: 'No complex log ins, no upfront forced bookings. Pure discovery.', icon: Zap },
              { title: 'Trusted Planning', desc: 'Curated by local trip captains in Kodai, Ooty & Valparai.', icon: ShieldCheck },
              { title: 'Personalized Plans', desc: 'Custom tailored itineraries built around your exact squad vibe.', icon: Sparkles },
              { title: 'Real Humans', desc: 'Dedicated trip manager assigned to coordinate your driver & stay.', icon: Users },
              { title: 'Realtime Tracking', desc: 'Track your enquiry and trip status live with a single Reference ID.', icon: Compass },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl text-center">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. TESTIMONIALS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 border-b border-slate-900">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest">Community Feedback</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">Traveler Testimonials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HOMEPAGE_TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
                <p className="text-sm text-slate-300 italic mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                    <Image src={resolveDestinationImage(t.avatar_url, t.destination.toLowerCase())} alt={t.author_name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.author_name}</h4>
                    <span className="text-xs text-slate-400">{t.trip_type} • {t.destination}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. BLOGS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 bg-slate-900/30 border-b border-slate-900">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <span className="text-brand-orange text-xs font-bold uppercase tracking-widest">Insider Guides</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">Travel Blogs & Stories</h2>
            </div>
            <Link href={ROUTES.BLOGS} className="text-sm font-semibold text-brand-orange hover:underline flex items-center gap-1 mt-4 md:mt-0">
              View all blogs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HOMEPAGE_BLOGS.map((b) => (
              <Link key={b.id} href={`/blogs/${b.slug}`} className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-5 flex flex-col sm:flex-row gap-5 hover:border-slate-700 transition-all">
                <div className="relative w-full sm:w-48 h-40 rounded-2xl overflow-hidden shrink-0 bg-slate-950">
                  <Image src={resolveDestinationImage(b.cover_image, 'kodaikanal')} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">{b.category}</span>
                    <h3 className="text-base font-bold text-white group-hover:text-brand-orange transition-colors mt-1 line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{b.excerpt}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-4 flex items-center gap-1"><Clock className="w-3 h-3 text-brand-orange" /> {b.read_time_minutes} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. CTA SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-t from-slate-900 to-slate-950">
        <Container className="text-center max-w-3xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Stop Scrolling & Start Living?
          </h2>
          <p className="text-slate-300 text-lg mb-10">
            Choose Kodaikanal, Ooty, or Valparai. No accounts, no password headaches — just instant human travel planning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={ROUTES.PLANNER} variant="primary" size="lg" icon={<Sparkles className="w-5 h-5" />}>
              Start Planning
            </Button>
            <Button href={ROUTES.ENQUIRE} variant="outline" size="lg" icon={<MessageSquare className="w-5 h-5 text-brand-orange" />} className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
              Submit Enquiry
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
