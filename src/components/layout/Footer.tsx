import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { BRAND_INFO } from '@/lib/data/trips';
import { ROUTES, NAV_LINKS } from '@/lib/routes';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-white pt-14 pb-10 border-t border-brand-navy-light/30">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-10 border-b border-white/10">
          {/* Brand Column -> / */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white p-0.5 shadow-md shrink-0 flex items-center justify-center">
                <Image
                  src="/logo.jpeg"
                  alt="Friendli Tripz Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover rounded-md"
                  style={{ maxWidth: '36px', maxHeight: '36px' }}
                />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                Friendli Tripz
              </span>
            </Link>
            <p className="text-slate-300 font-medium text-base max-w-sm">
              {BRAND_INFO.tagline}
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              We make travelling together simpler, more social and more memorable. Starting with our first chapter, Kodaikanal.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-xs text-brand-orange uppercase tracking-wider font-mono">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Architecture */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-xs text-brand-orange uppercase tracking-wider font-mono">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link
                  href={ROUTES.PRIVACY_POLICY}
                  className="hover:text-slate-100 transition-colors text-slate-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.TERMS}
                  className="hover:text-slate-100 transition-colors text-slate-400"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CANCELLATION_POLICY}
                  className="hover:text-slate-100 transition-colors text-slate-400"
                >
                  Cancellation &amp; Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Friendli Tripz. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Travel feels better with friends</span>
            <Heart className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
          </div>
        </div>
      </Container>
    </footer>
  );
};
