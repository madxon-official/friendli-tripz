import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { ExperienceRecord } from '@/lib/repositories/experienceRepository';
import { resolveDestinationImage, formatINR } from '@/lib/utils/imageResolver';
import { ROUTES } from '@/lib/routes';

interface ExperienceCardProps {
  experience: ExperienceRecord;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const expImage = resolveDestinationImage(experience.image, experience.destination?.slug || 'kodaikanal');

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-elevated hover:-translate-y-1">
      <div>
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-950">
          <Image
            src={expImage}
            alt={experience.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-semibold px-3 py-1 rounded-full text-brand-orange">
            {experience.category}
          </span>
          <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-slate-300 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-800">
            Difficulty: {experience.difficulty}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div>
            <h3 className="text-xl font-extrabold text-white group-hover:text-brand-orange transition-colors">
              {experience.title}
            </h3>
            <span className="text-[11px] font-bold text-brand-orange flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {experience.destination?.name || 'Hill Station'}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{experience.description}</p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-brand-orange" /> {experience.duration}
            </span>
            {experience.minimum_age && (
              <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                Age: {experience.minimum_age}+
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Starting Rate</span>
          <span className="text-lg font-extrabold text-white">{formatINR(experience.starting_price)}</span>
        </div>

        <Link
          href={`${ROUTES.PACKAGES}?experience=${encodeURIComponent(experience.slug)}`}
          className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-button"
        >
          <span>View Package</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
