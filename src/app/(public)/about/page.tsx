import React from 'react';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'About Us | Friendli Tripz',
  description: 'Learn about Friendli Tripz — the social travel brand built around the idea that travel feels better with friends.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-brand-navy text-white pt-20 pb-14 sm:pt-24 sm:pb-18 relative overflow-hidden">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="text-brand-orange font-bold text-xs tracking-wider uppercase font-mono">
              Brand Positioning
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
              Travel feels better with friends.
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              Friendli Tripz was created to make travelling together simpler, more social and more memorable. We thoughtfully organize experiences for people who want to explore great places without spending weeks coordinating every detail.
            </p>
          </div>
        </Container>
      </section>

      <Section variant="warm">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-heading">
                Our First Chapter: Kodaikanal
              </h2>
              <p className="text-brand-muted leading-relaxed">
                We are starting our journey with one destination — Kodaikanal — and focusing on doing it properly. Kodaikanal is the beginning of the Friendli Tripz journey, establishing our approach to unhurried, human-first travel.
              </p>
              <p className="text-brand-muted leading-relaxed">
                As our community grows, more Friendli adventures across different landscapes will follow.
              </p>
              <Button href={ROUTES.KODAIKANAL} variant="primary" size="md">
                Explore Kodaikanal Trip
              </Button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-brand-border/60 shadow-card space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-brand-navy/10 flex items-center justify-center bg-white">
                  <Image src="/logo.jpeg" alt="Friendli Tripz Logo" width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-xl text-brand-navy">Friendli Tripz</h3>
                  <p className="text-xs font-semibold text-brand-orange">Modern Social Travel</p>
                </div>
              </div>
              <p className="text-sm text-brand-muted italic">
                &ldquo;Friendli Tripz should feel like the friend who takes care of the difficult parts of planning a trip.&rdquo;
              </p>
              <div className="pt-2 border-t border-brand-border/60 text-xs text-brand-navy font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                <span>Human-first travel curation</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
