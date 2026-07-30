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
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={packageItem.hero_banner_url || 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0'}
          alt={packageItem.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Package
          </span>
          <WishlistButton packageFamilyId={packageItem.family_id} initialIsWishlisted={packageItem.is_wishlisted} />
        </div>

        {/* Bottom Destination & Duration Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium z-10">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{packageItem.destination_name}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{packageItem.duration_days}D / {packageItem.duration_nights}N</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{packageItem.rating || 4.8}</span>
              <span className="text-slate-400 font-normal">({packageItem.review_count || 24} reviews)</span>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
              {packageItem.travel_difficulty || 'easy'}
            </span>
          </div>

          <Link href={`/packages/${packageItem.family_slug}`}>
            <h3 className="font-heading font-bold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
              {packageItem.title}
            </h3>
          </Link>

          {/* Key Inclusions Preview */}
          {packageItem.inclusions_preview && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {packageItem.inclusions_preview.slice(0, 3).map((inc, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  {inc}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Starting from</span>
            <span className="text-lg font-bold text-slate-900">
              ₹{packageItem.starting_price.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-500"> / person</span>
            </span>
          </div>

          <Link
            href={`/packages/${packageItem.family_slug}`}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-medium text-xs transition-colors shadow-sm"
          >
            Explore Trip
          </Link>
        </div>
      </div>
    </div>
  );
};
