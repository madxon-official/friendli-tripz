'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Camera, Maximize2, Layers } from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/lib/types/gallery';
import { GalleryLightbox } from '@/components/v3/gallery/GalleryLightbox';

interface DestinationGalleryProps {
  items: GalleryItem[];
  destinationName: string;
}

const CATEGORY_TABS: { label: string; value: GalleryCategory | 'all' }[] = [
  { label: 'All Photos', value: 'all' },
  { label: 'Attractions', value: 'attractions' },
  { label: 'Food & Dining', value: 'food' },
  { label: 'Stays', value: 'stay' },
  { label: 'Activities', value: 'activities' },
  { label: 'Seasonal View', value: 'seasonal' },
];

export function DestinationGallery({ items, destinationName }: DestinationGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const count =
            tab.value === 'all'
              ? items.length
              : items.filter((i) => i.category === tab.value).length;

          if (count === 0 && tab.value !== 'all') return null;

          const isActive = activeCategory === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={`px-4 py-2 rounded-xl font-heading text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-brand-navy text-white shadow-md shadow-brand-navy/15 scale-105'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200 hover:text-surface-900'
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface-200 text-surface-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Responsive Image Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-surface-50 rounded-3xl p-12 text-center border border-surface-200/60 space-y-2">
          <Layers className="w-8 h-8 text-surface-400 mx-auto" />
          <h4 className="text-body-md font-bold text-surface-700">No photos in this category yet</h4>
          <p className="text-caption text-surface-500">Select another tab to explore {destinationName}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setLightboxIndex(idx)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-100 border border-surface-200/60 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Image
                src={item.public_url}
                alt={item.alt_text || item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                placeholder={item.blur_placeholder ? 'blur' : 'empty'}
                blurDataURL={item.blur_placeholder || undefined}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-heading font-bold text-sm line-clamp-1">
                    {item.title}
                  </h4>
                  {item.photographer && (
                    <div className="flex items-center gap-1 text-white/70 text-[11px]">
                      <Camera className="w-3 h-3" />
                      <span>{item.photographer}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <GalleryLightbox
        items={filteredItems}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
}
