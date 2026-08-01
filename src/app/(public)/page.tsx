'use client';

import React from 'react';
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

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* 1. Immersive Hero */}
      <HeroSection />

      {/* 2. Find Your Vibe */}
      <FindYourVibeSection />

      {/* 3. Trending Escapes */}
      <TrendingTripsSection />

      {/* 4. Why Travel Friendli? */}
      <WhyFriendliSection />

      {/* 5. Upcoming Departures */}
      <UpcomingTripsSection />

      {/* 6. Captured on Friendli — Photo Gallery */}
      <GallerySection />

      {/* 7. Traveller Stories */}
      <StoriesSection />

      {/* 8. How It Works */}
      <HowItWorksSection />

      {/* 9. FAQ */}
      <FAQSection />

      {/* 10. Final CTA */}
      <CTASection />

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCTA />
    </main>
  );
}
