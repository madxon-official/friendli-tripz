import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ExperienceService } from '@/lib/services/experienceService';
import { ExperienceCard } from '@/components/public/ExperienceCard';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'Experiences | Friendli Tripz',
  description: 'Choose activities in Kodaikanal, Ooty, or Valparai.',
};

interface ExperiencesPageProps {
  searchParams?: Promise<{ destination?: string }>;
}

export default async function ExperiencesPage({ searchParams }: ExperiencesPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentDestSlug = resolvedSearchParams?.destination || 'all';
  const experiences = await ExperienceService.getExperiences(currentDestSlug);

  const destinationTabs = [
    { label: 'All Destinations', slug: 'all' },
    { label: 'Kodaikanal', slug: 'kodaikanal' },
    { label: 'Ooty', slug: 'ooty' },
    { label: 'Valparai', slug: 'valparai' },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-28 pb-20">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Destination-First Experiences</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Create Unforgettable Memories
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
            Choose experiences you'll remember forever across Kodaikanal, Ooty, and Valparai.
          </p>
        </div>

        {/* Destination Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {destinationTabs.map((tab) => {
            const isActive = currentDestSlug.toLowerCase() === tab.slug.toLowerCase();
            const href = tab.slug === 'all' ? ROUTES.EXPERIENCES : `${ROUTES.EXPERIENCES}?destination=${tab.slug}`;

            return (
              <Link
                key={tab.slug}
                href={href}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-brand-orange text-white border-brand-orange shadow-button'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Experiences Grid */}
        {experiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white">No experiences found for this destination</h3>
            <p className="text-sm text-slate-400 mt-1">Select another destination tab above.</p>
          </div>
        )}
      </Container>
    </div>
  );
}
