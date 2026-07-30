import { createClient } from '@supabase/supabase-js';
import { sanitizeSupabaseUrl } from './client';

export function createServiceRoleClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawUrl || !serviceRoleKey || serviceRoleKey.includes('placeholder')) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Please verify your environment configuration.'
    );
  }

  const supabaseUrl = sanitizeSupabaseUrl(rawUrl);

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
