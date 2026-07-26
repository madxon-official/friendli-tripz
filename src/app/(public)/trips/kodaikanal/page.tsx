import React from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KODAIKANAL_TRIP } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'Kodaikanal Experience | Friendli Tripz',
  description: 'Misty roads, pine forests, and mountain air with good company. Explore the Kodaikanal trip with Friendli Tripz.',
};

export default function KodaikanalTripPage() {
  return (
    <main className="min-h-screen pb-16">
      <section className="bg-brand-navy text-white pt-12 pb-16 relative overflow-hidden">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="orange">THE FIRST FRIENDLI ESCAPE</Badge>
              <span className="text-slate-300 text-xs flex items-center gap-1 font-mono">
                <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                {KODAIKANAL_TRIP.destination}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              {KODAIKANAL_TRIP.name}
            </h1>

            <p className="text-lg text-slate-200 leading-relaxed">
              {KODAIKANAL_TRIP.tagline}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button href={ROUTES.CUSTOMIZE} variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                I&apos;m Interested / Join
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Section variant="warm">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-card border border-brand-border/60">
                <Image
                  src={KODAIKANAL_TRIP.heroImage}
                  alt="Authentic Kodaikanal landscape imagery"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-border/60 space-y-4">
                <h2 className="text-2xl font-bold text-brand-navy font-heading">
                  About the Kodaikanal Experience
                </h2>
                <p className="text-brand-muted leading-relaxed">
                  Kodaikanal isn&apos;t meant to be rushed. We&apos;ve designed an experience focused on quiet morning walks through misty pine forests, sunset views over mountain landscapes, and shared conversations with fellow travellers.
                </p>
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-brand-navy font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                    <span>Misty pine-covered roads</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-navy font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                    <span>Iconic mountain viewpoints</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-navy font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                    <span>Time to actually enjoy the hills</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-navy font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                    <span>A trip designed around shared memories</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-brand-border/60 shadow-card space-y-4">
                <h3 className="font-heading font-bold text-lg text-brand-navy border-b border-brand-border/60 pb-3">
                  Trip Overview
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1 border-b border-brand-border/40">
                    <span className="text-brand-muted">Duration</span>
                    <span className="font-bold text-brand-navy">{KODAIKANAL_TRIP.duration}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-brand-border/40">
                    <span className="text-brand-muted">Starting Price</span>
                    <span className="font-bold text-brand-navy">{KODAIKANAL_TRIP.startingPrice}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-brand-border/40">
                    <span className="text-brand-muted">Departure</span>
                    <span className="font-bold text-brand-navy">{KODAIKANAL_TRIP.departureCity}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-brand-muted">Next Batch</span>
                    <span className="font-bold text-brand-orange">{KODAIKANAL_TRIP.nextTripDate}</span>
                  </div>
                </div>

                <Button href={ROUTES.CUSTOMIZE} variant="primary" className="w-full justify-center">
                  I&apos;m Interested / Join
                </Button>

                <p className="text-xs text-center text-brand-muted">
                  No automated booking or upfront payment required. Enquiries are reviewed personally.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
