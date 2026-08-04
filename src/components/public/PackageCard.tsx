import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, MessageSquare, Home, Car, Utensils, Sparkles } from 'lucide-react';
import { PackageRecord } from '@/lib/repositories/packageRepository';
import { resolveDestinationImage, formatINR } from '@/lib/utils/imageResolver';
import { ROUTES } from '@/lib/routes';

interface PackageCardProps {
  packageData: PackageRecord;
}

export const PackageCard: React.FC<PackageCardProps> = ({ packageData }) => {
  const pkgImage = resolveDestinationImage(packageData.hero_image, packageData.destination?.slug || 'kodaikanal');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-elevated">
      <div>
        <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-5 bg-slate-950">
          <Image src={pkgImage} alt={packageData.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-semibold px-3 py-1 rounded-full text-brand-orange flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {packageData.destination?.name || 'Hill Station'}
          </span>

          <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-mono font-bold px-3 py-1 rounded-md border border-slate-800 flex items-center gap-1">
            <Clock className="w-3 h-3 text-brand-orange" /> {packageData.duration}
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-extrabold text-white">{packageData.name}</h3>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{packageData.overview}</p>

          {/* Included Pillars */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
              <Home className="w-3 h-3 text-brand-orange" /> {packageData.accommodation || 'Stay'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
              <Car className="w-3 h-3 text-brand-orange" /> Transport
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
              <Utensils className="w-3 h-3 text-brand-orange" /> Meals
            </span>
          </div>

          {/* Included Experiences via Junction Data */}
          {packageData.package_experiences && packageData.package_experiences.length > 0 && (
            <div className="pt-2 space-y-1.5">
              <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-wider block">Included Experiences</span>
              {packageData.package_experiences.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                  <span>Day {item.day_number}: {item.experience.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-5 border-t border-slate-800/80 mt-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Package Price</span>
          <span className="text-2xl font-extrabold text-white">{formatINR(packageData.starting_price)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={{ pathname: ROUTES.ENQUIRE, query: { package: packageData.name } }}
            className="text-xs font-extrabold bg-brand-orange hover:bg-brand-orange-hover text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-button"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Book / Enquire
          </Link>
        </div>
      </div>
    </div>
  );
};
