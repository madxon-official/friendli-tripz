import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/v3/ui/Container';
import { BrandWordmark } from '@/components/ui/BrandWordmark';
import { BRAND_INFO } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';
import { Heart, Instagram, Youtube, MessageSquare, Mail, Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string; badge?: string }[];
}

function FooterColumn({ title, links }: FooterLinkGroup) {
  return (
    <div>
      <h4 className="text-overline text-white/50 uppercase mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-body-sm text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2 group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
              {link.badge && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-badge bg-brand-orange/20 text-brand-orange">
                  {link.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function V3Footer() {
  const columns: FooterLinkGroup[] = [
    {
      title: 'Explore',
      links: [
        { label: 'Destinations', href: ROUTES.DESTINATIONS },
        { label: 'Experiences', href: ROUTES.EXPERIENCES },
        { label: 'Trip Packages', href: ROUTES.PACKAGES },
        { label: 'Custom Group Trips', href: ROUTES.PLANNER },
        { label: 'Track Booking', href: ROUTES.TRACK_TRIP },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'About Us', href: ROUTES.ABOUT },
        { label: 'Travel Blogs', href: ROUTES.BLOGS },
        { label: 'Trip FAQs', href: ROUTES.FAQS },
        { label: 'Traveller Reviews', href: ROUTES.REVIEWS },
      ],
    },
    {
      title: 'Policies',
      links: [
        { label: 'Privacy Policy', href: ROUTES.PRIVACY_POLICY },
        { label: 'Terms of Service', href: ROUTES.TERMS },
        { label: 'Cancellation Policy', href: ROUTES.CANCELLATION_POLICY },
      ],
    },
  ];

  return (
    <footer className="bg-surface-950 text-white" role="contentinfo">
      {/* Newsletter / CTA Strip */}
      <div className="border-b border-white/5">
        <Container className="py-8 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span className="text-overline text-brand-orange uppercase">Stay Connected</span>
              </div>
              <h3 className="text-heading font-heading font-extrabold text-white">
                Your next escape is one message away
              </h3>
              <p className="text-body-sm text-slate-400 mt-1">
                Reach out on WhatsApp for instant trip planning support.
              </p>
            </div>
            <a
              href={BRAND_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-body-sm rounded-card transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Container>
      </div>

      {/* Main Footer Grid */}
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-white/5">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-md shrink-0">
                <Image
                  src="/friendli/logo.svg"
                  alt="Friendli Logo"
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

            <p className="text-body-sm text-slate-300 leading-relaxed max-w-sm">
              We make travelling together simpler, more social, and more memorable. Curated trips, verified stays, amazing people.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: BRAND_INFO.instagramUrl, label: 'Instagram', hoverColor: 'hover:text-brand-orange hover:border-brand-orange' },
                { icon: MessageSquare, href: BRAND_INFO.whatsappUrl, label: 'WhatsApp', hoverColor: 'hover:text-emerald-400 hover:border-emerald-400' },
                { icon: Youtube, href: BRAND_INFO.youtubeUrl, label: 'YouTube', hoverColor: 'hover:text-rose-500 hover:border-rose-500' },
              ].map(({ icon: Icon, href, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-button bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-200 ${hoverColor}`}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-6">
            {columns.map((col) => (
              <FooterColumn key={col.title} {...col} />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-caption text-slate-400">
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

          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Friendli Tripz. Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for travellers</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
