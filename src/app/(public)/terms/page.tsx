import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { FileText, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'Terms of Service | Friendli Tripz',
  description: 'Terms and conditions governing the use of Friendli Tripz travel platform and services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-soft-navy flex items-center justify-center">
            <FileText className="w-5 h-5 text-brand-navy" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-navy tracking-tight">Terms of Service</h1>
            <p className="text-xs text-brand-muted mt-0.5">Last updated: July 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-6 text-brand-text leading-relaxed text-[15px]">
          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">1. Acceptance of Terms</h2>
            <p>By using the Friendli Tripz website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. Friendli Tripz reserves the right to update these terms at any time, with notice posted on this page.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">2. Services</h2>
            <p>Friendli Tripz provides curated group travel experiences, including:</p>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>Curated trip packages with pre-planned itineraries.</li>
              <li>Customization of trips based on traveller preferences.</li>
              <li>Coordination of accommodation, transport, and activities through our verified partner network.</li>
              <li>Personal trip support from enquiry through trip completion.</li>
            </ul>
            <p>Friendli Tripz acts as a travel organiser and service aggregator. Individual services (hotels, transport, activities) are provided by our independent partner network.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">3. Booking & Payment</h2>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>A booking is confirmed only after receipt of the advance deposit amount.</li>
              <li>Full payment must be completed before the trip departure date as per the payment schedule.</li>
              <li>All prices are in Indian Rupees (INR) and inclusive of applicable GST unless stated otherwise.</li>
              <li>Payments are processed securely through Razorpay. Friendli Tripz does not store card details.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">4. Traveller Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>Provide accurate personal information and valid identification documents.</li>
              <li>Adhere to the trip schedule and instructions from the trip leader or driver.</li>
              <li>Behave respectfully towards fellow travellers, local communities, and the environment.</li>
              <li>Carry valid government-issued photo identification during the trip.</li>
              <li>Inform us of any medical conditions, allergies, or special needs at the time of booking.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">5. Trip Modifications</h2>
            <p>Friendli Tripz reserves the right to modify itineraries due to:</p>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>Weather conditions or natural events affecting safety.</li>
              <li>Road closures or transport disruptions.</li>
              <li>Partner venue closures or capacity restrictions.</li>
              <li>Government advisories or regulations.</li>
            </ul>
            <p>In such cases, we will provide equivalent alternative arrangements or a proportional refund.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">6. Liability Limitations</h2>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>Friendli Tripz is not liable for delays, cancellations, or service failures by third-party partners (hotels, transport, activities).</li>
              <li>Personal belongings are the traveller's responsibility.</li>
              <li>Travel insurance is strongly recommended but not included in package pricing.</li>
              <li>Friendli Tripz total liability shall not exceed the total amount paid for the booking.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">7. Intellectual Property</h2>
            <p>All content on the Friendli Tripz platform (text, images, logos, design) is owned by Friendli Tripz and protected under applicable intellectual property laws. Reproduction without written permission is prohibited.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">8. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Tamil Nadu, India.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">9. Contact</h2>
            <p>For questions about these Terms of Service, please contact us at <strong>support@friendlitripz.com</strong>.</p>
          </section>
        </div>
      </Container>
    </main>
  );
}
