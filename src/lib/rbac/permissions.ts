import { AdminRole } from './roles';

export type Permission =
  | 'dashboard.view'
  | 'enquiry.view'
  | 'enquiry.create'
  | 'enquiry.update'
  | 'enquiry.assign'
  | 'enquiry.notes'
  | 'destination.view'
  | 'destination.create'
  | 'destination.update'
  | 'destination.delete'
  | 'experience.view'
  | 'experience.create'
  | 'experience.update'
  | 'package.view'
  | 'package.create'
  | 'package.update'
  | 'package.delete'
  | 'blog.view'
  | 'blog.publish'
  | 'blog.delete'
  | 'faq.view'
  | 'faq.manage'
  | 'homepage.view'
  | 'homepage.edit'
  | 'testimonial.view'
  | 'testimonial.manage'
  | 'tracker.view'
  | 'tracker.update'
  | 'team.view'
  | 'team.invite'
  | 'team.edit'
  | 'team.delete'
  | 'team.activate'
  | 'team.deactivate'
  | 'team.role_change'
  | 'team.role.change'
  | 'team.department_change'
  | 'team.department.change'
  | 'team.transfer_ownership'
  | 'settings.view'
  | 'settings.manage'
  | 'audit.view';

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  owner: [
    'dashboard.view',
    'enquiry.view',
    'enquiry.create',
    'enquiry.update',
    'enquiry.assign',
    'enquiry.notes',
    'destination.view',
    'destination.create',
    'destination.update',
    'destination.delete',
    'experience.view',
    'experience.create',
    'experience.update',
    'package.view',
    'package.create',
    'package.update',
    'package.delete',
    'blog.view',
    'blog.publish',
    'blog.delete',
    'faq.view',
    'faq.manage',
    'homepage.view',
    'homepage.edit',
    'testimonial.view',
    'testimonial.manage',
    'tracker.view',
    'tracker.update',
    'team.view',
    'team.invite',
    'team.edit',
    'team.delete',
    'team.activate',
    'team.deactivate',
    'team.role_change',
    'team.role.change',
    'team.department_change',
    'team.department.change',
    'team.transfer_ownership',
    'settings.view',
    'settings.manage',
    'audit.view',
  ],
  admin: [
    'dashboard.view',
    'enquiry.view',
    'enquiry.create',
    'enquiry.update',
    'enquiry.assign',
    'enquiry.notes',
    'destination.view',
    'destination.create',
    'destination.update',
    'destination.delete',
    'experience.view',
    'experience.create',
    'experience.update',
    'package.view',
    'package.create',
    'package.update',
    'package.delete',
    'blog.view',
    'blog.publish',
    'blog.delete',
    'faq.view',
    'faq.manage',
    'homepage.view',
    'homepage.edit',
    'testimonial.view',
    'testimonial.manage',
    'tracker.view',
    'tracker.update',
    'team.view',
    'team.invite',
    'team.edit',
    'team.activate',
    'team.deactivate',
    'team.role_change',
    'team.role.change',
    'team.department_change',
    'team.department.change',
    'settings.view',
    'settings.manage',
    'audit.view',
  ],
  operations: [
    'dashboard.view',
    'enquiry.view',
    'enquiry.create',
    'enquiry.update',
    'enquiry.notes',
    'destination.view',
    'destination.create',
    'destination.update',
    'experience.view',
    'experience.create',
    'experience.update',
    'package.view',
    'package.create',
    'package.update',
    'tracker.view',
    'tracker.update',
  ],
  support: [
    'dashboard.view',
    'enquiry.view',
    'enquiry.update',
    'enquiry.notes',
    'tracker.view',
    'tracker.update',
  ],
};

// Module path permission mapping
export const MODULE_ACCESS_MAP: Record<string, AdminRole[]> = {
  '/admin': ['owner', 'admin', 'operations', 'support'],
  '/admin/enquiries': ['owner', 'admin', 'operations', 'support'],
  '/admin/destinations': ['owner', 'admin', 'operations'],
  '/admin/experiences': ['owner', 'admin', 'operations'],
  '/admin/packages': ['owner', 'admin', 'operations'],
  '/admin/blogs': ['owner', 'admin'],
  '/admin/faqs': ['owner', 'admin'],
  '/admin/homepage-cms': ['owner', 'admin'],
  '/admin/testimonials': ['owner', 'admin'],
  '/admin/trip-tracker': ['owner', 'admin', 'operations', 'support'],
  '/admin/team': ['owner', 'admin'],
  '/admin/settings': ['owner', 'admin'],
  '/admin/audit-logs': ['owner', 'admin'],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role as AdminRole];
  if (!rolePermissions) return false;
  return rolePermissions.includes(permission);
}

export function getRolePermissions(role: string): Permission[] {
  return ROLE_PERMISSIONS[role as AdminRole] || [];
}

export function hasModuleAccess(role: string, modulePath: string): boolean {
  const normalized = modulePath === '/admin' ? '/admin' : modulePath.replace(/\/$/, '');

  for (const [pathKey, allowedRoles] of Object.entries(MODULE_ACCESS_MAP)) {
    if (normalized === pathKey || normalized.startsWith(`${pathKey}/`)) {
      return allowedRoles.includes(role as AdminRole);
    }
  }

  return false;
}
