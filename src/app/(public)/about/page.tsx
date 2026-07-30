import React from 'react';
import Image from 'next/image';
import { ShieldCheck, HeartHandshake, Sparkles, Compass, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us | Friendli Tripz',
  description: 'Learn about Friendli Tripz, India’s first constraint-graph powered social travel platform.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Sparkles className="w-3.5 h-3.5" />
            Social Travel Engine
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Redefining Travel with Constraint AI & Social Connections
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Friendli Tripz bridges natural language traveller preferences with real-time commercial inventory, verified vendor safety, and transparent pricing.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Constraint Graph AI</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              We never generate vague markdown. Our deterministic Constraint Engine recalculates exact route timings, hotel costs, and activity slots.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Verified Safety & Vendors</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Every transport vehicle, driver, and hotel partner is pre-screened with mandatory background checks and compliance audits.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Transparent Pricing</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              No hidden fees or surge pricing. You get a clear breakdown of room rates, transport charges, tax, and included vouchers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
