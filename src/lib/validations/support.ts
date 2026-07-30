import { z } from 'zod';

export const supportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.enum(['booking', 'payment', 'refund', 'itinerary', 'general']).default('general'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  message: z.string().min(10, 'Please describe your request in detail'),
  bookingCode: z.string().optional(),
});

export type SupportTicketValues = z.infer<typeof supportTicketSchema>;
