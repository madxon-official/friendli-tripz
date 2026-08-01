'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do verified social cohorts work?',
    answer:
      'We keep our group sizes small (8-14 guests) and screen profiles to ensure a friendly, safe, and respectful environment. Whether traveling solo or with a partner, you join like-minded explorers.',
  },
  {
    question: 'What is included in the package price?',
    answer:
      'All Friendli packages include handpicked accommodations (heritage bungalows or boutique stays), daily breakfast & dinner, private commercial transport for all 3 days, driver allowances, entry permits, and dedicated Tour Captain support.',
  },
  {
    question: 'How does the Offline Trip Vault pass work?',
    answer:
      'Once booked, your itinerary, emergency contacts, driver details, and cryptographically signed HMAC-SHA256 QR voucher save directly to your mobile browser. Even in hill zones with zero network signal, your vouchers remain 100% accessible.',
  },
  {
    question: 'What is your cancellation and refund policy?',
    answer:
      'Cancellations requested >14 days prior to departure receive a 100% refund (minus Razorpay processing fees). Cancellations between 7-14 days receive a 50% cash refund or 100% trip credit voucher.',
  },
  {
    question: 'Can I customize dates or book a private group vehicle?',
    answer:
      'Yes! Use our Trip Customizer tool (/customize) to tailor travel dates, guest count, and stay preferences. Our sales team will generate a custom quote within 5 minutes.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <Container>
        <SectionHeading
          eyebrow="Got Questions? We Have Answers."
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about booking, ground safety, inclusions, and cohort travel."
          align="center"
        />

        <div className="max-w-3xl mx-auto mt-10 space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-brand-border/60 overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-heading font-extrabold text-base sm:text-lg text-brand-navy flex items-center justify-between gap-4 bg-brand-warm/50 hover:bg-brand-soft-navy/50 transition-colors min-h-[44px]"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-brand-orange shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-navy/60 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-orange' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-3 bg-white text-sm text-brand-muted leading-relaxed border-t border-brand-border/40 font-body">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Callout */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-soft-navy text-brand-navy text-xs font-bold border border-brand-border/60">
            <ShieldCheck className="w-4 h-4 text-brand-orange" />
            <span>Have a specific question? Chat directly with our travel team on WhatsApp!</span>
          </div>
        </div>
      </Container>
    </section>
  );
};
