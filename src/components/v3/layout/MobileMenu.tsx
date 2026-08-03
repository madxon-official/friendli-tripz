'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronDown, Sparkles, Phone, Mail, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES, NAV_LINKS, MEGA_MENU_DATA, PRIMARY_CTA } from '@/lib/routes';
import { BRAND_INFO } from '@/lib/data/trips';
import { Button } from '@/components/v3/ui/Button';
import { BrandWordmark } from '@/components/ui/BrandWordmark';

interface V3MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function V3MobileMenu({ isOpen, onClose }: V3MobileMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-brand-navy/30 backdrop-blur-sm z-[60] lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[61] flex flex-col lg:hidden shadow-elevated"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-surface-200/60">
              <Link href={ROUTES.HOME} onClick={onClose} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm p-0.5 border border-surface-200">
                  <Image src="/friendli/logo.svg" alt="Friendli Logo" width={32} height={32} className="w-full h-full object-contain" />
                </div>
                <BrandWordmark
                  theme="light"
                  size="sm"
                  showTagline
                />
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-button text-brand-muted hover:text-brand-text hover:bg-surface-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
              {NAV_LINKS.map((link, idx) => {
                const hasMega = link.hasMegaMenu && link.label in MEGA_MENU_DATA;
                const isExpanded = expandedSection === link.label;

                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    {hasMega ? (
                      <div>
                        <button
                          onClick={() => toggleSection(link.label)}
                          className="w-full flex items-center justify-between px-5 py-3.5 text-body font-bold text-brand-navy hover:bg-surface-50 transition-colors"
                          aria-expanded={isExpanded}
                        >
                          <span>{link.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-brand-muted transition-transform duration-300 ${
                              isExpanded ? 'rotate-180 text-brand-orange' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="bg-surface-50/50"
                            >
                              {MEGA_MENU_DATA[link.label as keyof typeof MEGA_MENU_DATA]?.items.map(
                                (item) => (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-8 py-3 hover:bg-surface-100 transition-colors"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-brand-orange/30 shrink-0" />
                                    <div>
                                      <span className="text-body-sm font-bold text-brand-navy block">
                                        {item.name}
                                      </span>
                                      <span className="text-caption text-brand-muted">
                                        {item.description}
                                      </span>
                                    </div>
                                  </Link>
                                )
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="block px-5 py-3.5 text-body font-bold text-brand-navy hover:bg-surface-50 hover:text-brand-orange transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-surface-200/60 p-5 space-y-4">
              <Button
                href={PRIMARY_CTA.href}
                variant="primary"
                size="lg"
                fullWidth
                icon={<Sparkles className="w-4 h-4" />}
                onClick={onClose}
              >
                {PRIMARY_CTA.label}
              </Button>

              <div className="flex items-center justify-center gap-4 pt-2">
                <a
                  href={`tel:${BRAND_INFO.contactEmail ? '+919430187000' : ''}`}
                  className="p-2.5 rounded-button bg-surface-100 text-brand-muted hover:text-brand-orange transition-colors"
                  aria-label="Call us"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${BRAND_INFO.contactEmail}`}
                  className="p-2.5 rounded-button bg-surface-100 text-brand-muted hover:text-brand-orange transition-colors"
                  aria-label="Email us"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={BRAND_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-button bg-surface-100 text-brand-muted hover:text-brand-orange transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
