import { createServiceRoleClient } from '@/lib/supabase/service';

export interface DestinationRecord {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  overview: string;
  why_visit?: string;
  best_season: string;
  how_to_reach?: string;
  weather?: string;
  culture?: string;
  travel_tips?: string;
  district: string;
  state: string;
  elevation: string;
  google_map_embed?: string;
  status: string;
  featured: boolean;
  starting_price: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  canonical_url?: string;
  og_image?: string;
  gallery?: Array<{ id: string; image?: string; image_url?: string; title?: string; image_type: string }>;
  routes?: Array<{ id: string; origin_city: string; distance: string; duration: string; travel_mode: string }>;
}

const SUPPORTED_SLUGS = ['kodaikanal', 'ooty', 'valparai'];

export class DestinationRepository {
  /**
   * Fetch active published destinations strictly restricted to Kodaikanal, Ooty, and Valparai
   */
  static async getAllPublished(): Promise<DestinationRecord[]> {
    try {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase
        .from('destinations')
        .select(`
          *,
          gallery:destination_gallery(id, image, image_url, title, image_type, display_order),
          routes:destination_routes(id, origin_city, distance, duration, travel_mode)
        `)
        .in('slug', SUPPORTED_SLUGS)
        .order('name', { ascending: true });

      if (error || !data) {
        return [];
      }

      return data as DestinationRecord[];
    } catch {
      return [];
    }
  }

  /**
   * Fetch single destination by slug with gallery & travel routes
   */
  static async getBySlug(slug: string): Promise<DestinationRecord | null> {
    const normSlug = slug.toLowerCase();
    if (!SUPPORTED_SLUGS.includes(normSlug)) {
      return null;
    }

    try {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase
        .from('destinations')
        .select(`
          *,
          gallery:destination_gallery(id, image, image_url, title, image_type, display_order),
          routes:destination_routes(id, origin_city, distance, duration, travel_mode)
        `)
        .eq('slug', normSlug)
        .single();

      if (error || !data) {
        return null;
      }

      return data as DestinationRecord;
    } catch {
      return null;
    }
  }
}
