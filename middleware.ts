import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { sanitizeSupabaseUrl } from '@/lib/supabase/client';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Admin Subdomain Preparation for production (admin.friendlitripz.com)
  const isAdminSubdomain = hostname.startsWith('admin.');
  const isAdminPath = url.pathname.startsWith('/admin') || isAdminSubdomain;

  // Skip middleware for static assets, public API, etc.
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api/enquiries') ||
    url.pathname.includes('.')
  ) {
    return response;
  }

  // Public admin pages that do not require an active admin profile
  const publicAdminPaths = ['/admin/login', '/admin/set-password', '/admin/access-denied'];
  if (publicAdminPaths.includes(url.pathname)) {
    return response;
  }

  // If requesting admin routes (/admin, /admin/enquiries, /admin/team, etc.)
  if (isAdminPath) {
    const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify active admin profile in database
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role, is_active')
      .eq('id', session.user.id)
      .single();

    if (!profile || !profile.is_active) {
      // User authenticated in Supabase but inactive or missing profile
      const accessDeniedUrl = new URL('/admin/access-denied?reason=inactive', request.url);
      return NextResponse.redirect(accessDeniedUrl);
    }

    // Guard /admin/team route: OWNER & ADMIN ONLY
    if (url.pathname.startsWith('/admin/team')) {
      if (!['owner', 'admin'].includes(profile.role)) {
        const forbiddenUrl = new URL('/admin/access-denied?reason=forbidden', request.url);
        return NextResponse.redirect(forbiddenUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
