'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Calendar, Users, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

interface TripCardProps {
  slug: string;
  name: string;
  location: string;
  duration: string;
  price: string;
  rating: string;
  reviewsCount: string;
  nextDeparture: string;
  seatsLeft: string;
  image: string;
  badge?: string | null;
  index: number;
}

export const TripCard: React.FC<TripCardProps> = ({
  slug,
  name,
  location,
  duration,
  price,
  rating,
  reviewsCount,
  nextDeparture,
  seatsLeft,
  image,
  badge,
  index,
}) => {
  const tripUrl = slug === 'misty-kodaikanal-escape' ? ROUTES.KODAIKANAL : `${ROUTES.PACKAGES}/${slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {badge ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-brand-orange text-white shadow-md">
              {badge}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/40 backdrop-blur-md text-white border border-white/20">
              Verified Stay
            </span>
          )}

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
            <span className="text-[10px] font-normal text-slate-300">({reviewsCount})</span>
          </div>
        </div>

        {/* Location overlay bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-white font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
          <span>{location}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{duration}</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[11px]">
              {seatsLeft}
            </span>
          </div>

          <h3 className="font-heading font-extrabold text-lg text-brand-navy dark:text-white group-hover:text-brand-orange transition-colors">
            {name}
          </h3>
        </div>

        {/* Departure info */}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <Calendar className="w-4 h-4 text-brand-orange shrink-0" />
          <span>Next Departure: <strong className="text-brand-navy dark:text-white">{nextDeparture}</strong></span>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting at</span>
            <span className="font-heading font-extrabold text-xl text-brand-navy dark:text-white">
              {price}
            </span>
          </div>

          <Link
            href={tripUrl}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-orange text-white font-bold text-xs transition-all shadow-md group-hover:shadow-lg"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
