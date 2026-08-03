import React from 'react';
import { MapPin, Plane, Train, Bus, Sun, ExternalLink } from 'lucide-react';
import { DestinationLocation } from '@/lib/types/location';
import { Card } from '@/components/v3/ui/Card';
import { Badge } from '@/components/v3/ui/Badge';

interface LocationOverviewCardProps {
  location: DestinationLocation;
  destinationName: string;
}

export function LocationOverviewCard({ location, destinationName }: LocationOverviewCardProps) {
  return (
    <Card variant="outline" padding="lg" className="bg-white border border-surface-200 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-100">
        <div>
          <div className="flex items-center gap-2 text-caption text-surface-500 font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
            {location.district}, {location.state}
          </div>
          <h3 className="text-heading-sm font-heading font-bold text-surface-900 mt-0.5">
            {destinationName} Connectivity & Location
          </h3>
        </div>

        <a
          href={location.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-orange/10 text-brand-orange font-heading text-xs font-bold hover:bg-brand-orange/20 transition-colors"
        >
          <span>Open Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Transit Hubs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Airport */}
        <div className="p-4 rounded-2xl bg-surface-50 border border-surface-100 space-y-1">
          <div className="flex items-center gap-2 text-brand-navy font-bold text-xs uppercase tracking-wider">
            <Plane className="w-4 h-4 text-brand-orange" />
            Nearest Airport
          </div>
          <div className="text-body-md font-extrabold text-surface-900">
            {location.nearest_airport.name}
          </div>
          <div className="text-caption text-surface-500">
            {location.nearest_airport.distance_km} km · ~{Math.round(location.nearest_airport.travel_time_mins / 60)} hrs drive
          </div>
        </div>

        {/* Railway */}
        <div className="p-4 rounded-2xl bg-surface-50 border border-surface-100 space-y-1">
          <div className="flex items-center gap-2 text-brand-navy font-bold text-xs uppercase tracking-wider">
            <Train className="w-4 h-4 text-blue-600" />
            Nearest Railway
          </div>
          <div className="text-body-md font-extrabold text-surface-900">
            {location.nearest_railway.name}
          </div>
          <div className="text-caption text-surface-500">
            {location.nearest_railway.distance_km} km · ~{Math.round(location.nearest_railway.travel_time_mins / 60)} hrs drive
          </div>
        </div>

        {/* Bus Stand */}
        <div className="p-4 rounded-2xl bg-surface-50 border border-surface-100 space-y-1">
          <div className="flex items-center gap-2 text-brand-navy font-bold text-xs uppercase tracking-wider">
            <Bus className="w-4 h-4 text-emerald-600" />
            Central Bus Stand
          </div>
          <div className="text-body-md font-extrabold text-surface-900">
            {location.nearest_bus_stand.name}
          </div>
          <div className="text-caption text-surface-500">
            {location.nearest_bus_stand.distance_km} km · ~{location.nearest_bus_stand.travel_time_mins} mins
          </div>
        </div>
      </div>

      {/* Climate & Elevation Bar */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs border-t border-surface-100">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="xs" icon={<Sun className="w-3 h-3" />}>
            Climate: {location.climate}
          </Badge>
          <span className="text-surface-600 font-medium">Elevation: {location.elevation_m}m</span>
        </div>

        <div className="text-surface-500 font-mono text-[11px]">
          GPS: {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
        </div>
      </div>
    </Card>
  );
}
