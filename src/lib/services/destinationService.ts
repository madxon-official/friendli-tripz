import { DestinationRepository, DestinationRecord } from '../repositories/destinationRepository';
import { AttractionRepository, AttractionRecord } from '../repositories/attractionRepository';
import { ExperienceRepository, ExperienceRecord } from '../repositories/experienceRepository';
import { PackageRepository, PackageRecord } from '../repositories/packageRepository';
import { IMAGE_REGISTRY } from '../constants/imageRegistry';

export interface FullDestinationData {
  destination: DestinationRecord;
  attractions: AttractionRecord[];
  experiences: ExperienceRecord[];
  packages: PackageRecord[];
}

const DEFAULT_DESTINATIONS: DestinationRecord[] = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    name: 'Kodaikanal',
    slug: 'kodaikanal',
    tagline: 'Princess of Hill Stations',
    overview: 'Nestled amidst the Palani Hills, Kodaikanal offers misty pine trails, serene lakes, and cliffside viewpoints.',
    why_visit: 'Crisp mountain air, serene natural lake, pine forest trails, and cool climate.',
    best_season: 'Oct – Mar',
    how_to_reach: 'Drive via Dindigul / Batlagundu ghat road. Nearest airport: Madurai (120 km).',
    weather: '12°C - 20°C cool alpine climate',
    district: 'Dindigul',
    state: 'Tamil Nadu',
    elevation: '2,133 m (6,998 ft)',
    status: 'published',
    featured: true,
    starting_price: 3499,
    gallery: [
      { id: 'g1', image: IMAGE_REGISTRY.kodaikanal.hero, image_type: 'hero' },
      { id: 'g2', image: IMAGE_REGISTRY.kodaikanal.cover, image_type: 'cover' },
    ],
    routes: [
      { id: 'r1', origin_city: 'Coimbatore', distance: '175 km', duration: '4.5 hrs', travel_mode: 'Road' },
      { id: 'r2', origin_city: 'Chennai', distance: '520 km', duration: '9.5 hrs', travel_mode: 'Train & Road' },
      { id: 'r3', origin_city: 'Bangalore', distance: '465 km', duration: '8.5 hrs', travel_mode: 'Road' },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    name: 'Ooty',
    slug: 'ooty',
    tagline: 'Queen of the Nilgiris',
    overview: 'Surrounded by rolling blue Nilgiri hills, tea gardens, and colonial charm. Famous for the UNESCO Nilgiri Mountain Toy Train.',
    why_visit: 'UNESCO Toy train journey, tea plantations, and panoramic Doddabetta peak views.',
    best_season: 'Sep – May',
    how_to_reach: 'Ghat road from Mettupalayam. Heritage toy train from Mettupalayam/Coonoor.',
    weather: '10°C - 22°C mild highland climate',
    district: 'Nilgiris',
    state: 'Tamil Nadu',
    elevation: '2,240 m (7,350 ft)',
    status: 'published',
    featured: true,
    starting_price: 3999,
    gallery: [
      { id: 'g1', image: IMAGE_REGISTRY.ooty.hero, image_type: 'hero' },
      { id: 'g2', image: IMAGE_REGISTRY.ooty.cover, image_type: 'cover' },
    ],
    routes: [
      { id: 'r1', origin_city: 'Coimbatore', distance: '85 km', duration: '3 hrs', travel_mode: 'Road / Toy Train' },
      { id: 'r2', origin_city: 'Bangalore', distance: '270 km', duration: '6 hrs', travel_mode: 'Road' },
    ],
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    name: 'Valparai',
    slug: 'valparai',
    tagline: 'Wilderness & Coffee Escapes',
    overview: 'An unspoiled rainforest plateau in the Anamalai Hills, surrounded by tea and coffee plantations, 40 hairpin bends, and abundant wildlife.',
    why_visit: '40 hairpin bends thrill drive, organic tea estates, and lion-tailed macaque sightings.',
    best_season: 'Oct – Mar',
    how_to_reach: 'Drive 40 hairpin bends from Pollachi (65 km). Nearest airport: Coimbatore (120 km).',
    weather: '15°C - 25°C tropical rainforest climate',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    elevation: '1,068 m (3,500 ft)',
    status: 'published',
    featured: true,
    starting_price: 4299,
    gallery: [
      { id: 'g1', image: IMAGE_REGISTRY.valparai.hero, image_type: 'hero' },
      { id: 'g2', image: IMAGE_REGISTRY.valparai.cover, image_type: 'cover' },
    ],
    routes: [
      { id: 'r1', origin_city: 'Coimbatore', distance: '105 km', duration: '3.5 hrs', travel_mode: 'Road' },
      { id: 'r2', origin_city: 'Kochi', distance: '165 km', duration: '4.5 hrs', travel_mode: 'Road' },
    ],
  },
];

const ALLOWED_SLUGS = ['kodaikanal', 'ooty', 'valparai'];

export class DestinationService {
  /**
   * Get all active destinations (strictly Kodaikanal, Ooty, Valparai)
   */
  static async getExploreDestinations(): Promise<DestinationRecord[]> {
    const dbDestinations = await DestinationRepository.getAllPublished();

    if (dbDestinations && dbDestinations.length > 0) {
      const filtered = dbDestinations.filter((d) => ALLOWED_SLUGS.includes(d.slug.toLowerCase()));
      if (filtered.length > 0) {
        return filtered;
      }
    }

    return DEFAULT_DESTINATIONS;
  }

  /**
   * Get complete destination details by slug
   */
  static async getDestinationBySlug(slug: string): Promise<FullDestinationData | null> {
    const normSlug = slug.toLowerCase();
    if (!ALLOWED_SLUGS.includes(normSlug)) {
      return null;
    }

    let dest = await DestinationRepository.getBySlug(normSlug);

    if (!dest) {
      dest = DEFAULT_DESTINATIONS.find((d) => d.slug === normSlug) || DEFAULT_DESTINATIONS[0];
    }

    const attractions = await AttractionRepository.getByDestinationId(dest.id);
    const experiences = await ExperienceRepository.getByDestinationId(dest.id);
    const packages = await PackageRepository.getByDestinationId(dest.id);

    return {
      destination: dest,
      attractions,
      experiences,
      packages,
    };
  }
}
