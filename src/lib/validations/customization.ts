import { z } from 'zod';

export const customizationEditSchema = z.object({
  instanceId: z.string().uuid(),
  dayId: z.string().uuid(),
  segmentId: z.string().uuid(),
  action: z.enum(['swap_hotel', 'swap_activity', 'add_activity', 'remove_segment', 'change_dates', 'change_passengers']),
  newItemId: z.string().optional(),
  newCost: z.number().optional(),
  newTitle: z.string().optional(),
});

export type CustomizationEditValues = z.infer<typeof customizationEditSchema>;
