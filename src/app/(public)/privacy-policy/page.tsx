import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ShieldCheck, ArrowLeft, Lock, Database, Eye, UserCheck, Cookie, Mail } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

import { BRAND_INFO } from '@/lib/data/trips';

export const metadata = {
  title: 'Privacy Policy | Friendli Tripz',
  description: 'Learn how Friendli Tripz collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-4xl">
        <Link href={ROUTES.HOME} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        {/* Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-elevated flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">DPDP Act 2023 Compliant • Last updated: July 2026</p>
          </div>
        </div>

        {/* Content Document */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-elevated space-y-8 text-slate-300 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Database className="w-4 h-4 text-brand-orange" /> 1. Information We Collect
            </h2>
            <p>When you use Friendli Tripz, we collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong className="text-white">Personal Information:</strong> Full name, email address, phone number, and age when you submit an enquiry or make a booking.</li>
              <li><strong className="text-white">Travel Preferences:</strong> Destination preferences, starting city, group size, dietary requirements, and custom requests.</li>
              <li><strong className="text-white">Identity Documents:</strong> Government-issued ID numbers (Aadhaar, Passport) required for hotel check-in, stored in our encrypted vault.</li>
              <li><strong className="text-white">Payment Information:</strong> Payment details are processed directly by our payment gateway partner (Razorpay) and are never stored on our servers.</li>
              <li><strong className="text-white">Usage Data:</strong> Pages visited, interaction patterns, and session telemetry to improve platform quality.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Eye className="w-4 h-4 text-brand-orange" /> 2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>To process and manage your trip enquiries, lead assignments, and live trip tracking.</li>
              <li>To send transactional emails, booking confirmations, and operational trip alerts via WhatsApp and email.</li>
              <li>To coordinate with verified hotel partners, vehicle operators, and local trip captains.</li>
              <li>To fulfill safety guidelines and customer support requests.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Lock className="w-4 h-4 text-brand-orange" /> 3. Data Protection (DPDP Act 2023 Compliance)
            </h2>
            <p>Friendli Tripz is committed to compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act). We enforce strict security protocols:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Identity documents are stored in an AES-256 encrypted vault with automatic purge 30 days post-trip completion.</li>
              <li>All data processing is purpose-limited to trip booking, safety verification, and platform operations.</li>
              <li>You may request deletion of your personal data at any time by contacting our support team.</li>
              <li>We do not sell, trade, or rent your personal information to third-party brokers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <UserCheck className="w-4 h-4 text-brand-orange" /> 4. Data Sharing & Partners
            </h2>
            <p>We share your information only with essential operational partners:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong className="text-white">Verified Hotel Partners:</strong> Guest names, check-in dates, and room occupancy.</li>
              <li><strong className="text-white">Transport Captains:</strong> Pickup location, traveller phone number, and passenger count.</li>
              <li><strong className="text-white">Payment Processors:</strong> Razorpay processes transactions securely under bank-grade encryption.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Cookie className="w-4 h-4 text-brand-orange" /> 5. Cookies & Analytics
            </h2>
            <p>We use essential cookies for authentication, session management, and CSRF protection. Analytics cookies help us optimize page load speeds and user experience.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Mail className="w-4 h-4 text-brand-orange" /> 6. Contact Data Protection Team
            </h2>
            <p>For privacy-related requests or data deletion inquiries:</p>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-1">
              <p><strong className="text-white">Email:</strong> {BRAND_INFO.supportEmail}</p>
              <p><strong className="text-white">Phone:</strong> {BRAND_INFO.contactPhone}</p>
              <p><strong className="text-white">Office:</strong> Friendli Tripz Operations, Tamil Nadu, India</p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
