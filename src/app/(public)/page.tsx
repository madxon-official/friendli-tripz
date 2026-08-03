import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/v3/home/HeroSection';
import { FindYourVibeSection } from '@/components/v3/home/FindYourVibeSection';
import { TrendingTripsSection } from '@/components/v3/home/TrendingTripsSection';
import { WhyFriendliSection } from '@/components/v3/home/WhyFriendliSection';
import { UpcomingTripsSection } from '@/components/v3/home/UpcomingTripsSection';
import { GallerySection } from '@/components/v3/home/GallerySection';
import { StoriesSection } from '@/components/v3/home/StoriesSection';
import { HowItWorksSection } from '@/components/v3/home/HowItWorksSection';
import { FAQSection } from '@/components/v3/home/FAQSection';
import { CTASection } from '@/components/v3/home/CTASection';
import { MobileStickyCTA } from '@/components/v3/home/MobileStickyCTA';
import { SectionSkeleton } from '@/components/v3/home/SectionSkeletons';

export const metadata: Metadata = {
  title: 'Friendli Tripz | Travel. Vibe. Repeat.',
  description:
    'Discover curated group trips, handpicked stays, and unforgettable experiences across South India.',
};

export const revalidate = 3600; // Enable ISR static caching

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* 1. Immersive Hero (Immediate SSR Render) */}
      <HeroSection />

      {/* 2. Find Your Vibe */}
      <Suspense fallback={<SectionSkeleton title="Find Your Vibe" />}>
        <FindYourVibeSection />
      </Suspense>

      {/* 3. Trending Escapes */}
      <Suspense fallback={<SectionSkeleton title="Trending Escapes" />}>
        <TrendingTripsSection />
      </Suspense>

      {/* 4. Why Travel Friendli? (Immediate Server Render) */}
      <WhyFriendliSection />

      {/* 5. Upcoming Departures */}
      <Suspense fallback={<SectionSkeleton title="Upcoming Departures" />}>
        <UpcomingTripsSection />
      </Suspense>

      {/* 6. Captured on Friendli — Photo Gallery */}
      <Suspense fallback={<SectionSkeleton title="Photo Gallery" />}>
        <GallerySection />
      </Suspense>

      {/* 7. Traveller Stories */}
      <Suspense fallback={<SectionSkeleton title="Traveller Stories" />}>
        <StoriesSection />
      </Suspense>

      {/* 8. How It Works */}
      <HowItWorksSection />

      {/* 9. FAQs */}
      <FAQSection />

      {/* 10. Final CTA */}
      <CTASection />

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA />
    </main>
  );
}
