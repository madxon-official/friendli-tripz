import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sanitizeSupabaseUrl } from './client';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !supabaseAnonKey || rawUrl.includes('placeholder')) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Please verify your environment configuration.'
    );
  }

  const supabaseUrl = sanitizeSupabaseUrl(rawUrl);

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from Server Component
        }
      },
    },
  });
}

export { createServerSupabaseClient as createClient };
