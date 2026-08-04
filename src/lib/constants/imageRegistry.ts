/**
 * Centralized Destination Image Registry for Friendli Tripz
 * Maps destination keys to verified local static assets in /public/destinations/
 */

export interface DestinationImageMap {
  hero: string;
  cover: string;
  gallery: string[];
  experiences: Record<string, string>;
  packages: Record<string, string>;
}

export const IMAGE_REGISTRY: Record<'kodaikanal' | 'ooty' | 'valparai', DestinationImageMap> = {
  kodaikanal: {
    hero: '/destinations/kodaikanal/hero.webp',
    cover: '/destinations/kodaikanal/cover.webp',
    gallery: [
      '/destinations/kodaikanal/hero.webp',
      '/destinations/kodaikanal/cover.webp',
      '/destinations/kodaikanal/pines.webp',
      '/destinations/kodaikanal/waterfall.webp',
      '/destinations/kodaikanal/kodaikanal-landscape.webp',
    ],
    experiences: {
      campfire: '/destinations/kodaikanal/hero.webp',
      trekking: '/destinations/kodaikanal/kodaikanal-landscape.webp',
      waterfall: '/destinations/kodaikanal/waterfall.webp',
      pines: '/destinations/kodaikanal/pines.webp',
    },
    packages: {
      default: '/destinations/kodaikanal/hero.webp',
      escape: '/destinations/kodaikanal/cover.webp',
    },
  },
  ooty: {
    hero: '/destinations/ooty/hero.webp',
    cover: '/destinations/ooty/cover.webp',
    gallery: [
      '/destinations/ooty/hero.webp',
      '/destinations/ooty/cover.webp',
      '/destinations/ooty/toytrain.webp',
      '/destinations/ooty/garden.webp',
      '/destinations/ooty/peak.webp',
    ],
    experiences: {
      toytrain: '/destinations/ooty/toytrain.webp',
      garden: '/destinations/ooty/garden.webp',
      peak: '/destinations/ooty/peak.webp',
    },
    packages: {
      default: '/destinations/ooty/hero.webp',
      heritage: '/destinations/ooty/cover.webp',
    },
  },
  valparai: {
    hero: '/destinations/valparai/hero.webp',
    cover: '/destinations/valparai/cover.webp',
    gallery: [
      '/destinations/valparai/hero.webp',
      '/destinations/valparai/cover.webp',
      '/destinations/valparai/teaestate.webp',
      '/destinations/valparai/waterfall.webp',
      '/destinations/valparai/jeepsafari.webp',
    ],
    experiences: {
      teaestate: '/destinations/valparai/teaestate.webp',
      waterfall: '/destinations/valparai/waterfall.webp',
      jeepsafari: '/destinations/valparai/jeepsafari.webp',
    },
    packages: {
      default: '/destinations/valparai/hero.webp',
      retreat: '/destinations/valparai/cover.webp',
    },
  },
};

export function getImageUrl(
  destinationSlug: string = 'kodaikanal',
  key: 'hero' | 'cover' = 'hero'
): string {
  const norm = destinationSlug.toLowerCase() as keyof typeof IMAGE_REGISTRY;
  const dest = IMAGE_REGISTRY[norm] || IMAGE_REGISTRY.kodaikanal;
  return dest[key];
}
