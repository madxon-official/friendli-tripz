import { z } from 'zod';

export const destinationGallerySchema = z.object({
  id: z.string().optional(),
  image_url: z.string().min(1, 'Image URL is required'),
  thumbnail_url: z.string().optional().nullable(),
  medium_url: z.string().optional().nullable(),
  alt_text: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  photographer: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  display_order: z.number().default(0),
});

export const destinationHighlightSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  icon_name: z.string().default('Sparkles'),
  display_order: z.number().default(0),
});

export const destinationEmergencyContactSchema = z.object({
  id: z.string().optional(),
  service_type: z.string().min(1, 'Service type is required'),
  title: z.string().min(1, 'Title is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  alt_phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  display_order: z.number().default(0),
});

export const destinationFAQSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  display_order: z.number().default(0),
});

export const destinationFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Destination name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lower-case alphanumeric with hyphens'),
  country_id: z.string().uuid('Please select a valid country'),
  state_id: z.string().uuid('Please select a valid state'),
  category_id: z.string().uuid('Please select a valid category'),
  
  // Descriptions
  short_description: z.string().max(300, 'Short tagline must be under 300 characters').optional().nullable(),
  long_description: z.string().optional().nullable(),
  
  // Geographic
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  
  // Quick Facts & Parameters
  ideal_duration: z.string().optional().nullable(),
  best_season: z.string().optional().nullable(),
  climate: z.string().optional().nullable(),
  travel_difficulty: z.enum(['easy', 'moderate', 'challenging', 'strenuous']).default('easy'),
  adventure_level: z.enum(['low', 'moderate', 'high', 'extreme']).default('low'),
  budget_level: z.enum(['budget', 'mid_range', 'luxury', 'ultra_luxury']).default('mid_range'),
  family_friendly: z.boolean().default(true),
  pet_friendly: z.boolean().default(false),
  accessibility_notes: z.string().optional().nullable(),
  temperature_range: z.string().optional().nullable(),
  elevation: z.string().optional().nullable(),
  average_budget_per_day: z.string().optional().nullable(),
  
  // Media
  hero_banner_url: z.string().optional().nullable(),
  featured_image_url: z.string().optional().nullable(),
  
  // Travel Guide Information
  best_time_to_visit: z.string().optional().nullable(),
  how_to_reach: z.string().optional().nullable(),
  nearest_airport: z.string().optional().nullable(),
  nearest_railway_station: z.string().optional().nullable(),
  nearest_bus_stand: z.string().optional().nullable(),
  languages_spoken: z.array(z.string()).default([]),
  local_transport: z.string().optional().nullable(),

  // Rich SEO & Guides
  introduction: z.string().optional().nullable(),
  travel_tips: z.string().optional().nullable(),
  food_guide: z.string().optional().nullable(),
  shopping_guide: z.string().optional().nullable(),
  weather_guide: z.string().optional().nullable(),
  things_to_avoid: z.string().optional().nullable(),
  best_months: z.array(z.string()).default([]),
  ideal_for: z.array(z.string()).default([]),

  // SEO Meta
  meta_title: z.string().max(70, 'Meta title recommended max 70 chars').optional().nullable(),
  meta_description: z.string().max(160, 'Meta description recommended max 160 chars').optional().nullable(),
  meta_keywords: z.array(z.string()).default([]),
  og_image_url: z.string().optional().nullable(),
  canonical_url: z.string().optional().nullable(),

  // Controls
  status: z.enum(['draft', 'published', 'coming_soon', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  homepage_order: z.number().int().default(0),
  website_visibility: z.boolean().default(true),

  // Relational Collections
  tag_ids: z.array(z.string()).default([]),
  gallery: z.array(destinationGallerySchema).default([]),
  highlights: z.array(destinationHighlightSchema).default([]),
  emergency_contacts: z.array(destinationEmergencyContactSchema).default([]),
  faqs: z.array(destinationFAQSchema).default([]),
});

export type DestinationFormValues = z.infer<typeof destinationFormSchema>;
