import { createServiceRoleClient } from '@/lib/supabase/service';

export interface ExperienceRecord {
  id: string;
  destination_id: string;
  category: string;
  title: string;
  slug: string;
  image: string;
  duration: string;
  difficulty: string;
  minimum_age?: number;
  maximum_group?: number;
  start_time?: string;
  end_time?: string;
  season?: string;
  requires_guide?: boolean;
  requires_permit?: boolean;
  available_days?: string;
  location_type?: string;
  description: string;
  starting_price: number;
  includes?: string[];
  exclusions?: string[];
  featured: boolean;
  destination?: { slug: string; name: string };
}

export class ExperienceRepository {
  /**
   * Fetch all experiences or filter by destination slug
   */
  static async getAll(destinationSlug?: string): Promise<ExperienceRecord[]> {
    try {
      const supabase = createServiceRoleClient();
      let query = supabase
        .from('experiences')
        .select('*, destination:destinations(slug, name)')
        .eq('featured', true)
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

      return data as ExperienceRecord[];
    } catch {
      return [];
    }
  }

  /**
   * Fetch experiences by destination ID
   */
  static async getByDestinationId(destinationId: string): Promise<ExperienceRecord[]> {
    try {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('destination_id', destinationId)
        .order('title', { ascending: true });

      if (error || !data) {
        return [];
      }

      return data as ExperienceRecord[];
    } catch {
      return [];
    }
  }
}
