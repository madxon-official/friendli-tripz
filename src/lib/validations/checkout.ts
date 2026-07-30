import { z } from 'zod';

export const passengerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  age: z.coerce.number().min(0, 'Age must be 0 or greater'),
  gender: z.enum(['male', 'female', 'other']),
  dietaryPreference: z.enum(['vegetarian', 'non_vegetarian', 'vegan', 'jain']).default('vegetarian'),
  specialAssistanceNotes: z.string().optional(),
  idDocumentNumber: z.string().optional(),
  idDocumentType: z.enum(['aadhaar', 'passport', 'voter_id', 'driving_license']).optional(),
});

export const checkoutFormSchema = z.object({
  leadBookerName: z.string().min(2, 'Full name must be at least 2 characters'),
  leadBookerEmail: z.string().email('Invalid email address'),
  leadBookerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  startDate: z.string().min(1, 'Start date is required'),
  passengers: z.array(passengerSchema).min(1, 'At least one passenger is required'),
  couponCode: z.string().optional(),
  gstNumber: z.string().optional(),
  specialRequests: z.string().optional(),
  depositPercentage: z.coerce.number().default(25),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
