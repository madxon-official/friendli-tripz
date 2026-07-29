import { z } from 'zod';

export const offeringPricingRuleSchema = z.object({
  id: z.string().optional(),
  participant_type: z.enum(['adult', 'child', 'senior', 'foreigner', 'group_flat']),
  base_price: z.number().min(0, 'Price must be non-negative'),
  currency: z.string().default('INR'),
  effective_start_date: z.string().optional().nullable(),
  effective_end_date: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export const activityOfferingFormSchema = z.object({
  id: z.string().optional(),
  master_activity_id: z.string().uuid('Please select a master activity'),
  attraction_id: z.string().uuid().optional().nullable(),
  destination_id: z.string().uuid().optional().nullable(),
  title: z.string().min(2, 'Offering title must be at least 2 characters'),
  capacity_type: z.enum(['per_person', 'per_vehicle', 'per_group', 'slot_based']).default('per_person'),
  max_capacity: z.number().int().min(1).default(1),
  duration_mins: z.number().int().min(5).default(60),
  vendor_name: z.string().optional().nullable(),
  booking_advance_days: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  pricing_rules: z.array(offeringPricingRuleSchema).default([]),
});

export const masterActivityFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Activity name is required'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lower-case alphanumeric with hyphens'),
  category_id: z.string().uuid('Please select an activity category'),
  short_description: z.string().optional().nullable(),
  full_description: z.string().optional().nullable(),
  fitness_level: z.enum(['none', 'light', 'moderate', 'strenuous', 'extreme']).default('light'),
  age_suitability: z.enum(['all_ages', 'kids', 'adults_only', 'seniors']).default('all_ages'),
  min_age: z.number().int().min(0).default(0),
  required_gear: z.array(z.string()).default([]),
  provided_gear: z.array(z.string()).default([]),
  default_duration_mins: z.number().int().min(5).default(60),
  is_indoor: z.boolean().default(false),
  weather_dependent: z.boolean().default(true),
  hero_image_url: z.string().optional().nullable(),
  icon_name: z.string().default('Activity'),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'coming_soon', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
});

export const operatingScheduleSchema = z.object({
  id: z.string().optional(),
  day_of_week: z.number().int().min(0).max(6),
  open_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM'),
  close_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format HH:MM'),
  is_closed: z.boolean().default(false),
});

export const operationalExceptionSchema = z.object({
  id: z.string().optional(),
  start_date: z.string().min(10, 'Start date required'),
  end_date: z.string().min(10, 'End date required'),
  exception_type: z.enum(['seasonal_closure', 'maintenance', 'weather', 'special_hours', 'government_holiday']),
  reason: z.string().optional().nullable(),
  override_open_time: z.string().optional().nullable(),
  override_close_time: z.string().optional().nullable(),
  validation_impact: z.enum(['informational', 'warning', 'blocking']).default('blocking'),
});

export const attractionFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Attraction name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lower-case alphanumeric with hyphens'),
  destination_id: z.string().uuid('Please select a parent destination'),
  zone_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid('Please select an attraction category'),
  
  latitude: z.number(),
  longitude: z.number(),
  address_text: z.string().optional().nullable(),
  
  short_tagline: z.string().max(300, 'Tagline max 300 characters').optional().nullable(),
  description: z.string().optional().nullable(),
  suggested_duration_mins: z.number().int().min(15).default(90),
  
  pet_allowed: z.boolean().default(false),
  wheelchair_accessible: z.boolean().default(false),
  parking_available: z.boolean().default(true),
  restrooms_available: z.boolean().default(true),
  ideal_for: z.array(z.string()).default([]),
  
  entry_fee_type: z.string().default('free'),
  adult_entry_fee: z.number().min(0).default(0),
  child_entry_fee: z.number().min(0).default(0),
  foreign_national_fee: z.number().min(0).default(0),
  
  hero_banner_url: z.string().optional().nullable(),
  featured_image_url: z.string().optional().nullable(),
  
  meta_title: z.string().max(70).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
  meta_keywords: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'coming_soon', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
  website_visibility: z.boolean().default(true),
  
  schedules: z.array(operatingScheduleSchema).default([]),
  exceptions: z.array(operationalExceptionSchema).default([]),
});

export type AttractionFormValues = z.infer<typeof attractionFormSchema>;
export type MasterActivityFormValues = z.infer<typeof masterActivityFormSchema>;
export type ActivityOfferingFormValues = z.infer<typeof activityOfferingFormSchema>;
