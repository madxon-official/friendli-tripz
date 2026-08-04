import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { RotateCcw, ArrowLeft, Calendar, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

import { BRAND_INFO } from '@/lib/data/trips';

export const metadata = {
  title: 'Cancellation & Refund Policy | Friendli Tripz',
  description: 'Understand the cancellation windows, refund percentages, and amendment process for Friendli Tripz bookings.',
};

export default function CancellationPolicyPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-4xl">
        <Link href={ROUTES.HOME} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-elevated flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Cancellation & Refund Policy</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Transparent Refund Windows • Last updated: July 2026</p>
          </div>
        </div>

        {/* Content Document */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-elevated space-y-8 text-slate-300 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Calendar className="w-4 h-4 text-brand-orange" /> 1. Cancellation Windows & Refunds
            </h2>
            <p>We understand plans can change. Refunds are calculated based on how far in advance you cancel before departure:</p>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-extrabold tracking-wider">
                    <th className="px-5 py-3.5">Cancellation Window</th>
                    <th className="px-5 py-3.5">Refund Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr>
                    <td className="px-5 py-4 font-semibold text-slate-200">30+ days before departure</td>
                    <td className="px-5 py-4 font-extrabold text-emerald-400">90% Refund (10% processing fee)</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 font-semibold text-slate-200">15–29 days before departure</td>
                    <td className="px-5 py-4 font-extrabold text-amber-400">50% Refund</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 font-semibold text-slate-200">7–14 days before departure</td>
                    <td className="px-5 py-4 font-extrabold text-orange-400">25% Refund</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 font-semibold text-slate-200">Less than 7 days / No-show</td>
                    <td className="px-5 py-4 font-extrabold text-rose-400">Non-refundable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <RotateCcw className="w-4 h-4 text-brand-orange" /> 2. How to Request Cancellation
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Submit your cancellation request via WhatsApp or email with your unique Reference ID.</li>
              <li>Requests are processed within 24 hours on business days.</li>
              <li>Refunds are returned to your original payment method (bank account / UPI) within 5–7 business days.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <CheckCircle2 className="w-4 h-4 text-brand-orange" /> 3. Company-Initiated Cancellations
            </h2>
            <p>If Friendli Tripz cancels a trip due to severe weather, road closures, or safety concerns, travellers receive a <strong className="text-emerald-400">100% full refund</strong> or optional free reschedule.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <HelpCircle className="w-4 h-4 text-brand-orange" /> 4. Contact Support
            </h2>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-1">
              <p><strong className="text-white">Email:</strong> {BRAND_INFO.supportEmail}</p>
              <p><strong className="text-white">Phone:</strong> {BRAND_INFO.contactPhone}</p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
