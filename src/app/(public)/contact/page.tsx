import React from 'react';
import type { Metadata } from 'next';
import { Mail, Phone, MessageSquare, Instagram } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { Badge } from '@/components/v3/ui/Badge';
import { Card } from '@/components/v3/ui/Card';
import { BRAND_INFO } from '@/lib/data/trips';
import { ContactFormWidget } from '@/components/v3/contact/ContactFormWidget';

export const metadata: Metadata = {
  title: 'Contact Us & Trip Support | Friendli Tripz',
  description: 'Reach out to Friendli Tripz team for trip inquiries, custom group bookings, and instant support.',
};

export const revalidate = 3600; // Enable ISR static caching

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5" />
        <Container className="relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <Badge variant="brand" size="sm" icon={<MessageSquare className="w-3.5 h-3.5" />}>
              Get in Touch
            </Badge>
            <h1 className="text-display sm:text-display-lg font-heading font-extrabold text-white">
              We&apos;re Here to{' '}
              <span className="text-gradient-warm inline-block">Help You Travel</span>
            </h1>
            <p className="text-body-lg text-white/70 max-w-xl mx-auto">
              Have a question about a trip? Want to plan a custom getaway for your group? Reach out anytime!
            </p>
          </div>
        </Container>
      </section>

      {/* Main Section */}
      <section className="py-section-sm sm:py-section bg-surface-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-label-sm font-bold text-brand-orange uppercase tracking-wider">
                  Contact Information
                </span>
                <h2 className="text-heading-lg font-heading font-bold text-surface-900">
                  Talk to a Travel Host
                </h2>
                <p className="text-body-md text-surface-600">
                  We reply fastest on WhatsApp. Feel free to call or message us directly.
                </p>
              </div>

              <div className="space-y-4">
                <Card variant="outline" padding="md" className="bg-white border border-surface-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-caption text-surface-400 font-semibold uppercase tracking-wider">
                        WhatsApp & Support
                      </div>
                      <a href={BRAND_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-body-lg font-bold text-surface-900 hover:text-brand-orange transition-colors">
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </Card>

                <Card variant="outline" padding="md" className="bg-white border border-surface-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-navy/10 flex items-center justify-center text-brand-navy shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-caption text-surface-400 font-semibold uppercase tracking-wider">
                        Email Us
                      </div>
                      <a href={`mailto:${BRAND_INFO.contactEmail}`} className="text-body-lg font-bold text-surface-900 hover:text-brand-orange transition-colors">
                        {BRAND_INFO.contactEmail}
                      </a>
                    </div>
                  </div>
                </Card>

                <Card variant="outline" padding="md" className="bg-white border border-surface-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-caption text-surface-400 font-semibold uppercase tracking-wider">
                        Instagram
                      </div>
                      <a
                        href={BRAND_INFO.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-lg font-bold text-surface-900 hover:text-brand-orange transition-colors"
                      >
                        @friendlitripz
                      </a>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right: Contact Form Widget */}
            <div className="lg:col-span-7">
              <ContactFormWidget />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
