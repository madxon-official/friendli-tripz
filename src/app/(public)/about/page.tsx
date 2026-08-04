'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, Compass, ShieldCheck, Users, ArrowRight, Phone, Mail } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/lib/routes';
import { BRAND_INFO } from '@/lib/data/trips';

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Philosophy</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">Travel. Vibe. Repeat.</h1>
          <p className="text-slate-300 text-lg mt-4 leading-relaxed">
            Friendli Tripz was born out of frustration with rigid travel packages and password-heavy agency portals. We built a platform designed around real human vibes and real-time clarity.
          </p>
        </div>

        {/* Brand Story Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 mb-16 space-y-6 text-slate-300 leading-relaxed">
          <h2 className="text-2xl font-bold text-white">Stop Scrolling. Start Living.</h2>
          <p>
            We believe the best travel experiences aren't found in 40-page PDFs or generic hotel vouchers. They happen when you stand on a misty mountain ridge at sunrise, sit around a warm bonfire with your best friends, and swim in secret natural waterfall pools known only to local trip captains.
          </p>
          <p>
            That's why every journey on Friendli Tripz starts with your vibe, not an invoice. No accounts, no password fatigue — just effortless discovery, intelligent AI planning, transparent enquiries, and live tracking.
          </p>
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Our Mission</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              To make modern travel planning frictionless, inspiring, and transparent for every group of friends and family.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Our Vision</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              To become South India’s most loved destination platform where travellers discover authentic vibes before booking.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Our Values</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Human connection, local sustainability, real-time transparency, and obsessive focus on traveller happiness.
            </p>
          </div>
        </div>

        {/* About Page Contact Details Strip (Contact Phone + General Contact Email) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-extrabold text-white">Get in Touch with Our Team</h3>
            <p className="text-xs text-slate-400 mt-1">Available for business enquiries, phone consultations, and partnerships.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <a href={`tel:${BRAND_INFO.contactPhone.replace(/[^0-9+]/g, '')}`} className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold hover:text-white transition-colors flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-orange" /> {BRAND_INFO.contactPhone}
            </a>
            <a href={`mailto:${BRAND_INFO.contactEmail}`} className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold hover:text-white transition-colors flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-orange" /> {BRAND_INFO.contactEmail}
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to vibe with us?</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6">Discover handpicked destinations or generate your custom AI itinerary in seconds.</p>
          <Link
            href={ROUTES.DISCOVER}
            className="bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors shadow-button flex items-center gap-2"
          >
            Find Your Vibe <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
