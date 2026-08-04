'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Sparkles, Compass, ArrowRight } from 'lucide-react';
import { NAV_LINKS, ROUTES } from '@/lib/routes';
import { BrandWordmark } from '@/components/ui/BrandWordmark';
import { Button } from '@/components/ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-slate-950/95 backdrop-blur-2xl text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <Link href={ROUTES.HOME} onClick={onClose} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center">
            <Image src="/friendli/logo.svg" alt="Friendli Tripz" width={32} height={32} />
          </div>
          <BrandWordmark theme="dark" size="sm" showTagline />
        </Link>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-4">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="text-lg font-bold text-slate-200 hover:text-brand-orange py-2 border-b border-slate-800/40 flex items-center justify-between"
          >
            <span>{link.label}</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </Link>
        ))}

        <Link
          href={ROUTES.ENQUIRE}
          onClick={onClose}
          className="text-lg font-bold text-brand-orange py-2 border-b border-slate-800/40 flex items-center justify-between"
        >
          <span>Submit Trip Enquiry</span>
          <ArrowRight className="w-4 h-4 text-brand-orange" />
        </Link>

        <Link
          href={ROUTES.ADMIN}
          onClick={onClose}
          className="text-sm font-semibold text-slate-400 py-2 flex items-center justify-between"
        >
          <span>Admin CMS</span>
        </Link>
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-6 border-t border-slate-800 flex flex-col gap-3 bg-slate-900/60">
        <Button href={ROUTES.PLANNER} variant="primary" size="lg" className="w-full justify-center">
          <Sparkles className="w-4 h-4 mr-2" />
          Start AI Planner
        </Button>
        <Button href={ROUTES.TRACK_BOOKING} variant="outline" size="lg" className="w-full justify-center text-slate-200 border-slate-700">
          <Compass className="w-4 h-4 mr-2 text-brand-orange" />
          Track Booking Status
        </Button>
      </div>
    </div>
  );
};
