import { createServiceRoleClient } from '@/lib/supabase/service';

export interface PackageRecord {
  id: string;
  destination_id: string;
  name: string;
  slug: string;
  duration: string;
  duration_days: number;
  duration_nights: number;
  min_people: number;
  max_people: number;
  starting_price: number;
  weekday_price?: number;
  weekend_price?: number;
  status: string;
  is_customizable: boolean;
  hero_image: string;
  overview: string;
  itinerary: Array<{ day: number; title: string; activities: string[] }>;
  includes?: string[];
  exclusions?: string[];
  accommodation?: string;
  transport?: string;
  meals?: string;
  featured: boolean;
  destination?: { slug: string; name: string };
  package_experiences?: Array<{
    day_number: number;
    experience: { id: string; title: string; slug: string; category: string; duration: string };
  }>;
}

export class PackageRepository {
  /**
   * Fetch all packages with option to filter by destination slug
   */
  static async getAll(destinationSlug?: string): Promise<PackageRecord[]> {
    try {
      const supabase = createServiceRoleClient();
      let query = supabase
        .from('packages')
        .select(`
          *,
          destination:destinations(slug, name),
          package_experiences(
            day_number,
            experience:experiences(id, title, slug, category, duration)
          )
        `)
        .eq('status', 'published')
        .order('starting_price', { ascending: true });

      if (destinationSlug && destinationSlug !== 'all') {
        const { data: destData } = await supabase
          .from('destinations')
          .select('id')
          .eq('slug', destinationSlug)
          .single();

        if (destData) {
          query = query.eq('destination_id', destData.id);
        }
      }

      const { data, error } = await query;

      if (error || !data) {
        return [];
      }

      return data as PackageRecord[];
    } catch {
      return [];
    }
  }

  /**
   * Fetch single package by slug with destination & package_experiences junction data
   */
  static async getBySlug(slug: string): Promise<PackageRecord | null> {
    try {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          destination:destinations(id, slug, name, tagline, elevation),
          package_experiences(
            day_number,
            experience:experiences(id, title, slug, category, duration, description, image)
          )
        `)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return null;
      }

      return data as PackageRecord;
    } catch {
      return null;
    }
  }

  /**
   * Fetch packages by destination ID
   */
  static async getByDestinationId(destinationId: string): Promise<PackageRecord[]> {
    try {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          package_experiences(
            day_number,
            experience:experiences(id, title, slug, category, duration)
          )
        `)
        .eq('destination_id', destinationId)
        .eq('status', 'published')
        .order('starting_price', { ascending: true });

      if (error || !data) {
        return [];
      }

      return data as PackageRecord[];
    } catch {
      return [];
    }
  }
}
