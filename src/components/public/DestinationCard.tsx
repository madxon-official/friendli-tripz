import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mountain, ArrowRight, Compass } from 'lucide-react';
import { DestinationRecord } from '@/lib/repositories/destinationRepository';
import { resolveDestinationImage, formatINR } from '@/lib/utils/imageResolver';

interface DestinationCardProps {
  destination: DestinationRecord;
  experienceCount?: number;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, experienceCount = 4 }) => {
  const heroAsset = destination.gallery?.find((g) => g.image_type === 'hero');
  const heroImage = resolveDestinationImage(heroAsset?.image || heroAsset?.image_url, destination.slug);

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-elevated hover:-translate-y-1.5">
      <div>
        {/* Hero Image Container */}
        <div className="relative h-64 w-full overflow-hidden bg-slate-950">
          <Image
            src={heroImage}
            alt={destination.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-semibold px-3 py-1 rounded-full text-brand-orange flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5" />
            {destination.elevation}
          </span>

          <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-slate-300 text-xs font-mono px-2.5 py-1 rounded-md border border-slate-800">
            Best: {destination.best_season}
          </span>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-3">
          <div>
            <h3 className="text-2xl font-extrabold text-white group-hover:text-brand-orange transition-colors">
              {destination.name}
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">{destination.tagline}</p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
            {destination.overview}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <Compass className="w-3.5 h-3.5 text-brand-orange" />
              {experienceCount} Curated Experiences
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="p-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Starting Rate</span>
          <span className="text-lg font-extrabold text-white">{formatINR(destination.starting_price)}</span>
        </div>

        <Link
          href={`/destinations/${destination.slug}`}
          className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-button"
        >
          <span>Explore Destination</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
