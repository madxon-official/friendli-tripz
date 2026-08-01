'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Instagram, Heart } from 'lucide-react';

interface GalleryCardProps {
  type: string;
  title: string;
  author: string;
  thumbnail: string;
  aspect?: string;
  index: number;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  type,
  title,
  author,
  thumbnail,
  aspect = 'aspect-square',
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all cursor-pointer ${aspect}`}
    >
      <Image
        src={thumbnail}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

      {/* Video Overlay Icon */}
      {type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-brand-orange/90 backdrop-blur-md text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Top Tag */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white">
        <Instagram className="w-3.5 h-3.5 text-brand-orange" />
        <span>{author}</span>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-white/90 line-clamp-1">{title}</p>
          <span className="text-[10px] text-slate-300 font-medium">Captured on Friendli Trip</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-3.5 h-3.5 fill-rose-400" />
        </div>
      </div>
    </motion.div>
  );
};
