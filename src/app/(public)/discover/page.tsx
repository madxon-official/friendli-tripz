import React from 'react';
import { Compass } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { DestinationService } from '@/lib/services/destinationService';
import { DestinationCard } from '@/components/public/DestinationCard';

export const metadata = {
  title: 'Explore Destinations | Friendli Tripz',
  description: 'Choose where your next journey begins: Kodaikanal, Ooty, or Valparai.',
};

export default async function DiscoverPage() {
  const destinations = await DestinationService.getExploreDestinations();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-28 pb-20">
      <Container>
        {/* Compact Hero Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Find Your Vibe</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Choose where your next journey begins.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
            We exclusively operate in South India's top 3 mountain hill escapes. Every destination is pre-audited with verified stays and local guides.
          </p>
        </div>

        {/* 3 Destination Cards Grid (Kodaikanal, Ooty, Valparai) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} experienceCount={4} />
          ))}
        </div>
      </Container>
    </div>
  );
}
