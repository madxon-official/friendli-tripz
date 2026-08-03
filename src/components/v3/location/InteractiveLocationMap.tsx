'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Eye } from 'lucide-react';
import { DestinationLocation } from '@/lib/types/location';
import { Button } from '@/components/v3/ui/Button';

interface InteractiveLocationMapProps {
  location: DestinationLocation;
  destinationName: string;
}

export function InteractiveLocationMap({ location, destinationName }: InteractiveLocationMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Generate Google Maps Embed iframe URL
  const embedUrl =
    location.map_embed_url ||
    `https://www.google.com/maps/embed/v1/place?key=${
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    }&q=${encodeURIComponent(`${destinationName}, ${location.state}`)}`;

  return (
    <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-surface-900 border border-surface-800 shadow-xl group">
      {/* Fallback / Load Map Preview Container */}
      {!mapLoaded ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="w-14 h-14 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center animate-bounce">
            <MapPin className="w-7 h-7" />
          </div>
          <div className="max-w-md space-y-1">
            <h4 className="text-white font-heading font-bold text-lg">
              Explore {destinationName} Map
            </h4>
            <p className="text-white/60 text-xs">
              Interactive map with destination markers, transit routes, and nearby attractions.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setMapLoaded(true)}
            icon={<Eye className="w-4 h-4" />}
          >
            Load Interactive Map
          </Button>

          <a
            href={location.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange text-xs font-bold hover:underline inline-flex items-center gap-1 pt-1"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      ) : (
        <iframe
          title={`${destinationName} Interactive Map`}
          src={embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
}
