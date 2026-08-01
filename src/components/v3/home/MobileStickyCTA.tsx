'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ROUTES, PRIMARY_CTA } from '@/lib/routes';

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero (roughly 100vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-surface-200/60 shadow-elevated px-4 py-3 safe-area-bottom">
            <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
              <div className="min-w-0">
                <p className="text-caption font-bold text-brand-muted uppercase tracking-wider">
                  Starting from
                </p>
                <p className="text-heading-sm font-heading font-extrabold text-brand-navy">
                  ₹6,999<span className="text-caption text-brand-muted font-normal"> /person</span>
                </p>
              </div>

              <Link
                href={PRIMARY_CTA.href}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-body-sm rounded-card shadow-button hover:shadow-button-hover transition-all duration-200 active:scale-[0.97] shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{PRIMARY_CTA.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
