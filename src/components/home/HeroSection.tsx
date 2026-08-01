import React from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, Compass, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BRAND_INFO, KODAIKANAL_TRIP } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-20 overflow-hidden">
      {/* Background Subtle Travel-Route Line Motif */}
      <div className="absolute inset-0 bg-pattern-route opacity-30 pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content Column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-left">
            {/* Eyebrow & Chapter Marker */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="orange" className="uppercase font-extrabold tracking-wider text-xs">
                {BRAND_INFO.badgeTag}
              </Badge>
              <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 items-center text-xs font-mono">
                <Compass className="w-3.5 h-3.5 text-brand-orange" />
                <span>{BRAND_INFO.coordinates}</span>
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight leading-[1.1] text-balance font-heading">
              Kodaikanal hits different with the{' '}
              <span className="relative inline-block text-brand-orange">
                right people.
                <svg
                  className="absolute left-0 bottom-[-4px] w-full h-2 text-brand-orange/30"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path d="M0,0 Q50,12 100,0" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-xl text-brand-muted leading-relaxed max-w-2xl text-balance">
              {KODAIKANAL_TRIP.heroSubheadline}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Button
                href={ROUTES.CUSTOMIZE}
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Join the Trip
              </Button>
              <Button
                href={ROUTES.KODAIKANAL}
                variant="outline"
                size="lg"
              >
                Explore Kodaikanal
              </Button>
            </div>

            {/* Social Proof Counter Bar */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-brand-border/60">
              <div>
                <span className="text-xl sm:text-2xl font-black font-heading text-brand-navy block">
                  1,200+
                </span>
                <span className="text-[11px] font-medium text-brand-muted block">
                  Happy Travellers
                </span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black font-heading text-brand-orange block">
                  4.9★
                </span>
                <span className="text-[11px] font-medium text-brand-muted block">
                  Average Rating
                </span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black font-heading text-brand-navy block">
                  100%
                </span>
                <span className="text-[11px] font-medium text-brand-muted block">
                  Verified Stays
                </span>
              </div>
            </div>

            {/* Trust Line */}
            <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-navy/80">
              <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
              <span>{BRAND_INFO.trustLine}</span>
            </div>
          </div>

          {/* Visual Column (Supplied Local Kodaikanal Photo) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] sm:aspect-[3/4]">
                <Image
                  src={KODAIKANAL_TRIP.heroImage}
                  alt="Authentic Kodaikanal hill road landscape"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
                
                {/* Image Overlay Tag */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-brand-orange uppercase tracking-wider block font-mono">
                        {BRAND_INFO.chapterLabel}
                      </span>
                      <span className="font-heading font-bold text-brand-navy text-base sm:text-lg">
                        Kodaikanal, TN
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-brand-soft-navy text-brand-navy text-xs font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-orange" />
                      <span>The First Escape</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro Annotation */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-white px-4 py-2.5 rounded-xl shadow-card border border-brand-border/60 hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                <span className="text-xs font-bold text-brand-navy font-mono">
                  10.2381° N · Western Ghats
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
