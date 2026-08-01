import React from 'react';
import { HelpCircle, Compass, Wallet, Car, Users, ShieldCheck, CalendarDays } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { Badge } from '@/components/v3/ui/Badge';
import { Accordion } from '@/components/v3/ui/Accordion';
import { GradientButton } from '@/components/v3/ui/GradientButton';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'FAQs',
  description: 'Everything you need to know about Friendli Tripz — booking, cancellations, safety, accommodations, and more.',
};

const FAQ_GROUPS = [
  {
    category: 'Booking & Payments',
    icon: Wallet,
    faqs: [
      { id: 'b1', title: 'How do I book a trip?', content: 'Browse our packages, pick your preferred dates, and click "Book Now". You can pay the booking advance via UPI, card, or net banking. The remaining balance is due 7 days before departure.' },
      { id: 'b2', title: 'Is there a booking advance?', content: 'Yes, we collect a booking advance of ₹2,000 per person to confirm your seat. This is fully adjustable against the trip cost. No hidden charges.' },
      { id: 'b3', title: 'What payment methods do you accept?', content: 'We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and bank transfers. All payments are processed securely.' },
      { id: 'b4', title: 'Can I pay in installments?', content: 'Yes! For trips above ₹10,000, we offer a 50-50 split: pay half at booking and the rest 7 days before departure.' },
    ],
  },
  {
    category: 'Trip Details',
    icon: Compass,
    faqs: [
      { id: 't1', title: 'What is included in the trip price?', content: 'All our packages include accommodation, transport (AC vehicle), meals as mentioned, sightseeing, guide fees, and trip leadership. Check individual package pages for exact inclusions.' },
      { id: 't2', title: 'What is NOT included?', content: 'Personal expenses, adventure activities with external vendors (paragliding, rafting etc.), travel insurance, and anything not explicitly mentioned in the inclusions list.' },
      { id: 't3', title: 'How big are the groups?', content: 'Our groups typically range from 8 to 20 people. We cap group sizes to ensure a quality experience. Solo travellers are always welcome!' },
      { id: 't4', title: 'Can I customize a trip?', content: 'Absolutely! Use our AI Trip Planner or reach out on WhatsApp. We\'ll build a custom itinerary for your group with preferred destinations, activities, and budget.' },
    ],
  },
  {
    category: 'Transport & Logistics',
    icon: Car,
    faqs: [
      { id: 'l1', title: 'How do I reach the meeting point?', content: 'We share detailed meeting point information 48 hours before departure. Most trips have a central city pickup point with an AC tempo traveller or bus.' },
      { id: 'l2', title: 'Are the vehicles safe?', content: 'All vehicles are pre-inspected with mandatory safety checks. Drivers are verified with background checks and hold valid commercial licenses.' },
      { id: 'l3', title: 'What if I want to travel independently to the destination?', content: 'You can opt out of group transport and meet us directly at the accommodation. Let us know in advance and we\'ll adjust your pricing accordingly.' },
    ],
  },
  {
    category: 'Safety & Support',
    icon: ShieldCheck,
    faqs: [
      { id: 's1', title: 'Is it safe for solo travellers?', content: 'Absolutely! Over 60% of our travellers join solo. Our trip leaders ensure everyone feels included. Room sharing is same-gender unless you opt for a private room.' },
      { id: 's2', title: 'Is it safe for women?', content: 'Safety is our #1 priority. We have verified drivers, well-lit accommodations, trip leaders on every trip, and 24/7 emergency support. Many of our travellers are women travelling solo.' },
      { id: 's3', title: 'What if there\'s an emergency during the trip?', content: 'Every trip has a designated trip leader with first-aid training. We maintain 24/7 operations support and have local contacts at every destination for medical or logistical emergencies.' },
    ],
  },
  {
    category: 'Cancellations & Refunds',
    icon: CalendarDays,
    faqs: [
      { id: 'c1', title: 'What is the cancellation policy?', content: 'Full refund if cancelled 15+ days before departure. 50% refund for 7–14 days. No refund within 7 days. Trip date changes are subject to availability.' },
      { id: 'c2', title: 'What if the trip gets cancelled by Friendli Tripz?', content: 'If we cancel a trip for any reason (weather, minimum group size not met), you receive a 100% refund or can transfer to another trip at no extra cost.' },
      { id: 'c3', title: 'Can I transfer my booking to someone else?', content: 'Yes, you can transfer your booking to another person up to 72 hours before departure at no extra charge. Just let our team know.' },
    ],
  },
];

export default function FAQsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5" />
        <Container className="relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <Badge variant="brand" size="sm" icon={<HelpCircle className="w-3.5 h-3.5" />}>
              Help Centre
            </Badge>
            <h1 className="text-display sm:text-display-lg font-heading font-extrabold text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-body-lg text-white/70 max-w-xl mx-auto">
              Everything you need to know about travelling with Friendli Tripz.
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ Groups */}
      <section className="py-section-sm sm:py-section bg-surface-50">
        <Container size="narrow">
          <div className="space-y-12">
            {FAQ_GROUPS.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-button bg-brand-navy flex items-center justify-center">
                    <group.icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h2 className="text-heading font-heading font-extrabold text-brand-navy">
                    {group.category}
                  </h2>
                </div>
                <Accordion
                  items={group.faqs.map((faq) => ({
                    id: faq.id,
                    title: faq.title,
                    content: faq.content,
                  }))}
                  variant="card"
                />
              </div>
            ))}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-16 text-center p-10 bg-white rounded-card-lg border border-surface-200/60 shadow-subtle">
            <h3 className="text-heading font-heading font-extrabold text-brand-navy mb-2">
              Still have questions?
            </h3>
            <p className="text-body-sm text-brand-muted mb-6">
              Our travel experts are available 7 days a week to help you plan the perfect trip.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GradientButton href={ROUTES.CONTACT} variant="orange" size="md">
                Contact Us
              </GradientButton>
              <GradientButton href={ROUTES.PLANNER} variant="navy" size="md">
                Try AI Planner
              </GradientButton>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
