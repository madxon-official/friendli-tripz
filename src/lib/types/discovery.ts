export interface PackageFilterState {
  searchQuery?: string;
  destinationId?: string;
  destinationSlug?: string;
  minDuration?: number;
  maxDuration?: number;
  minBudget?: number;
  maxBudget?: number;
  travelStyle?: string;
  difficulty?: string;
  familyFriendly?: boolean;
  adventure?: boolean;
  honeymoon?: boolean;
  weekend?: boolean;
  group?: boolean;
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'duration_asc' | 'duration_desc' | 'newest';
  page?: number;
  limit?: number;
}

export interface PackageCardItem {
  id: string; // release_id
  family_id: string;
  title: string;
  family_slug: string;
  destination_id: string;
  destination_name: string;
  destination_slug: string;
  hero_banner_url?: string;
  duration_days: number;
  duration_nights: number;
  starting_price: number;
  currency: string;
  rating?: number;
  review_count?: number;
  travel_difficulty?: string;
  family_friendly?: boolean;
  inclusions_preview?: string[];
  is_wishlisted?: boolean;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  package_family_id: string;
  created_at: string;
}

export interface SavedSearchItem {
  id: string;
  user_id: string;
  search_title: string;
  query_params_json: PackageFilterState;
  created_at: string;
}
