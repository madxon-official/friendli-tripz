export type AdminRole = 'owner' | 'admin' | 'operations' | 'sales';

export interface RoleDefinition {
  id: AdminRole;
  label: string;
  description: string;
  isAssignableViaInvite: boolean;
}

export const ROLES: Record<AdminRole, RoleDefinition> = {
  owner: {
    id: 'owner',
    label: 'Owner',
    description: 'Founder & highest authority. Full system control, team & security management.',
    isAssignableViaInvite: false,
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    description: 'Trusted core team member. Broad operational access & enquiry archiving privileges.',
    isAssignableViaInvite: true,
  },
  operations: {
    id: 'operations',
    label: 'Operations',
    description: 'Trip & customer operations team. enquiry management, status updates & notes.',
    isAssignableViaInvite: true,
  },
  sales: {
    id: 'sales',
    label: 'Sales',
    description: 'Lead conversion & customer enquiry team. View, follow up & manage enquiries.',
    isAssignableViaInvite: true,
  },
};

export const INVITEABLE_ROLES: RoleDefinition[] = Object.values(ROLES).filter(
  (r) => r.isAssignableViaInvite
);

export function isValidRole(role: string): role is AdminRole {
  return ['owner', 'admin', 'operations', 'sales'].includes(role);
}

export function getRoleLabel(role: string): string {
  if (isValidRole(role)) {
    return ROLES[role].label;
  }
  return role;
}
