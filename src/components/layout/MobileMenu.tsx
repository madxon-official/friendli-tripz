'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Sparkles, User, ChevronRight, Phone, MessageSquare } from 'lucide-react';
import { ROUTES, NAV_LINKS, PRIMARY_CTA } from '@/lib/routes';
import { BRAND_INFO } from '@/lib/data/trips';
import { Button } from '@/components/ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-slate-950 text-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-slate-800">
        <div>
          {/* Header & Close */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <Link href={ROUTES.HOME} onClick={onClose} className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white p-0.5 shadow-md shrink-0">
                <Image
                  src="/logo.jpeg"
                  alt="Friendli Tripz Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-base text-white">
                  Friendli Tripz
                </span>
                <span className="text-[8px] font-extrabold text-brand-orange uppercase tracking-wider">
                  Travel. Vibe. Repeat.
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="py-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl text-sm font-bold text-slate-200 hover:text-white hover:bg-slate-900 transition-all group"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
              </Link>
            ))}

            <Link
              href={ROUTES.AUTH_LOGIN}
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl text-sm font-bold text-slate-200 hover:text-white hover:bg-slate-900 transition-all group"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-orange" />
                Login
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-orange transition-all" />
            </Link>
          </div>
        </div>

        {/* Bottom CTA & Support */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <Button
            href={PRIMARY_CTA.href}
            variant="primary"
            className="w-full justify-center text-sm py-3"
            onClick={onClose}
            icon={<Sparkles className="w-4 h-4" />}
          >
            {PRIMARY_CTA.label}
          </Button>

          <a
            href={BRAND_INFO.whatsappUrl || 'https://wa.me/919430187000'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-emerald-400 transition-colors py-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>24/7 WhatsApp Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};
