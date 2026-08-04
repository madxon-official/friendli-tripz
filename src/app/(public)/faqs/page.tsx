'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, MessageSquare } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/lib/routes';
import { BRAND_INFO } from '@/lib/data/trips';

const PUBLIC_FAQS = [
  {
    id: 'faq-1',
    question: 'How does Friendli Tripz work without user logins or accounts?',
    answer: 'We believe travel planning should be frictionless! You discover destinations, plan your custom vibe or select a package, and submit a simple enquiry. You instantly get a unique Reference ID (e.g. FT-2026-8942) to track your trip status live anytime without remembering passwords.',
  },
  {
    id: 'faq-2',
    question: 'What destinations does Friendli Tripz currently support?',
    answer: 'We exclusively focus on Kodaikanal, Ooty, and Valparai to deliver deeply curated, pre-audited local experiences with verified stays and dedicated trip captains.',
  },
  {
    id: 'faq-3',
    question: 'Can I customize my trip dates and activities?',
    answer: '100% yes! Every itinerary is tailored to your squad, budget, travel style, and preferences.',
  },
  {
    id: 'faq-4',
    question: 'How do I track my active trip once booked?',
    answer: 'Go to the Track Trip page (/track) and enter your Reference ID. You can see real-time status steps, assigned driver details, vehicle info, and itinerary notes updated live by our operations team.',
  },
];

export default function FAQsPage() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Clear & Transparent</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-base mt-3">
            Everything you need to know about our accountless enquiry flow, trip tracking, and custom planning across Kodaikanal, Ooty, and Valparai.
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {PUBLIC_FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full px-6 py-5 text-left font-bold text-white flex items-center justify-between gap-4 hover:bg-slate-850 transition-colors"
                >
                  <span className="text-base">{faq.question}</span>
                  <span className="text-brand-orange text-xl">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-300 border-t border-slate-800/60 pt-4 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold text-white mb-2">Have a question not listed here?</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6">Submit a quick trip enquiry and your dedicated trip manager will assist you over phone/WhatsApp.</p>
          <Link
            href={ROUTES.ENQUIRE}
            className="bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors shadow-button flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Submit Trip Enquiry
          </Link>
          <p className="text-xs text-slate-400 mt-4">
            Need technical, login, or booking support? Email <a href={`mailto:${BRAND_INFO.supportEmail}`} className="text-brand-orange font-bold hover:underline">{BRAND_INFO.supportEmail}</a>
          </p>
        </div>
      </Container>
    </div>
  );
}
