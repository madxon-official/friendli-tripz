import { PackageRepository, PackageRecord } from '../repositories/packageRepository';
import { IMAGE_REGISTRY } from '../constants/imageRegistry';

const DEFAULT_PACKAGES: PackageRecord[] = [
  {
    id: '33333333-0000-0000-0000-000000000001',
    destination_id: '11111111-0000-0000-0000-000000000001',
    name: 'Misty Kodaikanal Escape',
    slug: 'misty-kodaikanal-escape',
    duration: '3 Days / 2 Nights',
    duration_days: 3,
    duration_nights: 2,
    min_people: 2,
    max_people: 12,
    starting_price: 4999,
    status: 'published',
    is_customizable: true,
    hero_image: IMAGE_REGISTRY.kodaikanal.hero,
    overview: 'Our signature weekend escape to Kodaikanal designed for friends, couples, and small groups looking to slow down and vibe in cool mountain air.',
    itinerary: [
      { day: 1, title: 'Arrival & Lakeside Sunset', activities: ['Check-in to forest cottage', 'Kodai lake boating', 'Coaker’s walk sunset'] },
      { day: 2, title: 'Cliffs, Waterfalls & Campfire', activities: ['Dolphin nose cliff trek', 'Vattakanal falls swim', 'Barbecue campfire party'] },
      { day: 3, title: 'Pine Forest & Farewell', activities: ['Pine forest walk', 'Local chocolate shopping', 'Departure'] }
    ],
    includes: ['Stay', 'Transport', 'Meals', 'Activities'],
    accommodation: 'Boutique Wooden Cottage',
    transport: 'Private SUV Transfer',
    meals: 'Daily Breakfast & 2 Bonfire Dinners',
    featured: true,
    destination: { slug: 'kodaikanal', name: 'Kodaikanal' },
  } as unknown as PackageRecord,
  {
    id: '33333333-0000-0000-0000-000000000002',
    destination_id: '11111111-0000-0000-0000-000000000002',
    name: 'Nilgiri Heritage & Tea Trail',
    slug: 'nilgiri-heritage-tea-trail',
    duration: '3 Days / 2 Nights',
    duration_days: 3,
    duration_nights: 2,
    min_people: 2,
    max_people: 12,
    starting_price: 5499,
    status: 'published',
    is_customizable: true,
    hero_image: IMAGE_REGISTRY.ooty.hero,
    overview: 'Unwind amidst green tea slopes and misty valleys with a blend of heritage train rides and tranquil lake views.',
    itinerary: [
      { day: 1, title: 'Arrival & Tea Slopes', activities: ['Tea estate bungalow check-in', 'Tea museum tour'] },
      { day: 2, title: 'Toy Train & Coonoor Vistas', activities: ['Nilgiri Toy Train ride to Coonoor', 'Sims Park walk'] },
      { day: 3, title: 'Sunrise Peak & Depart', activities: ['Doddabetta sunrise', 'Return home'] }
    ],
    includes: ['Stay', 'Transport', 'Meals', 'Toy Train Ticket'],
    accommodation: 'Heritage Tea Estate Bungalow',
    transport: 'Private Cab',
    meals: 'Breakfast & High Tea',
    featured: true,
    destination: { slug: 'ooty', name: 'Ooty' },
  } as unknown as PackageRecord,
  {
    id: '33333333-0000-0000-0000-000000000003',
    destination_id: '11111111-0000-0000-0000-000000000003',
    name: 'Valparai Rainforest & Wildlife Retreat',
    slug: 'valparai-rainforest-retreat',
    duration: '2 Days / 1 Night',
    duration_days: 2,
    duration_nights: 1,
    min_people: 2,
    max_people: 8,
    starting_price: 4299,
    status: 'published',
    is_customizable: true,
    hero_image: IMAGE_REGISTRY.valparai.hero,
    overview: 'Unwind in Valparai rainforest coffee estate with 40 hairpin bends drive and waterfall exploration.',
    itinerary: [
      { day: 1, title: 'Ghat Climb & Estate Vibe', activities: ['40 Hairpin bends drive', 'Coffee plantation bungalow check-in'] },
      { day: 2, title: 'Coffee Walk & Depart', activities: ['Guided coffee plantation trail', 'Tea tasting', 'Return drive'] }
    ],
    includes: ['Stay', 'Meals', 'Guided Walk'],
    accommodation: 'Private Estate Plantation Stay',
    transport: '4x4 Estate Vehicle',
    meals: 'Estate Breakfast & Dinner',
    featured: true,
    destination: { slug: 'valparai', name: 'Valparai' },
  } as unknown as PackageRecord,
];

export class PackageService {
  /**
   * Get packages with optional destination slug filtering
   */
  static async getPackages(destinationSlug?: string): Promise<PackageRecord[]> {
    const dbPackages = await PackageRepository.getAll(destinationSlug);

    if (dbPackages && dbPackages.length > 0) {
      return dbPackages;
    }

    if (destinationSlug && destinationSlug !== 'all') {
      return DEFAULT_PACKAGES.filter((p) => p.destination?.slug === destinationSlug.toLowerCase());
    }

    return DEFAULT_PACKAGES;
  }

  /**
   * Get single package by slug
   */
  static async getPackageBySlug(slug: string): Promise<PackageRecord | null> {
    const dbPkg = await PackageRepository.getBySlug(slug);

    if (dbPkg) {
      return dbPkg;
    }

    return DEFAULT_PACKAGES.find((p) => p.slug === slug) || DEFAULT_PACKAGES[0];
  }
}
