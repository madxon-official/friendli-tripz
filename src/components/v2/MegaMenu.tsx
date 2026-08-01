'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MEGA_MENU_DATA } from '@/lib/routes';

interface MegaMenuProps {
  activeMenu: keyof typeof MEGA_MENU_DATA | null;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ activeMenu, onClose }) => {
  if (!activeMenu || !MEGA_MENU_DATA[activeMenu]) return null;

  const data = MEGA_MENU_DATA[activeMenu];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        onMouseLeave={onClose}
        className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800 shadow-2xl z-50 py-8 px-6 hidden lg:block"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-start">
          {/* Header Info Left */}
          <div className="col-span-4 space-y-3 border-r border-slate-100 dark:border-slate-800 pr-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-orange-light text-brand-orange">
              <Sparkles className="w-3 h-3 text-brand-orange" />
              {activeMenu} Overview
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-brand-navy dark:text-white">
              {data.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {data.tagline}
            </p>
          </div>

          {/* Grid Items Right */}
          <div className="col-span-8 grid grid-cols-2 gap-4">
            {data.items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className="group p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-all border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-soft-navy text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-sm text-brand-navy dark:text-white group-hover:text-brand-orange transition-colors">
                      {item.name}
                    </span>
                    {'badge' in item && item.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
