'use client';

import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from './Badge';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  actionText?: string;
  actionHref?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  centered = false,
  actionText,
  actionHref,
  size = 'md',
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        'mb-10 sm:mb-14',
        centered ? 'text-center max-w-3xl mx-auto' : 'flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4',
        className
      )}
    >
      <div className={clsx(centered && 'space-y-3', !centered && 'space-y-2')}>
        {badge && (
          <Badge variant="brand" size="xs">
            {badge}
          </Badge>
        )}
        <h2
          className={clsx(
            'font-heading font-extrabold text-brand-navy tracking-tight',
            size === 'sm' && 'text-heading-lg sm:text-heading-xl',
            size === 'md' && 'text-heading-xl sm:text-display',
            size === 'lg' && 'text-display sm:text-display-lg'
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={clsx(
              'text-brand-muted leading-relaxed',
              size === 'sm' && 'text-body-sm max-w-lg',
              size === 'md' && 'text-body-sm sm:text-body max-w-2xl',
              size === 'lg' && 'text-body sm:text-body-lg max-w-2xl',
              centered && 'mx-auto'
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actionText && actionHref && !centered && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-body-sm font-bold text-brand-orange hover:text-brand-orange-hover transition-colors whitespace-nowrap group"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}

      {actionText && actionHref && centered && (
        <div className="mt-4">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 text-body-sm font-bold text-brand-orange hover:text-brand-orange-hover transition-colors group"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </motion.div>
  );
}
