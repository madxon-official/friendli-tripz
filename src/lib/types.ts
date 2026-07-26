export interface TripDeparture {
  dateLabel: string;
  availabilityLabel?: string;
}

export interface Trip {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  destination: string;
  state: string;
  country: string;
  heroHeadline: string;
  heroSubheadline: string;
  duration: string;
  departureCity: string;
  startingPrice: string;
  nextTripDate: string;
  heroImage: string;
  galleryImages: string[];
  isFeatured: boolean;
  isAvailable: boolean;
}

export interface ExperienceFeature {
  id: string;
  title: string;
  description: string;
  iconName: 'compass' | 'wind' | 'users' | 'mapPin';
  badgeText?: string;
  imageBg?: string;
}

export interface WhyFriendliPrinciple {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: 'sparkles' | 'users' | 'coffee' | 'heartHandshake';
}

export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface CustomizationOption {
  category: string;
  options: string[];
}
