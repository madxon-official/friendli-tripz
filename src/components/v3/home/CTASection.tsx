import React from 'react';
import { Sparkles, MapPin } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { GradientButton } from '@/components/v3/ui/GradientButton';
import { ROUTES } from '@/lib/routes';

export function CTASection() {
  return (
    <section className="relative py-section sm:py-section-lg overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-brand" />
      <div className="absolute inset-0 bg-pattern-dots opacity-5" />

      {/* Decorative blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-sky/10 rounded-full blur-[100px]" />

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-badge bg-white/10 border border-white/15 text-white text-caption font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            Your next adventure awaits
          </span>

          <h2 className="text-display sm:text-display-lg font-heading font-extrabold text-white leading-tight">
            Your next trip is{' '}
            <span className="text-gradient-warm inline-block">one click away</span>
          </h2>

          <p className="text-body-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Join thousands of travellers who chose connection over scrolling. We handle every detail — you just show up.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <GradientButton
              href={ROUTES.CUSTOMIZE}
              variant="orange"
              size="lg"
              glow
            >
              Join a Trip
            </GradientButton>

            <GradientButton
              href={ROUTES.PLANNER}
              variant="glass"
              size="lg"
              icon={<MapPin className="w-4 h-4" />}
            >
              Plan My Trip
            </GradientButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

