'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trees, Waves, Flame, Coffee, Car, Leaf, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

interface VibeCardProps {
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  color: string;
  index: number;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Trees,
  Waves,
  Flame,
  Coffee,
  Car,
  Leaf,
  Sparkles,
  Heart,
};

export const VibeCard: React.FC<VibeCardProps> = ({
  title,
  subtitle,
  icon,
  image,
  index,
}) => {
  const IconComponent = iconMap[icon] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all cursor-pointer"
    >
      <Link href={`${ROUTES.PACKAGES}?vibe=${encodeURIComponent(title)}`} className="block w-full h-full">
        {/* Background Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-transparent transition-colors" />

        {/* Top Icon Badge */}
        <div className="absolute top-4 left-4 w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-brand-orange group-hover:border-brand-orange transition-all">
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content Bottom */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-[11px] font-semibold text-brand-orange-light uppercase tracking-wider mb-1">
            {subtitle}
          </p>
          <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center justify-between">
            <span>{title}</span>
            <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </span>
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};
