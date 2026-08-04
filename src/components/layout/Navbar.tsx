'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Sparkles, Compass } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BrandWordmark } from '@/components/ui/BrandWordmark';
import { ROUTES, NAV_LINKS } from '@/lib/routes';
import { MobileMenu } from './MobileMenu';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
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
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-lg py-3 text-white'
            : 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50 py-3.5 sm:py-4 text-white'
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
            <BrandWordmark theme="dark" size="md" showTagline />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-1 py-1"
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={ROUTES.TRACK_BOOKING}
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700/60 hover:border-slate-500 bg-slate-900/40"
            >
              <Compass className="w-3.5 h-3.5 text-brand-orange" />
              <span>Track Booking</span>
            </Link>

            <Button
              href={ROUTES.PLANNER}
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Start AI Planner
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 rounded-xl lg:hidden text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Open main menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
