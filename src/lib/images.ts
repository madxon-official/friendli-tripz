/**
 * Universal Image URL Sanitizer & Fast Path Resolver for Friendli Tripz
 * Eliminates 404 image retries and external Unsplash network timeouts during Turbopack compilation.
 */

export const DEFAULT_FALLBACK_IMAGE = '/destinations/kodaikanal/kodaikanal-hero.webp';

export function formatImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') {
    return DEFAULT_FALLBACK_IMAGE;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  // Legacy path corrections to prevent 404 timeouts
  if (trimmed.includes('/images/kodaikanal/kodaikanal-viewpoint.webp')) {
    return '/destinations/kodaikanal/kodaikanal-landscape.webp';
  }

  if (trimmed.startsWith('/images/kodaikanal/')) {
    return trimmed.replace('/images/kodaikanal/', '/destinations/kodaikanal/');
  }

  // Resolve remote Unsplash placeholder images to local WebP assets to prevent 10s+ image dev network timeouts
  if (trimmed.includes('images.unsplash.com')) {
    if (trimmed.includes('1589182373726')) return '/destinations/kodaikanal/kodaikanal-hero.webp';
    if (trimmed.includes('1544644181')) return '/destinations/kodaikanal/kodaikanal-lake.webp';
    if (trimmed.includes('1602216056')) return '/destinations/kodaikanal/kodaikanal-landscape.webp';
    if (trimmed.includes('1448375240')) return '/destinations/kodaikanal/kodaikanal-pines.webp';
    return DEFAULT_FALLBACK_IMAGE;
  }

  return trimmed;
}
