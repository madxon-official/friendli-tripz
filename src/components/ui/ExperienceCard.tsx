import React from 'react';
import { Compass, Wind, Users, MapPin } from 'lucide-react';
import { ExperienceFeature } from '@/lib/types';

interface ExperienceCardProps {
  feature: ExperienceFeature;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ feature }) => {
  const getIcon = () => {
    switch (feature.iconName) {
      case 'compass':
        return <Compass className="w-6 h-6 text-brand-orange" />;
      case 'wind':
        return <Wind className="w-6 h-6 text-brand-orange" />;
      case 'users':
        return <Users className="w-6 h-6 text-brand-orange" />;
      case 'mapPin':
      default:
        return <MapPin className="w-6 h-6 text-brand-orange" />;
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-brand-border/60 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {feature.imageBg && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity duration-300"
          style={{ backgroundImage: `url(${feature.imageBg})` }}
        />
      )}
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-brand-soft-orange flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          {getIcon()}
        </div>
        <h3 className="text-xl font-bold text-brand-navy mb-3">
          {feature.title}
        </h3>
        <p className="text-brand-muted leading-relaxed text-sm sm:text-base">
          {feature.description}
        </p>
      </div>
      <div className="relative z-10 mt-6 pt-4 border-t border-brand-border/40 flex items-center text-xs font-bold text-brand-orange tracking-wider uppercase">
        <span>Friendli Approach</span>
        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
      </div>
    </div>
  );
};
