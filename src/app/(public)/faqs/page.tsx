import React from 'react';
import { getPublishedFAQs } from '@/lib/actions/faq';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { SEOStructuredData } from '@/components/public/SEOStructuredData';

export const metadata = {
  title: 'Frequently Asked Questions (FAQs) | Friendli Tripz',
  description: 'Find answers about trip bookings, deposit payments, cancellation policies, and safety protocols.',
};

export default async function FAQsPage() {
  const faqs = await getPublishedFAQs();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEOStructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <HelpCircle className="w-3.5 h-3.5" />
            Clear & Transparent Answers
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-sm">
            Everything you need to know about our booking engine, pricing policies, and travel execution.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                  {faq.category}
                </span>
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-lg">
                {faq.question}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
