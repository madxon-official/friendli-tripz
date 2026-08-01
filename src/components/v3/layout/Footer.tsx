import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/v3/ui/Container';
import { BRAND_INFO } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';
import { Heart, Instagram, Youtube, MessageSquare, Mail, Phone, ArrowRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

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
        { label: 'Top Destinations', href: ROUTES.DESTINATIONS },
        { label: 'Curated Experiences', href: ROUTES.ACTIVITIES },
        { label: 'Weekend Escapes', href: ROUTES.PACKAGES, badge: 'Popular' },
        { label: 'Custom Group Trips', href: ROUTES.CUSTOMIZE },
        { label: 'All Packages', href: ROUTES.PACKAGES },
      ],
    },
    {
      title: 'Trips',
      links: [
        { label: 'Upcoming Departures', href: '#upcoming' },
        { label: 'Trending Escapes', href: ROUTES.PACKAGES, badge: 'Hot' },
        { label: 'Kodaikanal Escape', href: ROUTES.KODAIKANAL },
        { label: 'AI Trip Planner', href: ROUTES.PLANNER },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Photo Gallery', href: '#gallery' },
        { label: 'Traveller Stories', href: ROUTES.REVIEWS, badge: '4.9 ★' },
        { label: 'Travel Blog', href: ROUTES.BLOGS },
        { label: 'Trip FAQs', href: ROUTES.FAQS },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: ROUTES.PRIVACY_POLICY },
        { label: 'Terms of Service', href: ROUTES.TERMS },
        { label: 'Cancellation Policy', href: ROUTES.CANCELLATION_POLICY },
        { label: 'Track Booking', href: ROUTES.TRACK_TRIP },
      ],
    },
  ];

  return (
    <footer className="bg-surface-950 text-white" role="contentinfo">
      {/* Newsletter / CTA Strip */}
      <div className="border-b border-white/5">
        <Container className="py-10 sm:py-14">
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
      <Container className="py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white p-0.5 shadow-md shrink-0">
                <Image
                  src="/logo.jpeg"
                  alt=""
                  width={44}
                  height={44}
                  className="w-full h-full object-cover rounded-lg"
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

            <p className="text-body-sm text-slate-300 leading-relaxed max-w-sm">
              We make travelling together simpler, more social, and more memorable. Curated trips, verified stays, amazing people.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: BRAND_INFO.instagramUrl, label: 'Instagram', hoverColor: 'hover:text-brand-orange hover:border-brand-orange' },
                { icon: MessageSquare, href: BRAND_INFO.whatsappUrl, label: 'WhatsApp', hoverColor: 'hover:text-emerald-400 hover:border-emerald-400' },
                { icon: Youtube, href: 'https://youtube.com', label: 'YouTube', hoverColor: 'hover:text-rose-500 hover:border-rose-500' },
              ].map(({ icon: Icon, href, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-button bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-200 ${hoverColor}`}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {columns.map((col) => (
              <FooterColumn key={col.title} {...col} />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-caption text-slate-400">
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
