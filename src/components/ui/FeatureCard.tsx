import React from 'react';
import { Sparkles, Users, Coffee, HeartHandshake } from 'lucide-react';
import { WhyFriendliPrinciple } from '@/lib/types';

interface FeatureCardProps {
  principle: WhyFriendliPrinciple;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ principle }) => {
  const getIcon = () => {
    switch (principle.iconName) {
      case 'sparkles':
        return <Sparkles className="w-6 h-6 text-brand-navy" />;
      case 'users':
        return <Users className="w-6 h-6 text-brand-navy" />;
      case 'coffee':
        return <Coffee className="w-6 h-6 text-brand-navy" />;
      case 'heartHandshake':
      default:
        return <HeartHandshake className="w-6 h-6 text-brand-navy" />;
    }
  };

  return (
    <div className="bg-brand-soft-navy/60 rounded-2xl p-6 sm:p-8 border border-brand-navy/10 hover:border-brand-navy/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
            {getIcon()}
          </div>
          <span className="text-2xl font-black text-brand-navy/20 font-heading">
            {principle.number}
          </span>
        </div>
        <h3 className="text-xl font-bold text-brand-navy mb-3">
          {principle.title}
        </h3>
        <p className="text-brand-muted leading-relaxed text-sm sm:text-base">
          {principle.description}
        </p>
      </div>
    </div>
  );
};
