'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/v3/ui/Container';
import { SectionHeading } from '@/components/v3/ui/SectionHeading';
import { VIBE_CATEGORIES } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';

function VibeCard({
  title,
  subtitle,
  image,
  color,
  index,
}: {
  title: string;
  subtitle: string;
  image: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`${ROUTES.PACKAGES}?vibe=${encodeURIComponent(title)}`}
        className="group relative block aspect-[3/4] sm:aspect-square rounded-card-lg overflow-hidden card-interactive"
      >
        {/* Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out-expo"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent" />

        {/* Color tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
          <h3 className="text-body-sm sm:text-body font-heading font-extrabold text-white leading-tight">
            {title}
          </h3>
          <p className="text-caption text-white/70 mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function FindYourVibeSection() {
  return (
    <section className="py-section-sm sm:py-section bg-white border-b border-surface-200/40">
      <Container>
        <SectionHeading
          badge="PICK THE FEELING"
          title="Find Your Vibe"
          subtitle="Choose how you want to feel. We'll handle the stays, routes, and good company."
          actionText="View all vibes"
          actionHref={ROUTES.PACKAGES}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {VIBE_CATEGORIES.map((vibe, index) => (
            <VibeCard
              key={vibe.id}
              title={vibe.title}
              subtitle={vibe.subtitle}
              image={vibe.image}
              color={vibe.color}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
