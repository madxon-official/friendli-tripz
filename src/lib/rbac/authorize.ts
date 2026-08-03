import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Permission } from './permissions';
import { AdminRole, isValidRole } from './roles';
import { can } from './can';

export interface AuthorizeResult {
  userId: string;
  email: string;
  fullName: string;
  role: AdminRole;
  departmentId?: string | null;
  isActive: boolean;
}

export class AuthorizationError extends Error {
  public code: string;
  public status: number;

  constructor(message: string, code = 'UNAUTHORIZED', status = 401) {
    super(message);
    this.name = 'AuthorizationError';
    this.code = code;
    this.status = status;
  }
}

export async function requirePermission(
  requiredPermission?: Permission,
  targetRole?: AdminRole
): Promise<AuthorizeResult> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new AuthorizationError('Authentication required.', 'UNAUTHENTICATED', 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('id, full_name, role, department_id, is_active, status')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new AuthorizationError('Admin profile not found.', 'PROFILE_NOT_FOUND', 403);
  }

  if (!profile.is_active || profile.status === 'suspended' || profile.status === 'inactive') {
    throw new AuthorizationError('Admin account is currently inactive or suspended.', 'PROFILE_INACTIVE', 403);
  }

  if (!isValidRole(profile.role)) {
    throw new AuthorizationError('Invalid admin profile role.', 'INVALID_ROLE', 403);
  }

  if (requiredPermission && !can(profile.role, requiredPermission, targetRole)) {
    throw new AuthorizationError(
      `Permission denied: '${requiredPermission}' required.`,
      'FORBIDDEN',
      403
    );
  }

  return {
    userId: user.id,
    email: user.email || '',
    fullName: profile.full_name,
    role: profile.role,
    departmentId: profile.department_id,
    isActive: profile.is_active,
  };
}
