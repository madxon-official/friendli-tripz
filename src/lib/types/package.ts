export type PackageReleaseStatus = 'draft' | 'active' | 'superseded' | 'archived';
export type InstanceType = 'fixed_departure' | 'private_quote' | 'corporate_group' | 'ai_proposal';
export type SegmentType =
  | 'attraction_visit'
  | 'activity_experience'
  | 'transit_block'
  | 'meal_block'
  | 'leisure_block'
  | 'lodging_transition'
  | 'meeting_point'
  | 'service_block';

export interface PricingTree {
  base_adult_price: number;
  base_child_price?: number;
  single_supplement?: number;
  currency?: string;
  margin_percentage?: number;
  gst_tax_percentage?: number;
}

export interface PackageFamily {
  id: string;
  name: string;
  family_slug: string;
  destination_id: string;
  category_id?: string | null;
  description?: string | null;
  destination?: { id: string; name: string; slug: string };
  releases?: PackageRelease[];
  created_at?: string;
  updated_at?: string;
}

export interface ItineraryDaySegment {
  id?: string;
  day_id?: string;
  sequence_order: number;
  segment_type: SegmentType;
  planned_start_time?: string | null;
  planned_end_time?: string | null;
  duration_mins: number;
  attraction_id?: string | null;
  activity_offering_id?: string | null;
  origin_lat?: number | null;
  origin_lng?: number | null;
  destination_lat?: number | null;
  destination_lng?: number | null;
  transit_mode?: string | null;
  cached_distance_km?: number | null;
  cached_eta_mins?: number | null;
  segment_title: string;
  custom_instructions?: string | null;
  cost_override?: number | null;
  is_included_in_package: boolean;
  attraction?: any;
  offering?: any;
}

export interface ItineraryDay {
  id?: string;
  release_id?: string | null;
  instance_id?: string | null;
  day_number: number;
  theme_title?: string | null;
  description?: string | null;
  segments?: ItineraryDaySegment[];
}

export interface PackageRelease {
  id: string;
  family_id: string;
  version_tag: string;
  title: string;
  duration_days: number;
  duration_nights: number;
  base_pricing_tree_json: PricingTree;
  commercial_terms_text?: string | null;
  status: PackageReleaseStatus;
  published_at?: string | null;
  family?: PackageFamily;
  days?: ItineraryDay[];
  created_at?: string;
  updated_at?: string;
}

export interface PackageInstance {
  id: string;
  release_id: string;
  instance_type: InstanceType;
  title: string;
  custom_pricing_tree_json: PricingTree;
  custom_notes?: string | null;
  assigned_customer_id?: string | null;
  assigned_agent_id?: string | null;
  price_drift_detected: boolean;
  release?: PackageRelease;
  days?: ItineraryDay[];
  created_at?: string;
  updated_at?: string;
}

export interface PackageFilterParams {
  search?: string;
  destination_id?: string;
  status?: PackageReleaseStatus | 'all';
  page?: number;
  limit?: number;
}
