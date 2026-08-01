'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { SectionHeading } from '@/components/v3/ui/SectionHeading';
import { Card } from '@/components/v3/ui/Card';
import { TRAVELLER_STORIES } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';

function StoryCard({
  name,
  location,
  comment,
  rating,
  tripName,
  index,
}: (typeof TRAVELLER_STORIES)[number] & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card variant="elevated" padding="lg" className="h-full relative group hover:shadow-card-hover transition-shadow">
        {/* Quote icon */}
        <div className="absolute top-4 right-4">
          <Quote className="w-8 h-8 text-brand-orange/10 group-hover:text-brand-orange/20 transition-colors" />
        </div>

        <div className="space-y-4">
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>

          {/* Comment */}
          <p className="text-body-sm text-brand-text leading-relaxed">
            &ldquo;{comment}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pt-3 border-t border-surface-200/60">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-brand-navy flex items-center justify-center text-white font-heading font-extrabold text-body-sm">
              {name.charAt(0)}
            </div>
            <div>
              <div className="text-body-sm font-bold text-brand-navy">{name}</div>
              <div className="text-caption text-brand-muted">
                {location} · {tripName}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function StoriesSection() {
  return (
    <section className="py-section-sm sm:py-section bg-surface-50 border-b border-surface-200/40">
      <Container>
        <SectionHeading
          badge="TRAVELLER REVIEWS"
          title="Stories Worth Sharing"
          subtitle="Words from the Friendli Fam. Here's what travellers have to say."
          actionText="Read all stories"
          actionHref={ROUTES.REVIEWS}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRAVELLER_STORIES.map((story, index) => (
            <StoryCard key={story.id} {...story} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
