import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { FileText, ArrowLeft, CheckCircle2, Shield, Scale, HelpCircle } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

import { BRAND_INFO } from '@/lib/data/trips';

export const metadata = {
  title: 'Terms of Service | Friendli Tripz',
  description: 'Terms and conditions governing the use of Friendli Tripz travel platform and services.',
};

export default function TermsPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-4xl">
        <Link href={ROUTES.HOME} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-elevated flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Terms of Service</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Platform Service Agreement • Last updated: July 2026</p>
          </div>
        </div>

        {/* Content Document */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-elevated space-y-8 text-slate-300 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <CheckCircle2 className="w-4 h-4 text-brand-orange" /> 1. Acceptance of Terms
            </h2>
            <p>By accessing or using the Friendli Tripz platform, booking services, or enquiries engine, you agree to be bound by these Terms of Service. If you do not agree, please discontinue platform usage.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4 text-brand-orange" /> 2. Services Offered
            </h2>
            <p>Friendli Tripz provides curated group travel experiences, AI trip planning, and booking management:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Curated group trip packages with pre-planned itineraries and stays.</li>
              <li>Custom trip planning and lead assignment to dedicated trip planners.</li>
              <li>Coordination of accommodations, transport, and local activities through verified partner networks.</li>
              <li>Live 5-stage trip tracker access via unique reference codes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Scale className="w-4 h-4 text-brand-orange" /> 3. Booking & Payment Policies
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Bookings are confirmed upon receipt of advance deposit or full booking confirmation.</li>
              <li>All payments are processed securely through Razorpay in Indian Rupees (INR), inclusive of applicable taxes.</li>
              <li>Remaining balances must be cleared prior to trip departure as specified in your booking agreement.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <CheckCircle2 className="w-4 h-4 text-brand-orange" /> 4. Traveller Responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Provide accurate contact details, valid government photo IDs (Aadhaar/Passport), and travel dates.</li>
              <li>Adhere to trip schedules and guidelines shared by assigned travel planners and local trip captains.</li>
              <li>Behave respectfully towards fellow travellers, host communities, and natural environments.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <HelpCircle className="w-4 h-4 text-brand-orange" /> 5. Questions & Legal Inquiries
            </h2>
            <p>For questions regarding these Terms of Service, contact our support team:</p>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-1">
              <p><strong className="text-white">Email:</strong> {BRAND_INFO.supportEmail}</p>
              <p><strong className="text-white">Phone:</strong> {BRAND_INFO.contactPhone}</p>
              <p><strong className="text-white">Location:</strong> Tamil Nadu, India</p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
