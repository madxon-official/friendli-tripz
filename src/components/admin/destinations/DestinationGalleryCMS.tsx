'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Star, Move, Tag, Check, Image as ImageIcon } from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/lib/types/gallery';
import { Button } from '@/components/ui/Button';

interface DestinationGalleryCMSProps {
  destinationId: string;
  destinationName: string;
  initialItems: GalleryItem[];
}

export function DestinationGalleryCMS({
  destinationName,
  initialItems,
}: DestinationGalleryCMSProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<GalleryCategory | 'all'>('all');
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const filteredItems =
    activeCategoryFilter === 'all'
      ? items
      : items.filter((i) => i.category === activeCategoryFilter);

  const handleToggleFeatured = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_featured: !item.is_featured } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-sm">
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4" />
            Media Management Engine
          </div>
          <h2 className="text-xl font-heading font-extrabold text-slate-900">
            {destinationName} Photo Gallery & Assets
          </h2>
        </div>

        <Button variant="primary" size="sm" icon={<Upload className="w-4 h-4" />}>
          Upload New Photos
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['all', 'hero', 'cover', 'attractions', 'food', 'stay', 'activities', 'seasonal'] as const).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold capitalize whitespace-nowrap transition-all ${
                activeCategoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 space-y-2 p-2 transition-all hover:shadow-md"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200">
              <Image
                src={item.public_url}
                alt={item.alt_text}
                fill
                sizes="250px"
                className="object-cover"
              />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono capitalize">
                  {item.category}
                </span>
              </div>

              {/* Quick Action Controls */}
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggleFeatured(item.id)}
                  title="Toggle Featured Image"
                  className={`p-1.5 rounded-lg text-white transition-colors ${
                    item.is_featured ? 'bg-amber-500' : 'bg-slate-900/70 hover:bg-amber-500'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  title="Delete Image"
                  className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Metadata Brief */}
            <div className="p-2 space-y-1">
              <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Order: {item.display_order}</span>
                <span>{item.photographer || 'Standard'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
