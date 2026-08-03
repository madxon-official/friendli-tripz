/**
 * Destination Media & Gallery Domain Types for Friendli Tripz
 */

export type GalleryCategory =
  | 'hero'
  | 'cover'
  | 'attractions'
  | 'food'
  | 'stay'
  | 'activities'
  | 'seasonal'
  | 'planner';

export interface GalleryItem {
  id: string;
  destination_id: string;
  category: GalleryCategory;
  title: string;
  alt_text: string;
  caption?: string | null;
  photographer?: string | null;
  display_order: number;
  is_featured: boolean;
  width: number;
  height: number;
  blur_placeholder?: string | null;
  storage_path: string;
  public_url: string;
  created_at: string;
}

export interface DestinationMediaCatalog {
  hero: GalleryItem;
  cover: GalleryItem;
  gallery: GalleryItem[];
  byCategory: Record<GalleryCategory, GalleryItem[]>;
}
