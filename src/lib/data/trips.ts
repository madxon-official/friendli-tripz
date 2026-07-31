import { Trip, ExperienceFeature, WhyFriendliPrinciple, HowItWorksStep } from '../types';

export const BRAND_INFO = {
  name: 'Friendli Tripz',
  tagline: 'Travel feels better with friends.',
  eyebrow: 'FRIENDLI TRIPZ PRESENTS',
  badgeTag: 'FRIENDLI TRIPZ × KODAIKANAL',
  chapterLabel: 'CHAPTER 01',
  coordinates: '10.2381° N, 77.4892° E',
  trustLine: 'Curated trip · Friendli support · Made for good memories',
  contactEmail: null as string | null,
  whatsappUrl: null as string | null,
  instagramUrl: null as string | null,
};

export const KODAIKANAL_TRIP: Trip = {
  id: 'kodai-01',
  slug: 'kodaikanal',
  name: 'Kodaikanal Mountain Escape',
  tagline: 'Misty roads, pine forests, and mountain air with good company.',
  destination: 'Kodaikanal, Tamil Nadu',
  state: 'Tamil Nadu',
  country: 'India',
  heroHeadline: 'Kodaikanal hits different with the right people.',
  heroSubheadline: "Misty roads, mountain views and a trip worth remembering. We've planned the Kodaikanal escape — you just have to show up.",
  duration: '4 Days / 3 Nights',
  departureCity: 'Madurai',
  startingPrice: '₹14,500 per person',
  nextTripDate: 'October 15, 2026',
  // Official supplied local Kodaikanal photography (WebP format)
  heroImage: '/images/kodaikanal/kodaikanal-hero.webp',
  galleryImages: [
    '/images/kodaikanal/kodaikanal-lake.webp',
    '/images/kodaikanal/kodaikanal-landscape.webp',
    '/images/kodaikanal/kodaikanal-waterfall.webp',
    '/images/kodaikanal/kodaikanal-viewpoint.webp',
    '/images/kodaikanal/kodaikanal-pines.webp',
    '/images/kodaikanal/kodaikanal-cloud.webp',
    '/images/kodaikanal/kodaikanal-word.webp',
  ],
  isFeatured: true,
  isAvailable: true,
};

export const EXPERIENCE_FEATURES: ExperienceFeature[] = [
  {
    id: 'exp-1',
    title: 'See More',
    description: 'Experience Kodaikanal beyond rushing from one checkpoint to another.',
    iconName: 'compass',
    imageBg: '/images/kodaikanal/kodaikanal-lake.webp',
  },
  {
    id: 'exp-2',
    title: 'Rush Less',
    description: 'Give the trip enough breathing room to actually enjoy the hills.',
    iconName: 'wind',
    imageBg: '/images/kodaikanal/kodaikanal-landscape.webp',
  },
  {
    id: 'exp-3',
    title: 'Travel Together',
    description: 'Because the right company can turn a good destination into a great memory.',
    iconName: 'users',
    imageBg: '/images/kodaikanal/kodaikanal-waterfall.webp',
  },
];

export const WHY_FRIENDLI_PRINCIPLES: WhyFriendliPrinciple[] = [
  {
    id: 'prin-1',
    number: '01',
    title: 'Thoughtfully Planned',
    description: 'We handle the details so you can focus on the experience.',
    iconName: 'sparkles',
  },
  {
    id: 'prin-2',
    number: '02',
    title: 'Good Company',
    description: 'Trips designed around sharing experiences, not just sharing transport.',
    iconName: 'users',
  },
  {
    id: 'prin-3',
    number: '03',
    title: 'Room to Enjoy',
    description: "A trip shouldn't feel like racing through a sightseeing checklist.",
    iconName: 'coffee',
  },
  {
    id: 'prin-4',
    number: '04',
    title: 'Human Support',
    description: "When you need help, you're talking to people — not fighting through a support maze.",
    iconName: 'heartHandshake',
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    stepNumber: '01',
    title: 'Discover',
    description: "See what we've planned for Kodaikanal.",
  },
  {
    stepNumber: '02',
    title: 'Make It Yours',
    description: 'Join the standard trip or tell us what you would like changed.',
  },
  {
    stepNumber: '03',
    title: 'Send Your Request',
    description: 'Share your traveller details and preferences.',
  },
  {
    stepNumber: '04',
    title: 'We Connect',
    description: 'Friendli Tripz reviews your request and continues the conversation with you personally.',
  },
];
