'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight, Compass, Info, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES, NAV_LINKS, PRIMARY_CTA } from '@/lib/routes';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const getIcon = (label: string) => {
    switch (label) {
      case 'Kodaikanal':
        return Compass;
      case 'Contact':
        return Mail;
      case 'Why Friendli':
      case 'About':
      default:
        return Info;
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-brand-warm shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
        <div>
          {/* Menu Header -> / */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-border/60">
            <Link href={ROUTES.HOME} onClick={onClose} className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-brand-navy/10 flex items-center justify-center bg-white">
                <Image
                  src="/logo.jpeg"
                  alt="Friendli Tripz Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  style={{ maxWidth: '32px', maxHeight: '32px' }}
                />
              </div>
              <span className="font-heading font-extrabold text-base text-brand-navy tracking-tight">
                Friendli Tripz
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-brand-navy hover:bg-brand-soft-navy transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {NAV_LINKS.map((link) => {
              const Icon = getIcon(link.label);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl font-semibold text-brand-navy hover:bg-brand-soft-navy transition-colors min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-brand-orange" />
                    <span>{link.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-muted" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Menu Footer CTA -> /customize */}
        <div className="pt-6 border-t border-brand-border/60 space-y-3">
          <Button
            href={PRIMARY_CTA.href}
            variant="primary"
            className="w-full justify-center text-center"
            onClick={onClose}
          >
            {PRIMARY_CTA.label}
          </Button>
          <p className="text-center text-xs text-brand-muted pt-1">
            Travel feels better with friends.
          </p>
        </div>
      </div>
    </div>
  );
};
