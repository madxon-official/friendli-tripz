import { AdminRole } from './roles';

export type Permission =
  | 'dashboard.view'
  | 'enquiries.view'
  | 'enquiries.update'
  | 'enquiries.notes'
  | 'enquiries.archive'
  | 'team.view'
  | 'team.invite'
  | 'team.change_role'
  | 'team.change_status'
  | 'settings.security';

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  owner: [
    'dashboard.view',
    'enquiries.view',
    'enquiries.update',
    'enquiries.notes',
    'enquiries.archive',
    'team.view',
    'team.invite',
    'team.change_role',
    'team.change_status',
    'settings.security',
  ],
  admin: [
    'dashboard.view',
    'enquiries.view',
    'enquiries.update',
    'enquiries.notes',
    'enquiries.archive',
  ],
  operations: [
    'dashboard.view',
    'enquiries.view',
    'enquiries.update',
    'enquiries.notes',
  ],
  sales: [
    'dashboard.view',
    'enquiries.view',
    'enquiries.update',
    'enquiries.notes',
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
