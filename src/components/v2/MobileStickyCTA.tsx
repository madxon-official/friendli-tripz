'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquare } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { BRAND_INFO } from '@/lib/data/trips';

export const MobileStickyCTA: React.FC = () => {
  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href={BRAND_INFO.whatsappUrl || 'https://wa.me/919430187000'}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-emerald-500 text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border border-emerald-400/50"
        aria-label="WhatsApp Support"
      >
        <MessageSquare className="w-6 h-6 fill-white text-emerald-500" />
      </a>

      {/* Bottom Sticky CTA Bar (Mobile only) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 p-3 lg:hidden shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange">
            Next Departure: 15 May
          </span>
          <span className="font-heading font-extrabold text-sm text-brand-navy dark:text-white">
            ₹8,999 <span className="text-[10px] font-normal text-slate-500">per person</span>
          </span>
        </div>

        <Link
          href={ROUTES.CUSTOMIZE}
          className="flex-1 max-w-[200px] bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg shadow-brand-orange/25 flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
        >
          <span>Find My Vibe</span>
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>
    </>
  );
};
