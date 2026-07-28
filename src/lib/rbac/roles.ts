export type AdminRole = 'owner' | 'admin' | 'operations' | 'sales' | 'support' | 'viewer';

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
    description: 'Founder & highest authority. Full system control. Single owner architecture.',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300',
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    level: 80,
    description: 'Daily operational manager. Manages Operations, Sales, Support, Viewers, and enquiries.',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-900',
    badgeBorder: 'border-orange-300',
  },
  operations: {
    id: 'operations',
    label: 'Operations',
    level: 50,
    description: 'Trip operations team. Manages assigned enquiries, bookings, travellers, vehicles, hotels.',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-900',
    badgeBorder: 'border-blue-300',
  },
  sales: {
    id: 'sales',
    label: 'Sales',
    level: 50,
    description: 'Lead conversion team. Views enquiries, updates follow-ups, calls, and WhatsApp interactions.',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-300',
  },
  support: {
    id: 'support',
    label: 'Support',
    level: 50,
    description: 'Customer support team. Views assigned travellers and updates customer support notes.',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
    badgeBorder: 'border-purple-300',
  },
  viewer: {
    id: 'viewer',
    label: 'Viewer',
    level: 10,
    description: 'Read-only access across allowed operational dashboards and enquiries.',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    badgeBorder: 'border-slate-300',
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

/**
 * SINGLE OWNER ARCHITECTURE:
 * Owner CANNOT be casually invited or assigned via role dropdown.
 * Owner role can ONLY be assigned via explicit Transfer Ownership flow.
 */
export function getAssignableRolesForActor(actorRole: AdminRole): RoleDefinition[] {
  if (actorRole === 'owner') {
    // Owner can assign Admin, Operations, Sales, Support, Viewer (Owner excluded)
    return ALL_ROLES.filter((r) => r.id !== 'owner');
  }
  if (actorRole === 'admin') {
    // Admin can assign Operations, Sales, Support, Viewer (Owner and Admin excluded)
    return ALL_ROLES.filter((r) => ['operations', 'sales', 'support', 'viewer'].includes(r.id));
  }
  return [];
}

export function canManageTargetRole(actorRole: AdminRole, targetRole: AdminRole): boolean {
  if (actorRole === 'owner') return true; // Owner can manage anyone except himself (self-protection handled separately)
  if (actorRole === 'admin') {
    // Admin cannot manage Owner or other Admins
    return targetRole !== 'owner' && targetRole !== 'admin';
  }
  return false;
}
