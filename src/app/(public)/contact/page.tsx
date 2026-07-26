import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'Contact Us | Friendli Tripz',
  description: 'Get in touch with Friendli Tripz for Kodaikanal trip queries and custom travel enquiries.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pb-16">
      <section className="bg-brand-navy text-white py-12">
        <Container>
          <div className="max-w-2xl space-y-3">
            <span className="text-brand-orange font-bold text-xs tracking-wider uppercase font-mono">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              We&apos;re here to help you plan.
            </h1>
            <p className="text-slate-300 text-base">
              Have questions about our Kodaikanal trip or want to discuss a custom itinerary? Connect with us.
            </p>
          </div>
        </Container>
      </section>

      <Section variant="warm">
        <Container>
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-brand-border/60 shadow-card space-y-6">
            <h2 className="text-xl font-bold text-brand-navy font-heading">
              Trip Enquiries
            </h2>
            <p className="text-brand-muted text-sm leading-relaxed">
              We handle all trip enquiries personally to ensure availability, custom preferences, and group requirements are properly reviewed before confirmation.
            </p>

            <div className="pt-2 space-y-4">
              <Button href={ROUTES.CUSTOMIZE} variant="primary" size="lg" className="w-full justify-center">
                Submit Kodaikanal Enquiry
              </Button>
            </div>

            <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
              <span>Official contact handles to be announced</span>
              <ShieldCheck className="w-4 h-4 text-brand-orange" />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
