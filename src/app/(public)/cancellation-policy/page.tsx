import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'Cancellation & Refund Policy | Friendli Tripz',
  description: 'Understand the cancellation windows, refund percentages, and amendment process for Friendli Tripz bookings.',
};

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-navy tracking-tight">Cancellation & Refund Policy</h1>
            <p className="text-xs text-brand-muted mt-0.5">Last updated: July 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-6 text-brand-text leading-relaxed text-[15px]">
          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">1. Cancellation by Traveller</h2>
            <p>We understand plans can change. The following cancellation charges apply based on how far in advance you cancel before the trip departure date:</p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-brand-soft-navy">
                    <th className="text-left px-4 py-3 font-bold text-brand-navy border border-brand-border">Cancellation Window</th>
                    <th className="text-left px-4 py-3 font-bold text-brand-navy border border-brand-border">Refund Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 border border-brand-border text-brand-muted">30+ days before departure</td>
                    <td className="px-4 py-3 border border-brand-border font-bold text-emerald-700">90% refund (10% processing fee)</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-4 py-3 border border-brand-border text-brand-muted">15–29 days before departure</td>
                    <td className="px-4 py-3 border border-brand-border font-bold text-amber-700">50% refund</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border border-brand-border text-brand-muted">7–14 days before departure</td>
                    <td className="px-4 py-3 border border-brand-border font-bold text-orange-700">25% refund</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-4 py-3 border border-brand-border text-brand-muted">Less than 7 days before departure</td>
                    <td className="px-4 py-3 border border-brand-border font-bold text-red-700">No refund</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border border-brand-border text-brand-muted">No-show on departure date</td>
                    <td className="px-4 py-3 border border-brand-border font-bold text-red-700">No refund</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">2. How to Cancel</h2>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>Contact us via WhatsApp or email with your booking reference code.</li>
              <li>Cancellation requests are processed within 2 business days.</li>
              <li>Refunds are initiated to the original payment method within 5-7 business days after processing.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">3. Cancellation by Friendli Tripz</h2>
            <p>In rare circumstances, Friendli Tripz may cancel a trip due to:</p>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>Minimum group size not met (you will be offered an alternative date or full refund).</li>
              <li>Severe weather or natural disaster affecting the destination.</li>
              <li>Government travel restrictions or advisories.</li>
              <li>Safety concerns reported by our local operations team.</li>
            </ul>
            <p className="font-medium text-brand-navy">In all cases of company-initiated cancellation, you will receive a <strong>100% full refund</strong> or the option to reschedule to a future departure at no extra cost.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">4. Trip Date Changes & Amendments</h2>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>Date changes are subject to availability and may incur a ₹500 amendment processing fee.</li>
              <li>Changes to room category, meal plan, or activities may result in a price difference (higher or lower).</li>
              <li>Amendments cannot be made within 7 days of departure.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">5. Partial Cancellations</h2>
            <p>If one or more travellers in a group booking cancel while others continue:</p>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>The cancelling traveller(s) will receive a refund per the cancellation window above.</li>
              <li>The remaining group's pricing may be adjusted if the change affects room sharing, vehicle allocation, or activity group rates.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">6. Force Majeure</h2>
            <p>Neither party shall be liable for delays or cancellations due to events beyond reasonable control, including but not limited to natural disasters, pandemics, government actions, civil unrest, or transport strikes. In such events, Friendli Tripz will offer a full credit for a future trip or a complete refund.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">7. Contact for Cancellations</h2>
            <p className="text-brand-muted">
              <strong>Email:</strong> support@friendlitripz.com<br />
              <strong>Response time:</strong> Within 24 hours on business days
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
