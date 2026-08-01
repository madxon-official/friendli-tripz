'use client';

import React from 'react';
import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

export const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-heading font-extrabold text-xs text-brand-orange uppercase tracking-wider font-mono">
        {title}
      </h3>
      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                  {link.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
