import { createServiceRoleClient } from '@/lib/supabase/service';
import { NextRequest } from 'next/server';

export interface AuditLogInput {
  actorId: string;
  targetType: 'enquiry' | 'team_member' | 'department' | 'role' | 'session' | 'invitation';
  targetId?: string | null;
  action:
    | 'invite'
    | 'accept'
    | 'resend'
    | 'role_changed'
    | 'department_changed'
    | 'status_changed'
    | 'assigned'
    | 'archived'
    | 'restored'
    | 'deleted'
    | 'login'
    | 'logout';
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  req?: NextRequest;
}

export async function logActivity(input: AuditLogInput): Promise<void> {
  try {
    const serviceClient = createServiceRoleClient();

    let ip = '';
    let userAgent = '';

    if (input.req) {
      ip = input.req.headers.get('x-forwarded-for') || input.req.headers.get('x-real-ip') || '';
      userAgent = input.req.headers.get('user-agent') || '';
    }

    // Sanitize metadata: Never log passwords or tokens
    const sanitize = (obj?: Record<string, any>) => {
      if (!obj) return {};
      const copy = { ...obj };
      delete copy.password;
      delete copy.token;
      delete copy.secret;
      delete copy.access_token;
      delete copy.refresh_token;
      return copy;
    };

    await serviceClient.from('admin_activity_logs').insert({
      actor_id: input.actorId,
      target_type: input.targetType,
      target_id: input.targetId || null,
      action: input.action,
      old_data: sanitize(input.oldData),
      new_data: sanitize(input.newData),
      ip,
      user_agent: userAgent,
    });
  } catch (err) {
    console.warn('Activity audit logging failed:', err);
  }
}
