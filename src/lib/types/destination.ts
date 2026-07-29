export type DestinationStatus = 'draft' | 'published' | 'coming_soon' | 'archived';
export type TravelDifficulty = 'easy' | 'moderate' | 'challenging' | 'strenuous';
export type AdventureLevel = 'low' | 'moderate' | 'high' | 'extreme';
export type BudgetLevel = 'budget' | 'mid_range' | 'luxury' | 'ultra_luxury';

export interface Country {
  id: string;
  name: string;
  iso_code: string | null;
  created_at?: string;
}

export interface State {
  id: string;
  country_id: string;
  name: string;
  code: string | null;
  created_at?: string;
}

export interface DestinationCategory {
  id: string;
  name: string;
  slug: string;
  icon_name: string | null;
  description: string | null;
  display_order?: number;
  created_at?: string;
}

export interface MasterTag {
  id: string;
  name: string;
  slug: string;
  tag_type: string;
  created_at?: string;
}

export interface DestinationGallery {
  id?: string;
  destination_id?: string;
  image_url: string;
  thumbnail_url?: string | null;
  medium_url?: string | null;
  alt_text?: string | null;
  caption?: string | null;
  photographer?: string | null;
  is_featured?: boolean;
  display_order?: number;
}

export interface DestinationHighlight {
  id?: string;
  destination_id?: string;
  title: string;
  description?: string | null;
  icon_name?: string | null;
  display_order?: number;
}

export interface DestinationEmergencyContact {
  id?: string;
  destination_id?: string;
  service_type: string; // 'Police' | 'Hospital' | 'Tourism Office' | 'Forest Office' | 'Rescue'
  title: string;
  phone_number: string;
  alt_phone?: string | null;
  address?: string | null;
  display_order?: number;
}

export interface DestinationFAQ {
  id?: string;
  destination_id?: string;
  question: string;
  answer: string;
  display_order?: number;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country_id: string;
  state_id: string;
  category_id: string;
  
  // Joined Relations (Optional)
  country?: Country;
  state?: State;
  category?: DestinationCategory;
  tags?: MasterTag[];
  tag_ids?: string[];
  gallery?: DestinationGallery[];
  highlights?: DestinationHighlight[];
  emergency_contacts?: DestinationEmergencyContact[];
  faqs?: DestinationFAQ[];

  // Descriptions
  short_description: string | null;
  long_description: string | null;

  // Geographic
  latitude: number | null;
  longitude: number | null;

  // Quick Facts & Enums
  ideal_duration: string | null;
  best_season: string | null;
  climate: string | null;
  travel_difficulty: TravelDifficulty;
  adventure_level: AdventureLevel;
  budget_level: BudgetLevel;
  family_friendly: boolean;
  pet_friendly: boolean;
  accessibility_notes: string | null;
  temperature_range: string | null;
  elevation: string | null;
  average_budget_per_day: string | null;
  view_count: number;

  // Media
  hero_banner_url: string | null;
  featured_image_url: string | null;
  image_variants?: Record<string, string>;

  // Travel Guide Information
  best_time_to_visit: string | null;
  how_to_reach: string | null;
  nearest_airport: string | null;
  nearest_railway_station: string | null;
  nearest_bus_stand: string | null;
  languages_spoken: string[];
  local_transport: string | null;

  // Rich SEO & Guides
  introduction: string | null;
  travel_tips: string | null;
  food_guide: string | null;
  shopping_guide: string | null;
  weather_guide: string | null;
  things_to_avoid: string | null;
  best_months: string[];
  ideal_for: string[];

  // SEO Meta
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
  og_image_url: string | null;
  canonical_url: string | null;

  // Controls
  status: DestinationStatus;
  is_featured: boolean;
  homepage_order: number;
  website_visibility: boolean;

  // Audit
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface DestinationFilterParams {
  search?: string;
  status?: DestinationStatus | 'all';
  category_id?: string;
  state_id?: string;
  country_id?: string;
  is_featured?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'homepage_order' | 'view_count';
  sort_order?: 'asc' | 'desc';
}
