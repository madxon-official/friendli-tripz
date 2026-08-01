'use client';

import React from 'react';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';

interface StickyMobileBookingBarProps {
  price: number;
  packageTitle: string;
  familySlug: string;
}

export const StickyMobileBookingBar: React.FC<StickyMobileBookingBarProps> = ({
  price,
  packageTitle,
  familySlug,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-brand-border/80 px-4 py-3 shadow-2xl transition-all">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div>
          <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block font-mono">
            Starting from
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-brand-navy font-heading">
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-brand-muted font-medium">/ person</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/917603967190?text=${encodeURIComponent(
              `Hi Friendli Tripz! I'd like to book ${packageTitle}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-emerald-100 transition-colors"
            aria-label="Ask on WhatsApp"
          >
            <MessageSquare className="w-5 h-5" />
          </a>

          <Button
            href={`${ROUTES.CUSTOMIZE}?package=${familySlug}`}
            variant="primary"
            size="md"
            className="shadow-md text-xs font-bold"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Join Trip
          </Button>
        </div>
      </div>
    </div>
  );
};
