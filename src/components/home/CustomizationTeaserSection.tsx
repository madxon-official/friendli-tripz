import React from 'react';
import { SlidersHorizontal, ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/routes';

export const CustomizationTeaserSection: React.FC = () => {
  const optionsTeaser = [
    'Custom Travel Dates',
    'Group Size Flexibility',
    'Starting Location Pickup',
    'Stay Preferences',
    'Special Travel Requests',
    'Scenic Hill Routes',
  ];

  return (
    <Section variant="soft-orange" id="customize-teaser">
      <Container>
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-orange/20 shadow-card relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Description */}
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="orange" className="gap-1.5">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Friendli Flexibility</span>
              </Badge>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
                Start with our trip.{' '}
                <span className="text-brand-orange">Make it yours.</span>
              </h2>

              <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
                Have specific dates, group sizes, or preferences? Tell us what you would like adapted in our Kodaikanal trip, and we will review availability and details personally.
              </p>

              {/* Options Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {optionsTeaser.map((opt) => (
                  <div
                    key={opt}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-warm border border-brand-border/60 text-xs sm:text-sm font-semibold text-brand-navy"
                  >
                    <div className="w-4 h-4 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Button
                  href={ROUTES.CUSTOMIZE}
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Customize My Trip
                </Button>
              </div>
            </div>

            {/* Right Flow Preview Card */}
            <div className="lg:col-span-5 bg-brand-soft-navy p-6 sm:p-8 rounded-2xl border border-brand-navy/10 space-y-4">
              <h3 className="text-lg font-bold text-brand-navy border-b border-brand-navy/10 pb-3 font-heading">
                How Customization Works
              </h3>
              
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 font-mono">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-brand-navy block">Share your preferences</span>
                    <span className="text-brand-muted">Select dates, group size, and custom requirements.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 font-mono">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-brand-navy block">Friendli reviews request</span>
                    <span className="text-brand-muted">We verify transport & stay options for your request.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 font-mono">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-brand-navy block">Personal follow-up</span>
                    <span className="text-brand-muted">We confirm final itinerary details and pricing manually.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
