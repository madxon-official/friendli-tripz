export type AdminRole = 'owner' | 'admin' | 'operations' | 'support';

export interface RoleDefinition {
  id: AdminRole;
  label: string;
  level: number;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const ROLES: Record<AdminRole, RoleDefinition> = {
  owner: {
    id: 'owner',
    label: 'Owner',
    level: 100,
    description: 'Founder & highest authority. Full system control, team governance, settings, and transfer ownership.',
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-800',
  },
  admin: {
    id: 'admin',
    label: 'Administrator',
    level: 80,
    description: 'Daily operational manager. Full access to content, catalog, team management, and settings.',
    badgeBg: 'bg-brand-orange/20',
    badgeText: 'text-brand-orange',
    badgeBorder: 'border-brand-orange/30',
  },
  operations: {
    id: 'operations',
    label: 'Operations',
    level: 50,
    description: 'Trip operations team. Manages enquiries, packages, destinations, experiences, and trip tracking.',
    badgeBg: 'bg-blue-950/60',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-800',
  },
  support: {
    id: 'support',
    label: 'Support',
    level: 30,
    description: 'Customer support team. Reads enquiries, replies to travellers, updates status steps, and adds notes.',
    badgeBg: 'bg-purple-950/60',
    badgeText: 'text-purple-400',
    badgeBorder: 'border-purple-800',
  },
};

export const ALL_ROLES: RoleDefinition[] = Object.values(ROLES);

export function isValidRole(role: string): role is AdminRole {
  return ['owner', 'admin', 'operations', 'support'].includes(role);
}

export function getRoleLabel(role: string): string {
  if (isValidRole(role)) {
    return ROLES[role].label;
  }
  return role;
}

export function getAssignableRolesForActor(actorRole: AdminRole): RoleDefinition[] {
  if (actorRole === 'owner') {
    // Owner can assign Administrator, Operations, Support (Owner role excluded from direct assignment)
    return ALL_ROLES.filter((r) => r.id !== 'owner');
  }
  if (actorRole === 'admin') {
    // Administrator can assign Operations, Support (Owner and Admin excluded)
    return ALL_ROLES.filter((r) => ['operations', 'support'].includes(r.id));
  }
  return [];
}

export function canManageTargetRole(actorRole: AdminRole, targetRole: AdminRole): boolean {
  if (actorRole === 'owner') return true;
  if (actorRole === 'admin') {
    return targetRole !== 'owner' && targetRole !== 'admin';
  }
  return false;
}
