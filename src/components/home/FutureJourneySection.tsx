import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export const FutureJourneySection: React.FC = () => {
  return (
    <Section variant="dark-navy" className="relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-orange font-bold text-xs sm:text-sm tracking-wider uppercase border border-white/10">
          <Sparkles className="w-4 h-4" />
          <span>Our Vision</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading text-balance">
          Kodaikanal is just the beginning.
        </h2>

        <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto text-balance">
          We&apos;re starting with one destination and doing it properly. More Friendli adventures will follow as our community grows.
        </p>

        <div className="pt-4 inline-flex items-center gap-3 text-slate-400 text-xs sm:text-sm bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
          <Compass className="w-5 h-5 text-brand-orange" />
          <span>Quality over quantity. One unforgettable hill station experience at a time.</span>
        </div>
      </Container>
    </Section>
  );
};
