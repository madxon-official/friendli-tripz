import { z } from 'zod';

export const packageFilterSchema = z.object({
  searchQuery: z.string().optional(),
  destinationId: z.string().uuid().optional(),
  destinationSlug: z.string().optional(),
  minDuration: z.coerce.number().min(1).optional(),
  maxDuration: z.coerce.number().max(30).optional(),
  minBudget: z.coerce.number().min(0).optional(),
  maxBudget: z.coerce.number().optional(),
  travelStyle: z.string().optional(),
  difficulty: z.enum(['easy', 'moderate', 'challenging', 'strenuous']).optional(),
  familyFriendly: z.boolean().optional(),
  adventure: z.boolean().optional(),
  honeymoon: z.boolean().optional(),
  weekend: z.boolean().optional(),
  group: z.boolean().optional(),
  sortBy: z.enum(['popular', 'price_asc', 'price_desc', 'duration_asc', 'duration_desc', 'newest']).default('popular'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  destination: z.string().min(1, 'Please select or specify a destination'),
  travellerCount: z.coerce.number().min(1, 'At least 1 traveller is required'),
  preferredDate: z.string().optional(),
  notes: z.string().optional(),
});

export type PackageFilterValues = z.infer<typeof packageFilterSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
