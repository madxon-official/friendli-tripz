'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ChevronDown, User, Sparkles, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BrandWordmark } from '@/components/ui/BrandWordmark';
import { ROUTES, NAV_LINKS, MEGA_MENU_DATA, PRIMARY_CTA } from '@/lib/routes';
import { MobileMenu } from './MobileMenu';
import { MegaMenu } from '@/components/v2/MegaMenu';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<keyof typeof MEGA_MENU_DATA | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Blur / background opacity check
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide on scroll down, reveal on scroll up
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-md py-3'
            : 'bg-transparent text-white py-4'
        }`}
      >
        <Container className="flex items-center justify-between">
          {/* Logo Lockup */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md border border-white/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center bg-white p-0.5">
              <Image
                src="/friendli/logo.svg"
                alt="Friendli Tripz Logo"
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <BrandWordmark
              theme={isScrolled ? 'light' : 'dark'}
              size="md"
              showTagline
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const hasMega = link.hasMegaMenu && link.label in MEGA_MENU_DATA;
              const isMegaOpen = activeMegaMenu === link.label;

              return (
                <div
                  key={link.label}
                  className="relative py-2"
                  onMouseEnter={() => {
                    if (hasMega) setActiveMegaMenu(link.label as keyof typeof MEGA_MENU_DATA);
                  }}
                >
                  <Link
                    href={link.href}
                    className={`text-xs sm:text-sm font-bold transition-colors flex items-center gap-1 ${
                      isScrolled
                        ? 'text-brand-navy dark:text-slate-200 hover:text-brand-orange'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {hasMega && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isMegaOpen ? 'rotate-180 text-brand-orange' : ''
                        }`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={ROUTES.AUTH_LOGIN}
              className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isScrolled
                  ? 'text-brand-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>

            <Button
              href={PRIMARY_CTA.href}
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              {PRIMARY_CTA.label}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`p-2.5 rounded-xl lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${
              isScrolled
                ? 'text-brand-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Open main menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </Container>

        {/* Mega Menu Dropdown */}
        <MegaMenu activeMenu={activeMegaMenu} onClose={() => setActiveMegaMenu(null)} />
      </header>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
