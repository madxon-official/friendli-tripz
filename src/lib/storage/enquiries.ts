import { createServiceRoleClient } from '@/lib/supabase/service';

export interface Enquiry {
  id: string;
  reference: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string | null;
  destination: string;
  travellerCount: number;
  preferredDate: string;
  startingLocation: string;
  tripType: 'Join Friendli Group Trip' | 'Private Group' | 'Custom Trip' | 'Not Sure Yet';
  stayPreference: 'Budget' | 'Comfortable' | 'Premium' | 'No preference';
  notes?: string | null;
  status: 'new' | 'contacted' | 'follow_up' | 'confirmed' | 'completed' | 'cancelled';
  archivedAt?: string | null;
  createdSource?: string;
}

export type CreateEnquiryInput = Omit<Enquiry, 'id' | 'reference' | 'createdAt' | 'status' | 'archivedAt'>;

export function generateEnquiryReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FT-KOD-${random}`;
}

export async function saveEnquiry(input: CreateEnquiryInput): Promise<Enquiry> {
  const reference = generateEnquiryReference();
  const nowIso = new Date().toISOString();

  try {
    const serviceClient = createServiceRoleClient();

    let attempts = 0;
    let currentRef = reference;
    let savedData = null;
    let saveError = null;

    // Collision retry loop
    while (attempts < 3) {
      attempts++;
      const { data, error } = await serviceClient
        .from('enquiries')
        .insert({
          reference: currentRef,
          name: input.name,
          phone: input.phone,
          email: input.email || null,
          destination: input.destination || 'Kodaikanal',
          traveller_count: input.travellerCount,
          preferred_date: input.preferredDate,
          starting_location: input.startingLocation,
          trip_type: input.tripType,
          stay_preference: input.stayPreference,
          notes_from_traveller: input.notes || null,
          status: 'new',
          created_source: 'website',
        })
        .select()
        .single();

      if (!error && data) {
        savedData = data;
        break;
      }

      if (error && error.code === '23505') {
        currentRef = generateEnquiryReference();
        continue;
      }

      saveError = error;
      break;
    }

    if (!saveError && savedData) {
      return {
        id: savedData.id,
        reference: savedData.reference,
        createdAt: savedData.created_at,
        name: savedData.name,
        phone: savedData.phone,
        email: savedData.email,
        destination: savedData.destination,
        travellerCount: savedData.traveller_count,
        preferredDate: savedData.preferred_date,
        startingLocation: savedData.starting_location,
        tripType: savedData.trip_type,
        stayPreference: savedData.stay_preference,
        notes: savedData.notes_from_traveller,
        status: savedData.status,
        archivedAt: savedData.archived_at,
        createdSource: savedData.created_source,
      };
    }

    console.error('Failed to save enquiry to Supabase:', saveError);
    throw new Error(saveError?.message || 'Failed to persist enquiry.');
  } catch (err: any) {
    console.error('Enquiry storage error:', err);
    throw new Error(err?.message || 'Unable to store enquiry. Please try again.');
  }
}
