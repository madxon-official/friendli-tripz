'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { GradientButton } from './GradientButton';
import { ROUTES } from '@/lib/routes';

export const CTASection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Container Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy-dark text-white rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-14 md:p-20 overflow-hidden shadow-2xl border border-white/10 text-center"
        >
          {/* Background Ambient Glows & Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,101,0,0.25),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-pattern-route opacity-10 pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-extrabold text-brand-orange-light mb-6 tracking-wide">
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span>JOIN THE COMMUNITY</span>
          </div>

          {/* Headline */}
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-6xl text-white tracking-tight leading-tight max-w-3xl mx-auto mb-4">
            Your next story starts here.
          </h2>

          <p className="font-heading font-bold text-xl sm:text-2xl text-brand-orange mb-8 tracking-wide">
            Travel. Vibe. Repeat.
          </p>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Stop scrolling and start living. Handpicked stays, curated routes, and amazing trip mates are waiting for you.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GradientButton
              href={ROUTES.CUSTOMIZE}
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Join Next Trip
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
        </motion.div>
      </div>
    </section>
  );
};
