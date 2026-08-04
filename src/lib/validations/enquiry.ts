import { z } from 'zod';

export const tripEnquirySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  starting_location: z.string().optional().or(z.literal('')),
  destination: z.string().min(1, { message: 'Please select a destination.' }),
  travel_date: z.string().optional().or(z.literal('')),
  budget: z.string().optional().or(z.literal('')),
  adults: z.number().min(1, { message: 'At least 1 adult is required.' }),
  children: z.number().min(0).default(0),
  message: z.string().optional().or(z.literal('')),
});

export type TripEnquirySchemaType = z.infer<typeof tripEnquirySchema>;
