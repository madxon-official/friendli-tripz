'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass, Star, Users, ShieldCheck, MessageSquare, ChevronDown } from 'lucide-react';
import { GradientButton } from './GradientButton';
import { GlassSearch } from './GlassSearch';
import {
  DestinationFloatingCard,
  PriceSeatsFloatingCard,
  BookedTodayFloatingBadge,
  AvatarsFloatingBadge,
} from './FloatingCard';
import { StatBadge } from './StatBadge';
import { ROUTES } from '@/lib/routes';

export const HeroSectionV2: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden bg-slate-950 text-white">
      {/* Background Cinematic Visual Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/kodaikanal/kodaikanal-hero.webp"
          alt="Cinematic Travel Background"
          fill
          priority
          className="object-cover opacity-35 scale-105 animate-pulse duration-[10000ms]"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-grow flex flex-col justify-center py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Messaging */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold text-brand-orange-light shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span>Weekend Escapes • Curated Trips • Amazing People</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-white leading-none">
                Travel. <span className="text-brand-orange">Vibe.</span> Repeat.
              </h1>
              <p className="font-heading font-bold text-xl sm:text-2xl text-slate-300 tracking-wide mt-2">
                Stop scrolling. <span className="text-brand-orange underline underline-offset-4 decoration-brand-orange/60">Start living.</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Discover handpicked destinations, travel with amazing people, stay in verified accommodations, and create memories you'll talk about long after the trip ends.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <GradientButton
                href={ROUTES.PACKAGES}
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Trips
              </GradientButton>

              <GradientButton
                href={ROUTES.PLANNER}
                variant="glass"
                size="lg"
                icon={<Compass className="w-4 h-4" />}
              >
                Plan My Trip
              </GradientButton>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBadge
                icon={<Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
                value={4.9}
                prefix=""
                suffix=" Rating"
                label="Google Reviews"
              />

              <StatBadge
                icon={<Users className="w-4 h-4 text-brand-orange" />}
                value={500}
                suffix="+"
                label="Happy Travellers"
              />

              <StatBadge
                icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
                value={100}
                suffix="%"
                label="Secure Booking"
              />

              <StatBadge
                icon={<MessageSquare className="w-4 h-4 text-sky-400" />}
                value={24}
                suffix="/7"
                label="WhatsApp Support"
              />
            </div>
          </motion.div>

          {/* Right Column: Floating Visual Cards */}
          <div className="lg:col-span-5 relative h-[380px] sm:h-[440px] hidden lg:block">
            <DestinationFloatingCard />
            <PriceSeatsFloatingCard />
            <BookedTodayFloatingBadge />
            <div className="absolute bottom-4 right-8 z-20">
              <AvatarsFloatingBadge />
            </div>
          </div>
        </div>

        {/* Search Card Overlay */}
        <div className="mt-10 sm:mt-14 relative z-20 flex justify-center">
          <GlassSearch />
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 text-center flex flex-col items-center gap-1 text-slate-400 text-xs font-semibold animate-bounce mt-4">
        <span>↓ Find your next vibe</span>
      </div>
    </section>
  );
};
