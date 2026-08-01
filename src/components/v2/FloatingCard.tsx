'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, MapPin, TrendingUp, Calendar, Users, ShieldCheck } from 'lucide-react';

export const DestinationFloatingCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute top-4 right-4 sm:right-8 bg-slate-900/85 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl shadow-2xl text-white max-w-[240px] z-20"
    >
      <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5">
        <Image
          src="/images/kodaikanal/kodaikanal-hero.webp"
          alt="Kodaikanal"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium text-white">
          <MapPin className="w-3 h-3 text-brand-orange" />
          Kodaikanal
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-300">Tamil Nadu</p>
          <p className="text-xs font-bold text-white flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            4.9 <span className="text-[10px] font-normal text-slate-400">(243 reviews)</span>
          </p>
        </div>
        <div className="w-7 h-7 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center">
          <span className="text-xs">🌲</span>
        </div>
      </div>
    </motion.div>
  );
};

export const PriceSeatsFloatingCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute bottom-16 left-4 sm:left-6 bg-white/90 backdrop-blur-md border border-slate-200/80 p-4 rounded-2xl shadow-2xl text-brand-navy max-w-[260px] z-20"
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">From</span>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-xl font-extrabold text-brand-navy">₹8,999</span>
            <span className="text-[11px] text-slate-500">per person</span>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-brand-soft-navy text-brand-navy rounded-lg">
          4D / 3N
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-brand-orange" />
          <span>Next: <strong>15 May, 2026</strong></span>
        </div>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          09 Seats Left
        </span>
      </div>
    </motion.div>
  );
};

export const BookedTodayFloatingBadge: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="absolute top-28 left-8 sm:left-12 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 z-20"
    >
      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
        <TrendingUp className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Booked Today</p>
        <p className="text-xs font-extrabold text-brand-navy flex items-center gap-1">
          23 Trips <span className="text-emerald-500 text-[10px]">📈</span>
        </p>
      </div>
    </motion.div>
  );
};

export const AvatarsFloatingBadge: React.FC = () => {
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs"
    >
      <div className="flex -space-x-2">
        {avatars.map((url, index) => (
          <div key={index} className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white">
            <Image src={url} alt="Traveller Avatar" fill className="object-cover" />
          </div>
        ))}
      </div>
      <span className="font-semibold text-[11px] text-slate-200">+127 booked</span>
    </motion.div>
  );
};
