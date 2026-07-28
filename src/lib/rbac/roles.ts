export type AdminRole = 'owner' | 'admin' | 'operations' | 'sales' | 'support' | 'viewer';

export interface RoleDefinition {
  id: AdminRole;
  label: string;
  level: number;
  description: string;
  color: string;
}

export const ROLES: Record<AdminRole, RoleDefinition> = {
  owner: {
    id: 'owner',
    label: 'Owner',
    level: 100,
    description: 'Founder & highest authority. Full system control over security, team, trips, payments, and settings.',
    color: '#8B5CF6',
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    description: 'Daily operational manager. Manages Operations, Sales, Support, Viewers, and enquiries archiving.',
    level: 80,
    color: '#3B82F6',
  },
  operations: {
    id: 'operations',
    label: 'Operations',
    description: 'Trip operations team. Manages assigned enquiries, bookings, travellers, vehicles, and hotels.',
    level: 50,
    color: '#10B981',
  },
  sales: {
    id: 'sales',
    label: 'Sales',
    description: 'Lead conversion team. Views enquiries, updates follow-ups, calls, and WhatsApp interactions.',
    level: 50,
    color: '#F59E0B',
  },
  support: {
    id: 'support',
    label: 'Support',
    description: 'Customer support team. Views assigned travellers and updates customer support notes.',
    level: 50,
    color: '#EC4899',
  },
  viewer: {
    id: 'viewer',
    label: 'Viewer',
    description: 'Read-only access across allowed operational dashboards and enquiries.',
    level: 10,
    color: '#64748B',
  },
};

export const ALL_ROLES: RoleDefinition[] = Object.values(ROLES);

export function isValidRole(role: string): role is AdminRole {
  return ['owner', 'admin', 'operations', 'sales', 'support', 'viewer'].includes(role);
}

export function getRoleLabel(role: string): string {
  if (isValidRole(role)) {
    return ROLES[role].label;
  }
  return role;
}

export function getAssignableRolesForActor(actorRole: AdminRole): RoleDefinition[] {
  if (actorRole === 'owner') {
    return ALL_ROLES.filter((r) => r.id !== 'owner');
  }
  if (actorRole === 'admin') {
    return ALL_ROLES.filter((r) => ['operations', 'sales', 'support', 'viewer'].includes(r.id));
  }
  return [];
}

export function canManageTargetRole(actorRole: AdminRole, targetRole: AdminRole): boolean {
  if (actorRole === 'owner') return true; // Owner can manage anyone
  if (actorRole === 'admin') {
    // Admin cannot manage Owner or other Admins
    return targetRole !== 'owner' && targetRole !== 'admin';
  }
  return false;
}
