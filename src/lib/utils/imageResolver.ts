/**
 * Local Destination Image Resolver Utility
 * Powered by centralized IMAGE_REGISTRY.
 */

import { IMAGE_REGISTRY, DestinationImageMap } from '../constants/imageRegistry';

export function resolveDestinationImage(imagePath?: string | null, destinationSlug: string = 'kodaikanal'): string {
  const normSlug = (destinationSlug || 'kodaikanal').toLowerCase() as keyof typeof IMAGE_REGISTRY;
  const slugReg: DestinationImageMap = IMAGE_REGISTRY[normSlug] || IMAGE_REGISTRY.kodaikanal;

  if (!imagePath || imagePath.trim() === '') {
    return slugReg.hero;
  }

  // Handle broken remote unsplash links or unmapped paths safely
  if (imagePath.includes('unsplash.com') || imagePath.includes('placeholder')) {
    return slugReg.hero;
  }

  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  return `/destinations/${normSlug}/${imagePath}`;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
