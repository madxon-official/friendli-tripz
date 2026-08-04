'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { BrandWordmark } from '@/components/ui/BrandWordmark';
import { BRAND_INFO } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';
import { Heart, Instagram, Youtube, MessageSquare, Mail, Phone, ShieldCheck } from 'lucide-react';
import { FooterColumn } from '@/components/v2/FooterColumn';

export const Footer: React.FC = () => {
  const exploreLinks = [
    { label: 'Destinations', href: ROUTES.DESTINATIONS },
    { label: 'Experiences', href: ROUTES.EXPERIENCES },
    { label: 'Trip Packages', href: ROUTES.PACKAGES },
    { label: 'Custom Group Trips', href: ROUTES.PLANNER },
    { label: 'Track Booking', href: ROUTES.TRACK_TRIP },
  ];

  const resourceLinks = [
    { label: 'About Us', href: ROUTES.ABOUT },
    { label: 'Travel Blogs', href: ROUTES.BLOGS },
    { label: 'Trip FAQs', href: ROUTES.FAQS },
    { label: 'Traveller Reviews', href: ROUTES.REVIEWS },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: ROUTES.PRIVACY_POLICY },
    { label: 'Terms of Service', href: ROUTES.TERMS },
    { label: 'Cancellation Policy', href: ROUTES.CANCELLATION_POLICY },
  ];

  return (
    <footer className="bg-slate-950 text-white pt-14 pb-10 border-t border-slate-800/80">
      <Container>
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-slate-800/80">
          {/* Brand Lockup Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-md shrink-0 flex items-center justify-center">
                <Image
                  src="/friendli/logo.svg"
                  alt="Friendli Tripz Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <BrandWordmark
                theme="dark"
                size="lg"
                showTagline
              />
            </Link>

            <p className="text-slate-400 font-medium text-xs leading-relaxed max-w-sm">
              We make travelling together simpler, more social, and more memorable. Curated group trips, verified stay partners, and unforgettable vibes.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={BRAND_INFO.instagramUrl || 'https://instagram.com/friendlitripz'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-orange hover:border-brand-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href={BRAND_INFO.whatsappUrl || 'https://wa.me/919430187000'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>

              <a
                href={BRAND_INFO.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Nav Columns (7 cols total) */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-6">
            <FooterColumn title="Explore" links={exploreLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />
            <FooterColumn title="Policies" links={legalLinks} />
          </div>
        </div>

        {/* Contact Strip & Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-6">
            <a href={`tel:${BRAND_INFO.contactPhone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-brand-orange" />
              <span>{BRAND_INFO.contactPhone}</span>
            </a>

            <a href={`mailto:${BRAND_INFO.contactEmail}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-brand-orange" />
              <span>{BRAND_INFO.contactEmail}</span>
            </a>

            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Verified Trips</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>© {new Date().getFullYear()} Friendli Tripz. Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for travellers</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
