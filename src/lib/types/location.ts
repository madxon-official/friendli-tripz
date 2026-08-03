/**
 * Location & Geo-spatial Domain Types for Friendli Tripz
 */

export interface TransitHub {
  name: string;
  code?: string;
  distance_km: number;
  travel_time_mins: number;
}

export interface NearbyDestination {
  id: string;
  name: string;
  slug: string;
  distance_km: number;
  hero_image: string;
}

export interface DestinationLocation {
  id: string;
  destination_id: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  google_maps_url: string;
  map_embed_url?: string;
  nearest_airport: TransitHub;
  nearest_railway: TransitHub;
  nearest_bus_stand: TransitHub;
  travel_distance_km: number;
  travel_time_hrs: number;
  elevation_m: number;
  climate: string;
  best_season: string;
  timezone: string;
  nearby_destinations: NearbyDestination[];
}
