import { createBrowserClient } from '@supabase/ssr';

export function sanitizeSupabaseUrl(url?: string): string {
  if (!url) return '';
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !supabaseAnonKey || rawUrl.includes('placeholder')) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Please verify your environment configuration.'
    );
  }

  const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
