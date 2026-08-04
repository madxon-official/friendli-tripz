import { ExperienceRepository, ExperienceRecord } from '../repositories/experienceRepository';
import { IMAGE_REGISTRY } from '../constants/imageRegistry';

const DEFAULT_EXPERIENCES: ExperienceRecord[] = [
  {
    id: '22222222-0000-0000-0000-000000000001',
    destination_id: '11111111-0000-0000-0000-000000000001',
    category: 'Camping',
    title: 'Campfire & BBQ Night',
    slug: 'campfire-bbq-night',
    image: IMAGE_REGISTRY.kodaikanal.hero,
    duration: '3 Hours (Evening)',
    difficulty: 'Easy',
    description: 'Sit around a cozy campfire under mountain stars with grilled acoustic music and hot fresh drinks.',
    starting_price: 1200,
    includes: ['Acoustic Music', 'BBQ Grill', 'Hot Cocoa'],
    featured: true,
    destination: { slug: 'kodaikanal', name: 'Kodaikanal' },
  },
  {
    id: '22222222-0000-0000-0000-000000000002',
    destination_id: '11111111-0000-0000-0000-000000000001',
    category: 'Trekking',
    title: 'Dolphin Nose Cliffside Trek',
    slug: 'dolphin-nose-trek',
    image: IMAGE_REGISTRY.kodaikanal.experiences.trekking,
    duration: '4 Hours',
    difficulty: 'Moderate',
    description: 'Guided trek along Palani valley ridges ending at the iconic Dolphin Nose protruding rock formation.',
    starting_price: 999,
    includes: ['Guide', 'Safety Pass'],
    featured: true,
    destination: { slug: 'kodaikanal', name: 'Kodaikanal' },
  },
  {
    id: '22222222-0000-0000-0000-000000000003',
    destination_id: '11111111-0000-0000-0000-000000000002',
    category: 'Heritage',
    title: 'UNESCO Toy Train Heritage Ride',
    slug: 'toy-train-ride',
    image: IMAGE_REGISTRY.ooty.experiences.toytrain,
    duration: '2 Hours',
    difficulty: 'Easy',
    description: 'Ride the historic steam toy train through mountain tunnels, bridges, and emerald tea valleys.',
    starting_price: 850,
    includes: ['Reserved Ticket', 'Guide'],
    featured: true,
    destination: { slug: 'ooty', name: 'Ooty' },
  },
  {
    id: '22222222-0000-0000-0000-000000000004',
    destination_id: '11111111-0000-0000-0000-000000000003',
    category: 'Tea Estates',
    title: 'Valparai Coffee & Tea Plantation Safari',
    slug: 'valparai-tea-safari',
    image: IMAGE_REGISTRY.valparai.experiences.teaestate,
    duration: '3 Hours',
    difficulty: 'Easy',
    description: 'Guided jeep walk through private organic tea and coffee estates with fresh tea tasting.',
    starting_price: 1100,
    includes: ['Jeep Transfer', 'Tea Tasting'],
    featured: true,
    destination: { slug: 'valparai', name: 'Valparai' },
  },
];

export class ExperienceService {
  /**
   * Get experiences with optional destination slug filtering
   */
  static async getExperiences(destinationSlug?: string): Promise<ExperienceRecord[]> {
    const dbExperiences = await ExperienceRepository.getAll(destinationSlug);

    if (dbExperiences && dbExperiences.length > 0) {
      return dbExperiences;
    }

    if (destinationSlug && destinationSlug !== 'all') {
      return DEFAULT_EXPERIENCES.filter((e) => e.destination?.slug === destinationSlug.toLowerCase());
    }

    return DEFAULT_EXPERIENCES;
  }
}
