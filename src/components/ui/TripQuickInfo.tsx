import React from 'react';
import { MapPin, Calendar, Clock, Tag, Compass } from 'lucide-react';
import { Trip } from '@/lib/types';

interface TripQuickInfoProps {
  trip: Trip;
  className?: string;
}

export const TripQuickInfo: React.FC<TripQuickInfoProps> = ({ trip, className = '' }) => {
  const formattedPrice = trip.startingPrice.startsWith('₹') || trip.startingPrice === 'Coming soon'
    ? trip.startingPrice
    : `₹${trip.startingPrice}`;

  const items = [
    {
      label: 'Destination',
      value: trip.destination,
      icon: MapPin,
      highlight: true,
    },
    {
      label: 'Duration',
      value: trip.duration,
      icon: Clock,
      highlight: false,
    },
    {
      label: 'Departure',
      value: trip.departureCity,
      icon: Compass,
      highlight: false,
    },
    {
      label: 'Starting Price',
      value: formattedPrice,
      icon: Tag,
      highlight: false,
    },
    {
      label: 'Next Trip',
      value: trip.nextTripDate,
      icon: Calendar,
      highlight: false,
    },
  ];

  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-6 shadow-card border border-brand-border/60 ${className}`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/60">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-start gap-3 ${
                idx > 0 ? 'pt-3 sm:pt-0 sm:pl-3' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-brand-soft-navy text-brand-navy shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-navy" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-muted font-mono whitespace-nowrap">
                  {item.label}
                </span>
                <span
                  className={`block text-xs sm:text-sm font-bold leading-snug break-words ${
                    item.highlight ? 'text-brand-navy' : 'text-brand-text'
                  }`}
                >
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
