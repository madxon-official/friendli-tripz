'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ChevronDown, Sparkles } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { BrandWordmark } from '@/components/ui/BrandWordmark';
import { Button } from '@/components/v3/ui/Button';
import { ROUTES, NAV_LINKS, MEGA_MENU_DATA, PRIMARY_CTA } from '@/lib/routes';
import { V3MobileMenu } from './MobileMenu';
import { MegaMenu } from './MegaMenu';

export function V3Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<keyof typeof MEGA_MENU_DATA | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
        setActiveMegaMenu(null);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleMegaMenuEnter = (label: string) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    if (label in MEGA_MENU_DATA) {
      setActiveMegaMenu(label as keyof typeof MEGA_MENU_DATA);
    }
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-lg py-3 text-white'
            : 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50 py-3.5 sm:py-4 text-white'
        }`}
        role="banner"
      >
        <Container className="flex items-center justify-between">
          {/* Logo Lockup */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="Friendli Tripz — Home"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md border border-white/20 group-hover:scale-105 transition-transform duration-300 shrink-0 bg-white p-0.5">
              <Image
                src="/friendli/logo.svg"
                alt="Friendli Logo"
                width={40}
                height={40}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <BrandWordmark
              theme="dark"
              size="md"
              showTagline
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const hasMega = link.hasMegaMenu && link.label in MEGA_MENU_DATA;
              const isMegaOpen = activeMegaMenu === link.label;

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (hasMega) handleMegaMenuEnter(link.label);
                  }}
                  onMouseLeave={handleMegaMenuLeave}
                >
                  <Link
                    href={link.href}
                    className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-300 hover:text-brand-orange hover:bg-slate-900/60 ${
                      isMegaOpen ? '!text-brand-orange bg-slate-900' : ''
                    }`}
                  >
                    <span>{link.label}</span>
                    {hasMega && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isMegaOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              href={PRIMARY_CTA.href}
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              {PRIMARY_CTA.label}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 rounded-xl lg:hidden text-slate-200 hover:bg-slate-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
        </Container>

        {/* Mega Menu */}
        <MegaMenu 
          activeMenu={activeMegaMenu} 
          onClose={() => setActiveMegaMenu(null)}
        />
      </header>

      {/* Mobile Menu */}
      <V3MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
