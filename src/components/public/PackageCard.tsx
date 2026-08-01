'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, Star, CheckCircle, Sparkles } from 'lucide-react';
import { PackageCardItem } from '@/lib/types/discovery';
import { WishlistButton } from './WishlistButton';

interface PackageCardProps {
  packageItem: PackageCardItem;
}

export const PackageCard: React.FC<PackageCardProps> = ({ packageItem }) => {
  return (
    <div className="group bg-white rounded-3xl border border-brand-border/60 overflow-hidden shadow-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-soft-navy">
        <Image
          src={packageItem.hero_banner_url || 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0'}
          alt={packageItem.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-brand-orange text-white backdrop-blur-md shadow-md uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Verified Escape
          </span>
          <WishlistButton packageFamilyId={packageItem.family_id} initialIsWishlisted={packageItem.is_wishlisted} />
        </div>

        {/* Bottom Destination & Duration Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold z-10">
          <div className="flex items-center gap-1 bg-brand-navy/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
            <span>{packageItem.destination_name}</span>
          </div>
          <div className="flex items-center gap-1 bg-brand-navy/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <Clock className="w-3.5 h-3.5 text-brand-orange" />
            <span>{packageItem.duration_days}D / {packageItem.duration_nights}N</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{packageItem.rating || 4.9}</span>
              <span className="text-brand-muted font-normal">({packageItem.review_count || 48} reviews)</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-soft-navy text-brand-navy">
              {packageItem.travel_difficulty || 'easy'}
            </span>
          </div>

          <Link href={`/packages/${packageItem.family_slug}`}>
            <h3 className="font-heading font-black text-brand-navy text-lg leading-snug group-hover:text-brand-orange transition-colors line-clamp-2">
              {packageItem.title}
            </h3>
          </Link>

          {/* Key Inclusions Preview */}
          {packageItem.inclusions_preview && (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {packageItem.inclusions_preview.slice(0, 3).map((inc, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-[11px] text-brand-navy/80 bg-brand-soft-navy/50 px-2.5 py-1 rounded-md border border-brand-border/40 font-medium">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  {inc}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Pricing & CTA */}
        <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-brand-muted uppercase font-mono tracking-wider block font-semibold">Starting from</span>
            <span className="text-xl font-black text-brand-navy font-heading">
              ₹{packageItem.starting_price.toLocaleString('en-IN')}
              <span className="text-xs font-medium text-brand-muted"> / person</span>
            </span>
          </div>

          <Link
            href={`/packages/${packageItem.family_slug}`}
            className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-orange text-white font-bold text-xs transition-colors shadow-md flex items-center gap-1 min-h-[44px]"
          >
            Explore Trip
          </Link>
        </div>
      </div>
    </div>
  );
};
