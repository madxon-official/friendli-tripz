import { z } from 'zod';

export const aiPlannerPromptSchema = z.object({
  prompt: z.string().min(5, 'Please describe your trip preferences in a few words'),
  passengers: z.coerce.number().min(1).default(2),
  startingLocation: z.string().optional(),
});

export type AIPlannerPromptValues = z.infer<typeof aiPlannerPromptSchema>;
