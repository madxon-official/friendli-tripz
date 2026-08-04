import { createServiceRoleClient } from '@/lib/supabase/service';

export interface AttractionRecord {
  id: string;
  destination_id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  duration: string;
  best_time?: string;
  coordinates?: string;
  featured: boolean;
}

export class AttractionRepository {
  /**
   * Fetch attractions for a given destination ID
   */
  static async getByDestinationId(destinationId: string): Promise<AttractionRecord[]> {
    try {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .eq('destination_id', destinationId)
        .order('featured', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data as AttractionRecord[];
    } catch {
      return [];
    }
  }
}
