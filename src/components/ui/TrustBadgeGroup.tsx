import React from 'react';
import { ShieldCheck, HeartHandshake, Award, Clock } from 'lucide-react';

interface TrustBadgeGroupProps {
  variant?: 'light' | 'dark' | 'card';
  className?: string;
}

export const TrustBadgeGroup: React.FC<TrustBadgeGroupProps> = ({
  variant = 'light',
  className = '',
}) => {
  const isDark = variant === 'dark';
  const isCard = variant === 'card';

  const badges = [
    {
      icon: ShieldCheck,
      title: 'Handpicked Stays',
      subtitle: '100% physically verified properties',
    },
    {
      icon: HeartHandshake,
      title: 'Verified Cohorts',
      subtitle: 'Small groups of like-minded travellers',
    },
    {
      icon: Award,
      title: 'Zero Hidden Fees',
      subtitle: 'Transparent all-inclusive pricing',
    },
    {
      icon: Clock,
      title: '24/7 Ground Support',
      subtitle: 'Live trip tracking & local captains',
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      {badges.map((b, idx) => {
        const Icon = b.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl transition-all duration-300 flex items-start gap-3.5 ${
              isCard
                ? 'bg-white border border-brand-border/60 shadow-card hover:shadow-lg'
                : isDark
                ? 'bg-white/5 border border-white/10 text-white'
                : 'bg-brand-soft-navy/50 border border-brand-border/50'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                isDark
                  ? 'bg-brand-orange/20 text-brand-orange'
                  : 'bg-brand-orange/10 text-brand-orange'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4
                className={`text-sm font-bold font-heading ${
                  isDark ? 'text-white' : 'text-brand-navy'
                }`}
              >
                {b.title}
              </h4>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? 'text-white/70' : 'text-brand-muted'
                }`}
              >
                {b.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
