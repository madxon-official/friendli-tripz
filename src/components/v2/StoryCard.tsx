'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, MessageCircle, CheckCheck } from 'lucide-react';

interface StoryCardProps {
  name: string;
  location: string;
  avatar: string;
  time: string;
  comment: string;
  rating: number;
  tripName: string;
  index: number;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  name,
  location,
  avatar,
  time,
  comment,
  rating,
  tripName,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
    >
      {/* Header with avatar & info */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-orange/40 shrink-0">
              <Image src={avatar} alt={name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-sm text-brand-navy dark:text-white">
                {name}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">{location} • {tripName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <span>{time}</span>
            <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
          </div>
        </div>

        {/* Chat Bubble Message */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-brand-navy dark:text-slate-200 leading-relaxed relative">
          <p>"{comment}"</p>
        </div>
      </div>

      {/* Footer Rating */}
      <div className="mt-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-amber-400">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
          ))}
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange bg-brand-orange-light px-2 py-0.5 rounded-full">
          Verified Traveller
        </span>
      </div>
    </motion.div>
  );
};
