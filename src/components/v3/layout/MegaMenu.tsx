'use client';

import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/v3/ui/Container';
import { MEGA_MENU_DATA } from '@/lib/routes';

interface V3MegaMenuProps {
  activeMenu: keyof typeof MEGA_MENU_DATA | null;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function V3MegaMenu({ activeMenu, onClose, onMouseEnter, onMouseLeave }: V3MegaMenuProps) {
  if (!activeMenu) return null;

  const menuData = MEGA_MENU_DATA[activeMenu];
  if (!menuData) return null;

  return (
    <AnimatePresence>
      {activeMenu && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-surface-200/60 shadow-elevated"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Container className="py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Left: Title & Tagline */}
              <div className="col-span-3 space-y-3 border-r border-surface-200/60 pr-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-orange" />
                  <span className="text-overline text-brand-orange uppercase">
                    {activeMenu}
                  </span>
                </div>
                <h3 className="text-heading font-heading font-extrabold text-brand-navy">
                  {menuData.title}
                </h3>
                <p className="text-body-sm text-brand-muted leading-relaxed">
                  {menuData.tagline}
                </p>
              </div>

              {/* Right: Menu Items Grid */}
              <div className="col-span-9">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {menuData.items.map((item, idx) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-start gap-3 p-4 rounded-card hover:bg-surface-50 transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-button bg-brand-soft-orange/50 flex items-center justify-center text-brand-orange shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-all duration-200">
                        <span className="text-caption font-extrabold">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-body-sm font-bold text-brand-navy group-hover:text-brand-orange transition-colors">
                            {item.name}
                          </span>
                          {'badge' in item && item.badge && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-badge bg-brand-soft-orange text-brand-orange">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-caption text-brand-muted line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-brand-muted/0 group-hover:text-brand-orange shrink-0 mt-1 transition-all duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
