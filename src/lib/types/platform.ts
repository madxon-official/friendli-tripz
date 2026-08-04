export interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  hero_image: string;
  gallery: string[];
  travel_vibe: string;
  best_season: string;
  starting_price: number;
  location: string;
  highlights: string[];
  things_to_do: { title: string; description: string; icon?: string }[];
  nearby_attractions: { name: string; distance: string; description: string }[];
  suggested_itinerary: { day: number; title: string; activities: string[] }[];
  featured: boolean;
  status: 'published' | 'draft';
  created_at: string;
}

export interface Experience {
  id: string;
  title: string;
  slug: string;
  category: 'Camping' | 'Trekking' | 'Waterfalls' | 'Tea Estates' | 'Wildlife' | 'Food Trails' | 'Road Trips' | 'Photography' | 'Adventure Sports' | 'Heritage';
  tagline: string;
  description: string;
  image: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  starting_price: number;
  destination_ids: string[];
  destination_names?: string[];
  featured: boolean;
  created_at: string;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  destination_id: string;
  destination_name: string;
  duration_days: number;
  duration_nights: number;
  starting_price: number;
  hero_image: string;
  gallery: string[];
  highlights: string[];
  overview: string;
  itinerary: { day: number; title: string; description: string; meals?: string }[];
  inclusions: string[];
  exclusions: string[];
  faqs: { question: string; answer: string }[];
  featured: boolean;
  status: 'published' | 'draft';
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  category: 'Travel Tips' | 'Destination Guides' | 'Weekend Escapes' | 'Budget Travel' | 'Hidden Gems' | 'Heritage';
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  read_time_minutes: number;
  related_destination_slugs?: string[];
  published_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Trip Planning' | 'Enquiries' | 'Tracking' | 'Safety' | 'Destinations';
  display_order: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  location: string;
  avatar_url?: string;
  rating: number;
  quote: string;
  trip_type: string;
  destination: string;
  created_at: string;
}

export interface TravelStyle {
  id: string;
  title: 'Adventure' | 'Weekend' | 'Weekend Escape' | 'Family' | 'Luxury' | 'Nature' | 'Beach' | 'Road Trips' | 'Road Trip' | 'Hill Stations' | 'Hidden Gems' | 'Romantic';
  description: string;
  icon_name: string;
  image_url: string;
  count: number;
}

export interface TripEnquiryInput {
  name: string;
  phone: string;
  email: string;
  starting_location?: string;
  destination: string;
  travel_date: string;
  budget: string;
  adults: number;
  children: number;
  message?: string;
}

// 5 Core Realtime Tracking Pipeline Stages
export type TripStatusStep =
  | 'Enquiry Received'
  | 'Under Review'
  | 'Trip Confirmed'
  | 'Trip Started'
  | 'Trip Completed'
  | 'Cancelled';

export interface StatusHistoryEntry {
  status: TripStatusStep;
  timestamp: string;
  note?: string;
  updated_by?: string;
}

export interface TripEnquiryRecord {
  id: string;
  reference: string; // e.g. FT-2026-8942
  created_at: string;
  name: string;
  phone: string;
  email: string;
  starting_location?: string;
  destination: string;
  travel_date: string;
  budget: string;
  adults: number;
  children: number;
  message?: string;
  status: TripStatusStep;
  status_history: StatusHistoryEntry[];
  planner_notes?: string;
  estimated_cost?: number;
  assigned_to?: string | null;
  assigned_staff_name?: string;
  assigned_staff_email?: string;
  assigned_staff_phone?: string;
  assigned_staff_role?: string;
}

export type DomainEvent = Record<string, unknown>;
