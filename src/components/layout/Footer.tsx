'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { BRAND_INFO } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';
import { Heart, Instagram, Youtube, MessageSquare, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { FooterColumn } from '@/components/v2/FooterColumn';

export const Footer: React.FC = () => {
  const exploreLinks = [
    { label: 'Top Destinations', href: ROUTES.DESTINATIONS },
    { label: 'Curated Experiences', href: ROUTES.ACTIVITIES },
    { label: 'Weekend Escapes', href: ROUTES.PACKAGES, badge: 'Popular' },
    { label: 'Private Group Trips', href: ROUTES.CUSTOMIZE },
    { label: 'All Trip Packages', href: ROUTES.PACKAGES },
  ];

  const tripsLinks = [
    { label: 'Upcoming Departures', href: '#upcoming' },
    { label: 'Trending Escapes', href: ROUTES.PACKAGES, badge: 'Hot' },
    { label: 'Kodaikanal Escape', href: ROUTES.KODAIKANAL },
    { label: 'Custom Planner', href: ROUTES.PLANNER },
  ];

  const communityLinks = [
    { label: 'Captured Gallery', href: '#gallery' },
    { label: 'Traveller Stories', href: ROUTES.REVIEWS, badge: '4.9 ★' },
    { label: 'Travel Blogs & Guides', href: ROUTES.BLOGS },
    { label: 'Trip FAQs', href: ROUTES.FAQS },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: ROUTES.PRIVACY_POLICY },
    { label: 'Terms of Service', href: ROUTES.TERMS },
    { label: 'Cancellation Policy', href: ROUTES.CANCELLATION_POLICY },
    { label: 'Track Booking', href: ROUTES.TRACK_TRIP },
  ];

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <Container>
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Lockup Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-md shrink-0 flex items-center justify-center">
                <Image
                  src="/logo.jpeg"
                  alt="Friendli Tripz Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-lg"
                  style={{ maxWidth: '40px', maxHeight: '40px' }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  Friendli Tripz
                </span>
                <span className="text-[10px] font-extrabold text-brand-orange uppercase tracking-wider">
                  Travel. Vibe. Repeat.
                </span>
              </div>
            </Link>

            <p className="text-slate-300 font-medium text-sm leading-relaxed max-w-sm">
              We make travelling together simpler, more social and more memorable. Discover curated trips, verified stays, and amazing people.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND_INFO.instagramUrl || 'https://instagram.com/friendlitripz'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-brand-orange hover:border-brand-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={BRAND_INFO.whatsappUrl || 'https://wa.me/919430187000'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-400 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Columns (8 cols total) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <FooterColumn title="Explore" links={exploreLinks} />
            <FooterColumn title="Trips" links={tripsLinks} />
            <FooterColumn title="Community" links={communityLinks} />
            <FooterColumn title="Legal & Track" links={legalLinks} />
          </div>
        </div>

        {/* Contact Strip & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-6">
            <a href="tel:+919430187000" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-brand-orange" />
              <span>+91 94301 87000</span>
            </a>

            <a href="mailto:hello@friendlitripz.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-brand-orange" />
              <span>hello@friendlitripz.com</span>
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
