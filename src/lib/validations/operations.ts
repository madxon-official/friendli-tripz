import { z } from 'zod';

export const vehicleAssignmentSchema = z.object({
  deploymentId: z.string().uuid(),
  vehicleModel: z.string().min(2, 'Vehicle model is required'),
  vehicleNumber: z.string().min(5, 'Vehicle registration number is required'),
});

export const driverAssignmentSchema = z.object({
  deploymentId: z.string().uuid(),
  driverName: z.string().min(2, 'Driver name is required'),
  driverPhone: z.string().min(10, 'Valid phone number is required'),
  licenseNumber: z.string().optional(),
});

export const operationalAlertSchema = z.object({
  deploymentId: z.string().uuid().optional(),
  alertLevel: z.enum(['info', 'warning', 'critical', 'emergency']).default('warning'),
  alertType: z.string().min(2, 'Alert type is required'),
  message: z.string().min(5, 'Message details required'),
});

export type VehicleAssignmentValues = z.infer<typeof vehicleAssignmentSchema>;
export type DriverAssignmentValues = z.infer<typeof driverAssignmentSchema>;
export type OperationalAlertValues = z.infer<typeof operationalAlertSchema>;
