import { z } from 'zod';

export const passengerSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().min(1, 'First name required'),
  last_name: z.string().min(1, 'Last name required'),
  age: z.number().int().min(0, 'Age must be positive'),
  gender: z.enum(['male', 'female', 'other']).default('male'),
  dietary_preference: z.string().default('standard'),
  special_assistance_notes: z.string().optional().nullable(),
});

export const bookingFormSchema = z.object({
  id: z.string().optional(),
  instance_id: z.string().uuid('Please select a package instance'),
  lead_booker_name: z.string().min(2, 'Lead booker name required'),
  lead_booker_email: z.string().email('Valid email required'),
  lead_booker_phone: z.string().min(10, 'Valid phone required'),
  start_date: z.string().min(10, 'Start date required'),
  end_date: z.string().min(10, 'End date required'),
  passenger_count: z.number().int().min(1).default(1),
  total_gross_amount: z.number().min(0, 'Gross amount must be positive'),
  total_tax_amount: z.number().min(0).default(0),
  total_net_cost: z.number().min(0).default(0),
  margin_amount: z.number().default(0),
  margin_percentage: z.number().default(0),
  currency: z.string().default('INR'),
  passengers: z.array(passengerSchema).min(1, 'At least one passenger required'),
});

export const bookingAmendmentSchema = z.object({
  booking_id: z.string().uuid(),
  amendment_type: z.enum(['date_change', 'passenger_change', 'room_upgrade', 'cancellation']),
  amendment_payload_json: z.record(z.string(), z.any()),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type BookingAmendmentFormValues = z.infer<typeof bookingAmendmentSchema>;
