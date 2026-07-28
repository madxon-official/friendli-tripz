import { AdminRole } from './roles';

export type Permission =
  | 'dashboard.view'
  | 'team.view'
  | 'team.invite'
  | 'team.edit'
  | 'team.archive'
  | 'team.activate'
  | 'team.deactivate'
  | 'team.role.change'
  | 'team.department.change'
  | 'team.delete'
  | 'team.transfer_ownership'
  | 'enquiry.view'
  | 'enquiry.view_all'
  | 'enquiry.update'
  | 'enquiry.archive'
  | 'enquiry.assign'
  | 'enquiry.notes'
  | 'trip.view'
  | 'trip.create'
  | 'trip.update'
  | 'trip.delete'
  | 'booking.view'
  | 'booking.update'
  | 'payment.view'
  | 'payment.update'
  | 'settings.security'
  | 'settings.website'
  | 'settings.team';

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  owner: [
    'dashboard.view',
    'team.view',
    'team.invite',
    'team.edit',
    'team.archive',
    'team.activate',
    'team.deactivate',
    'team.role.change',
    'team.department.change',
    'team.delete',
    'team.transfer_ownership',
    'enquiry.view',
    'enquiry.view_all',
    'enquiry.update',
    'enquiry.archive',
    'enquiry.assign',
    'enquiry.notes',
    'trip.view',
    'trip.create',
    'trip.update',
    'trip.delete',
    'booking.view',
    'booking.update',
    'payment.view',
    'payment.update',
    'settings.security',
    'settings.website',
    'settings.team',
  ],
  admin: [
    'dashboard.view',
    'team.view',
    'team.invite',
    'team.edit',
    'team.archive',
    'team.activate',
    'team.deactivate',
    'team.role.change',
    'team.department.change',
    'enquiry.view',
    'enquiry.view_all',
    'enquiry.update',
    'enquiry.archive',
    'enquiry.assign',
    'enquiry.notes',
    'trip.view',
    'trip.create',
    'trip.update',
    'booking.view',
    'booking.update',
    'payment.view',
    'settings.team',
  ],
  operations: [
    'dashboard.view',
    'enquiry.view',
    'enquiry.update',
    'enquiry.notes',
    'trip.view',
    'trip.update',
    'booking.view',
    'booking.update',
  ],
  sales: [
    'dashboard.view',
    'enquiry.view',
    'enquiry.update',
    'enquiry.assign',
    'enquiry.notes',
  ],
  support: [
    'dashboard.view',
    'enquiry.view',
    'enquiry.notes',
    'booking.view',
  ],
  viewer: [
    'dashboard.view',
    'enquiry.view',
    'trip.view',
    'booking.view',
    'payment.view',
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role as AdminRole];
  if (!rolePermissions) return false;
  return rolePermissions.includes(permission);
}

export function getRolePermissions(role: string): Permission[] {
  return ROLE_PERMISSIONS[role as AdminRole] || [];
}
