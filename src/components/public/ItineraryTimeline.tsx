'use client';

import React, { useState } from 'react';
import { Clock, MapPin, CheckCircle, RefreshCw, Hotel, Compass, Car } from 'lucide-react';
import { BookableItineraryItem } from '@/lib/types/ai';

interface ItineraryTimelineProps {
  itinerary: BookableItineraryItem[];
  allowCustomization?: boolean;
  onSwapItem?: (dayNumber: number, segmentIndex: number) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  allowCustomization = false,
  onSwapItem,
}) => {
  const [activeDay, setActiveDay] = useState(1);

  return (
    <div className="space-y-6">
      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {itinerary.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDay(day.dayNumber)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeDay === day.dayNumber
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Active Day Content */}
      {itinerary.map((day) => {
        if (day.dayNumber !== activeDay) return null;

        return (
          <div key={day.dayNumber} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Day {day.dayNumber} Itinerary</span>
              <h3 className="font-heading text-xl font-bold text-slate-900 mt-1">{day.title}</h3>
              <p className="text-xs text-slate-600 mt-1">{day.description}</p>
            </div>

            {/* Timeline Segments */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {day.segments.map((seg, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-amber-500 border-4 border-white shadow-sm flex items-center justify-center" />

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-amber-200 transition-colors flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        {seg.type === 'lodging' && <Hotel className="w-4 h-4 text-indigo-500" />}
                        {seg.type === 'attraction' && <Compass className="w-4 h-4 text-emerald-500" />}
                        {seg.type === 'activity' && <MapPin className="w-4 h-4 text-amber-500" />}
                        {seg.type === 'transit' && <Car className="w-4 h-4 text-blue-500" />}
                        <span className="font-bold text-slate-900 text-sm">{seg.title}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {seg.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {seg.startTime} - {seg.endTime} ({seg.durationMins} mins)
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-semibold text-emerald-600">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Included in Package
                        </span>
                      </div>
                    </div>

                    {allowCustomization && onSwapItem && (
                      <button
                        onClick={() => onSwapItem(day.dayNumber, idx)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-500 text-xs font-semibold text-slate-700 hover:text-amber-600 flex items-center gap-1 transition-all shadow-sm shrink-0"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Swap Node
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
