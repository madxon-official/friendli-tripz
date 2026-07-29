import { z } from 'zod';

export const packageDepartureSchema = z.object({
  id: z.string().optional(),
  release_id: z.string().uuid('Please select a package release'),
  departure_code: z.string().min(3, 'Departure code required'),
  start_date: z.string().min(10, 'Start date required'),
  end_date: z.string().min(10, 'End date required'),
  min_travellers: z.number().int().min(1).default(8),
  max_travellers: z.number().int().min(1).default(14),
  is_guaranteed: z.boolean().default(false),
  status: z.enum(['open', 'guaranteed', 'sold_out', 'cancelled', 'in_progress']).default('open'),
});

export type PackageDepartureFormValues = z.infer<typeof packageDepartureSchema>;
