import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'Privacy Policy | Friendli Tripz',
  description: 'Learn how Friendli Tripz collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-soft-orange flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-navy tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-brand-muted mt-0.5">Last updated: July 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-6 text-brand-text leading-relaxed text-[15px]">
          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">1. Information We Collect</h2>
            <p>When you use Friendli Tripz, we collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li><strong>Personal Information:</strong> Full name, email address, phone number, and age when you submit an enquiry or make a booking.</li>
              <li><strong>Travel Preferences:</strong> Destination preferences, group size, dietary requirements, and special assistance needs.</li>
              <li><strong>Identity Documents:</strong> Government-issued ID numbers (Aadhaar, Passport) required for hotel check-in, stored in our encrypted document vault.</li>
              <li><strong>Payment Information:</strong> Payment details are processed directly by our payment gateway partner (Razorpay) and are never stored on our servers.</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, and interaction patterns to improve our service.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>To process and manage your trip bookings and enquiries.</li>
              <li>To communicate booking confirmations, trip updates, and operational information.</li>
              <li>To coordinate with our hotel partners, vehicle operators, and activity vendors on your behalf.</li>
              <li>To contact you via WhatsApp, email, or phone regarding your trip.</li>
              <li>To improve our platform and travel services.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">3. Data Protection (DPDP Act 2023 Compliance)</h2>
            <p>Friendli Tripz is committed to compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act). We implement the following safeguards:</p>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>Identity documents are stored in an AES-256 encrypted vault with automatic purge after 30 days post-trip completion.</li>
              <li>All data processing is purpose-limited to trip booking and operations.</li>
              <li>You may request deletion of your personal data at any time by contacting us.</li>
              <li>We do not sell, trade, or rent your personal information to third parties.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">4. Data Sharing</h2>
            <p>We share your information only with parties essential to delivering your trip experience:</p>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li><strong>Hotel Partners:</strong> Guest name, room requirements, meal plans, and special requests.</li>
              <li><strong>Vehicle Operators:</strong> Pickup location, contact number, and passenger count.</li>
              <li><strong>Activity Vendors:</strong> Participant names and group size for pre-booked activities.</li>
              <li><strong>Payment Processors:</strong> Razorpay processes payments under their own privacy policy.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">5. Cookies & Analytics</h2>
            <p>We use essential cookies for authentication and session management. Analytics cookies help us understand how travellers interact with our platform. You may disable non-essential cookies in your browser settings.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">6. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-1 text-brand-muted">
              <li>Access your personal data held by Friendli Tripz.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your data (subject to legal retention requirements).</li>
              <li>Withdraw consent for marketing communications at any time.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-brand-navy">7. Contact Us</h2>
            <p>For privacy-related enquiries, contact our Data Protection team:</p>
            <p className="text-brand-muted">
              <strong>Email:</strong> privacy@friendlitripz.com<br />
              <strong>Address:</strong> Friendli Tripz, Tamil Nadu, India
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
