'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { GalleryItem } from '@/lib/types/gallery';
import { Badge } from '@/components/v3/ui/Badge';

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const currentItem = items[currentIndex];

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-label={`Photo view: ${currentItem.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300"
    >
      {/* Top Header Control */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <Badge variant="brand" size="sm" className="capitalize">
            {currentItem.category}
          </Badge>
          <span className="text-white/70 font-mono text-xs font-semibold">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image View */}
      <div className="relative w-full h-full max-w-6xl max-h-[85vh] p-4 flex items-center justify-center">
        <Image
          src={currentItem.public_url}
          alt={currentItem.alt_text || currentItem.title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          placeholder={currentItem.blur_placeholder ? 'blur' : 'empty'}
          blurDataURL={currentItem.blur_placeholder || undefined}
          className="object-contain"
        />
      </div>

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Image"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Image"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom Metadata Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
        <div className="max-w-4xl mx-auto space-y-1 text-center sm:text-left">
          <h3 className="text-white font-heading font-bold text-lg sm:text-xl">
            {currentItem.title}
          </h3>
          {currentItem.caption && (
            <p className="text-white/70 text-xs sm:text-sm">{currentItem.caption}</p>
          )}
          {currentItem.photographer && (
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-white/50 text-xs pt-1">
              <Camera className="w-3.5 h-3.5" />
              <span>Photo by {currentItem.photographer}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
