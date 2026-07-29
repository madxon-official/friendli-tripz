import { z } from 'zod';

export const pricingTreeSchema = z.object({
  base_adult_price: z.number().min(0, 'Base price must be positive'),
  base_child_price: z.number().min(0).default(0),
  single_supplement: z.number().min(0).default(0),
  currency: z.string().default('INR'),
  margin_percentage: z.number().min(0).max(100).default(18),
  gst_tax_percentage: z.number().min(0).max(28).default(5),
});

export const itineraryDaySegmentSchema = z.object({
  id: z.string().optional(),
  sequence_order: z.number().int().min(1),
  segment_type: z.enum([
    'attraction_visit',
    'activity_experience',
    'transit_block',
    'meal_block',
    'leisure_block',
    'lodging_transition',
    'meeting_point',
    'service_block',
  ]),
  planned_start_time: z.string().optional().nullable(),
  planned_end_time: z.string().optional().nullable(),
  duration_mins: z.number().int().min(5).default(30),
  attraction_id: z.string().uuid().optional().nullable(),
  activity_offering_id: z.string().uuid().optional().nullable(),
  segment_title: z.string().min(2, 'Segment title required'),
  custom_instructions: z.string().optional().nullable(),
  cost_override: z.number().min(0).optional().nullable(),
  is_included_in_package: z.boolean().default(true),
});

export const itineraryDaySchema = z.object({
  id: z.string().optional(),
  day_number: z.number().int().min(1),
  theme_title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  segments: z.array(itineraryDaySegmentSchema).default([]),
});

export const packageFamilyFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Family name is required'),
  family_slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lower-case alphanumeric with hyphens'),
  destination_id: z.string().uuid('Select a destination'),
  category_id: z.string().uuid().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const packageReleaseFormSchema = z.object({
  id: z.string().optional(),
  family_id: z.string().uuid('Select a package family'),
  version_tag: z.string().min(2, 'Version tag e.g. v1.0 required'),
  title: z.string().min(3, 'Package title required'),
  duration_days: z.number().int().min(1).default(3),
  duration_nights: z.number().int().min(0).default(2),
  base_pricing_tree_json: pricingTreeSchema,
  commercial_terms_text: z.string().optional().nullable(),
  status: z.enum(['draft', 'active', 'superseded', 'archived']).default('draft'),
  days: z.array(itineraryDaySchema).default([]),
});

export type PackageFamilyFormValues = z.infer<typeof packageFamilyFormSchema>;
export type PackageReleaseFormValues = z.infer<typeof packageReleaseFormSchema>;
