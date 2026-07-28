import { AdminRole, canManageTargetRole } from './roles';
import { Permission, hasPermission } from './permissions';

export function can(
  actorRole: string,
  permission: Permission,
  targetRole?: string
): boolean {
  if (!hasPermission(actorRole, permission)) {
    return false;
  }

  // If action targets a specific user role, check hierarchy management permissions
  if (targetRole) {
    if (!canManageTargetRole(actorRole as AdminRole, targetRole as AdminRole)) {
      return false;
    }
  }

  return true;
}
