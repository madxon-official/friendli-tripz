export type AttractionStatus = 'draft' | 'published' | 'coming_soon' | 'archived';
export type ActivityStatus = 'draft' | 'published' | 'coming_soon' | 'archived';
export type FitnessLevel = 'none' | 'light' | 'moderate' | 'strenuous' | 'extreme';
export type AgeSuitability = 'all_ages' | 'kids' | 'adults_only' | 'seniors';
export type OfferingCapacityType = 'per_person' | 'per_vehicle' | 'per_group' | 'slot_based';
export type ExceptionType = 'seasonal_closure' | 'maintenance' | 'weather' | 'special_hours' | 'government_holiday';
export type ValidationLevel = 'informational' | 'warning' | 'blocking';
export type ParticipantType = 'adult' | 'child' | 'senior' | 'foreigner' | 'group_flat';

export interface Locale {
  code: string;
  language_name: string;
  native_name: string;
  direction?: 'ltr' | 'rtl';
  is_default?: boolean;
  is_active?: boolean;
  date_format?: string;
  currency_code?: string;
}

export interface EntityTranslation {
  id?: string;
  entity_type: string;
  entity_id: string;
  locale_code: string;
  field_name: string;
  translated_text: string;
  translated_slug?: string | null;
  workflow_status?: 'draft' | 'translated' | 'approved';
  version?: number;
}

export interface MediaAsset {
  id: string;
  storage_bucket: string;
  storage_path: string;
  mime_type: string;
  original_filename?: string | null;
  width?: number | null;
  height?: number | null;
  aspect_ratio?: number | null;
  blurhash?: string | null;
  focal_point_x?: number;
  focal_point_y?: number;
  alt_text?: string | null;
  caption?: string | null;
  photographer?: string | null;
  created_at?: string;
}

export interface MediaVariant {
  id: string;
  asset_id: string;
  variant_type: 'hero' | 'card' | 'thumbnail' | 'og_image';
  url: string;
  width: number;
  height: number;
  file_size_bytes?: number;
  format?: string;
}

export interface DestinationZone {
  id: string;
  destination_id: string;
  name: string;
  slug: string;
  description?: string | null;
  display_order?: number;
}

export interface AttractionCategory {
  id: string;
  name: string;
  slug: string;
  icon_name?: string | null;
  description?: string | null;
  display_order?: number;
}

export interface ActivityCategory {
  id: string;
  name: string;
  slug: string;
  icon_name?: string | null;
  description?: string | null;
  display_order?: number;
}

export interface OfferingPricingRule {
  id?: string;
  offering_id?: string;
  participant_type: ParticipantType;
  base_price: number;
  currency?: string;
  effective_start_date?: string | null;
  effective_end_date?: string | null;
  is_active?: boolean;
}

export interface ActivityOffering {
  id: string;
  master_activity_id: string;
  attraction_id?: string | null;
  destination_id?: string | null;
  title: string;
  capacity_type: OfferingCapacityType;
  max_capacity: number;
  duration_mins: number;
  vendor_name?: string | null;
  booking_advance_days?: number;
  is_active: boolean;
  pricing_rules?: OfferingPricingRule[];
  master_activity?: MasterActivity;
}

export interface MasterActivity {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category?: ActivityCategory;
  short_description?: string | null;
  full_description?: string | null;
  fitness_level: FitnessLevel;
  age_suitability: AgeSuitability;
  min_age: number;
  required_gear: string[];
  provided_gear: string[];
  default_duration_mins: number;
  is_indoor: boolean;
  weather_dependent: boolean;
  hero_image_url?: string | null;
  icon_name?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  status: ActivityStatus;
  is_featured: boolean;
  display_order: number;
  offerings?: ActivityOffering[];
}

export interface OperatingSchedule {
  id?: string;
  entity_type: 'attraction' | 'offering';
  entity_id: string;
  day_of_week: number; // 0=Sun, 6=Sat
  open_time: string; // "09:00"
  close_time: string; // "18:00"
  is_closed: boolean;
}

export interface OperationalException {
  id?: string;
  entity_type: 'attraction' | 'offering';
  entity_id: string;
  start_date: string;
  end_date: string;
  exception_type: ExceptionType;
  reason?: string | null;
  override_open_time?: string | null;
  override_close_time?: string | null;
  validation_impact: ValidationLevel;
}

export interface Attraction {
  id: string;
  name: string;
  slug: string;
  destination_id: string;
  zone_id?: string | null;
  category_id: string;
  
  // Relations
  destination?: { id: string; name: string; slug: string };
  zone?: DestinationZone | null;
  category?: AttractionCategory;
  offerings?: ActivityOffering[];
  schedules?: OperatingSchedule[];
  exceptions?: OperationalException[];
  media?: MediaAsset[];

  // Coordinates
  latitude: number;
  longitude: number;
  address_text?: string | null;

  // Overview
  short_tagline?: string | null;
  description?: string | null;
  suggested_duration_mins: number;

  // Amenities
  pet_allowed: boolean;
  wheelchair_accessible: boolean;
  parking_available: boolean;
  restrooms_available: boolean;
  ideal_for: string[];

  // Entry Fee Structure
  entry_fee_type: string;
  adult_entry_fee: number;
  child_entry_fee: number;
  foreign_national_fee: number;

  // Media
  hero_banner_url?: string | null;
  featured_image_url?: string | null;

  // SEO & Meta
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords: string[];
  status: AttractionStatus;
  is_featured: boolean;
  display_order: number;
  website_visibility: boolean;
  view_count: number;

  created_at: string;
  updated_at: string;
}

export interface AttractionFilterParams {
  search?: string;
  destination_id?: string;
  zone_id?: string;
  category_id?: string;
  status?: AttractionStatus | 'all';
  is_featured?: boolean;
  page?: number;
  limit?: number;
}
