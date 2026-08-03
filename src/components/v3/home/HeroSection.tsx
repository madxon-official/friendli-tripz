'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronDown, MapPin, Users, Star } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { GlassCard } from '@/components/v3/ui/GlassCard';
import { AnimatedCounter } from '@/components/v3/ui/AnimatedCounter';
import { GradientButton } from '@/components/v3/ui/GradientButton';
import { ROUTES } from '@/lib/routes';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1600&q=80"
          alt="Misty mountains of Kodaikanal"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-hero" />
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-pattern-dots opacity-10" />
      </div>

      {/* Content */}
      <Container className="relative z-10 text-center py-32 sm:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-badge bg-white/10 backdrop-blur-md border border-white/20 text-white text-caption font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              Curated Group Travel Experiences
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-display-lg sm:text-display-xl text-white leading-[1.05]"
          >
            Travel. Vibe.{' '}
            <span className="text-gradient-warm inline-block">Repeat.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-body-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Stop scrolling. Start living. Discover curated trips with handpicked stays, great company, and zero planning stress.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <GradientButton
              href={ROUTES.PACKAGES}
              variant="orange"
              size="lg"
              glow
            >
              Explore Trips
            </GradientButton>

            <GradientButton
              href={ROUTES.PLANNER}
              variant="glass"
              size="lg"
              icon={<MapPin className="w-4 h-4" />}
            >
              Plan My Trip
            </GradientButton>
          </motion.div>
        </motion.div>

        {/* Floating Stat Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-14"
        >
          {[
            { icon: MapPin, label: 'Destinations', value: 12, suffix: '+' },
            { icon: Users, label: 'Happy Travellers', value: 2400, suffix: '+' },
            { icon: Star, label: 'Avg Rating', value: 4.9, suffix: '', isDecimal: true },
          ].map((stat) => (
            <GlassCard
              key={stat.label}
              variant="dark"
              padding="sm"
              className="flex items-center gap-3 px-5 py-3 hover-lift cursor-default"
            >
              <div className="w-9 h-9 rounded-button bg-brand-orange/20 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-brand-orange" />
              </div>
              <div>
                <div className="text-heading-sm font-heading font-extrabold text-white tabular-nums">
                  {stat.isDecimal ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : (
                    <AnimatedCounter end={stat.value as number} suffix={stat.suffix} className="" />
                  )}
                </div>
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
