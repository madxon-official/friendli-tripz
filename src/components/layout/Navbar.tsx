'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ROUTES, NAV_LINKS, PRIMARY_CTA } from '@/lib/routes';
import { MobileMenu } from './MobileMenu';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-warm/95 backdrop-blur-md border-b border-brand-border/50 transition-all">
        <Container className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Lockup -> / */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden shadow-sm border border-brand-navy/10 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center bg-white">
              <Image
                src="/logo.jpeg"
                alt="Friendli Tripz Logo"
                width={36}
                height={36}
                priority
                className="w-full h-full object-cover"
                style={{ maxWidth: '36px', maxHeight: '36px' }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base sm:text-lg text-brand-navy tracking-tight leading-none">
                Friendli Tripz
              </span>
              <span className="text-[9px] font-bold text-brand-orange uppercase tracking-wider mt-0.5">
                Social Travel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-brand-navy hover:text-brand-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Primary CTA -> /customize */}
          <div className="hidden lg:flex items-center">
            <Button
              href={PRIMARY_CTA.href}
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {PRIMARY_CTA.label}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-brand-navy hover:bg-brand-soft-navy transition-colors lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open main menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
