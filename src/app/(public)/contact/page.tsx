import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { BRAND_INFO } from '@/lib/data/trips';
import { Phone, MessageSquare, Mail, ShieldCheck, Clock, ArrowRight, Sparkles, Building, Headphones } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'Contact Us & Support | Friendli Tripz',
  description: 'Reach our team via Phone, WhatsApp, Support Email, or General Inquiries.',
};

export default function ContactPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-orange text-xs font-semibold uppercase tracking-wider">
            <Headphones className="w-3.5 h-3.5" />
            <span>Dedicated Support Channels</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Reach out through our specialized channels for urgent travel assistance, real-time trip coordination, or technical help.
          </p>
        </div>

        {/* 4 Specialized Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* 1. Phone Support */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-elevated hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block font-mono">Urgent Phone Support</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">Call Us Directly</h3>
                <p className="text-xs text-slate-400 mt-1">For urgent travel assistance, customer phone calls, and trip inquiries.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <a
                href={`tel:${BRAND_INFO.contactPhone.replace(/[^0-9+]/g, '')}`}
                className="text-lg font-mono font-extrabold text-brand-orange hover:underline block"
              >
                {BRAND_INFO.contactPhone}
              </a>
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Mon–Fri, 9:00 AM – 6:00 PM IST
              </span>
            </div>
          </div>

          {/* 2. WhatsApp Real-Time */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-elevated hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest block font-mono">Real-Time Coordination</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">WhatsApp Direct Chat</h3>
                <p className="text-xs text-slate-400 mt-1">Booking confirmations, live trip tracking updates, and quick customer support.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-slate-500 block font-medium">Usually replies within 15 minutes</span>
            </div>
          </div>

          {/* 3. Technical Support Email */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-elevated hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest block font-mono">Technical & Account Support</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">Support Email</h3>
                <p className="text-xs text-slate-400 mt-1">Login assistance, password reset help, payment issues, and technical support.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-1">
              <a
                href={`mailto:${BRAND_INFO.supportEmail}`}
                className="text-sm font-mono font-bold text-white hover:text-brand-orange transition-colors block"
              >
                {BRAND_INFO.supportEmail}
              </a>
              <span className="text-[11px] text-slate-500 block">Response within 24 hours on business days</span>
            </div>
          </div>

          {/* 4. General & Corporate Contact Email */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-elevated hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block font-mono">Partnerships & Media</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">General Enquiries</h3>
                <p className="text-xs text-slate-400 mt-1">Corporate bookings, hotel/stay partnerships, vendor onboarding, and media inquiries.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-1">
              <a
                href={`mailto:${BRAND_INFO.contactEmail}`}
                className="text-sm font-mono font-bold text-white hover:text-brand-orange transition-colors block"
              >
                {BRAND_INFO.contactEmail}
              </a>
              <span className="text-[11px] text-slate-500 block">Business & partnership communications</span>
            </div>
          </div>
        </div>

        {/* Quick Trip Enquiry CTA */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-elevated">
          <h2 className="text-2xl font-extrabold text-white">Looking to submit a trip request?</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            No password setup required. Tell us your vibe and receive a unique Reference ID for live tracking.
          </p>
          <div className="pt-2">
            <Link
              href={ROUTES.ENQUIRE}
              className="px-6 py-3 rounded-2xl bg-brand-orange text-white font-extrabold text-xs shadow-button hover:bg-brand-orange/90 transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Submit Trip Enquiry
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
