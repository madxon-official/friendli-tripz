import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/v3/ui/Container';
import { SectionHeading } from '@/components/v3/ui/SectionHeading';
import { GALLERY_ITEMS } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';
import { Play } from 'lucide-react';

export function GallerySection() {
  return (
    <section id="gallery" className="py-section-sm sm:py-section bg-white border-b border-surface-200/40">
      <Container>
        <SectionHeading
          badge="UNFILTERED MOMENTS"
          title="Captured on Friendli"
          subtitle="Real moments. Real people. Tag @friendlitripz to be featured."
          actionText="View gallery"
          actionHref={ROUTES.REVIEWS}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`relative ${item.aspect} rounded-card overflow-hidden group cursor-pointer hover-lift`}
            >
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out-expo"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/60 transition-all duration-300 flex items-end p-3">
                <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <p className="text-caption font-bold text-white line-clamp-2">{item.title}</p>
                  <p className="text-[10px] text-white/60 mt-0.5">{item.author}</p>
                </div>
              </div>

              {/* Video indicator */}
              {item.type === 'video' && (
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="w-3 h-3 text-brand-navy ml-0.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

