import { z } from 'zod';

export const paymentScheduleSchema = z.object({
  id: z.string().optional(),
  booking_id: z.string().uuid(),
  milestone_type: z.enum(['deposit', 'balance', 'installment', 'custom']),
  due_date: z.string().min(10, 'Due date required'),
  amount_due: z.number().min(0, 'Amount due must be positive'),
  amount_paid: z.number().min(0).default(0),
  status: z.enum(['pending', 'paid', 'overdue', 'waived']).default('pending'),
});

export const recordTransactionSchema = z.object({
  booking_id: z.string().uuid(),
  schedule_id: z.string().uuid().optional().nullable(),
  gateway_provider: z.enum(['razorpay', 'stripe', 'phonepe']).default('razorpay'),
  gateway_transaction_id: z.string().min(3, 'Transaction ID required'),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().default('INR'),
  payment_method: z.string().optional().nullable(),
});

export type PaymentScheduleFormValues = z.infer<typeof paymentScheduleSchema>;
export type RecordTransactionFormValues = z.infer<typeof recordTransactionSchema>;
