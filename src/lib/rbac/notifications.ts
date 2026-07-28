import { createServiceRoleClient } from '@/lib/supabase/service';

export interface NotificationInput {
  recipientId?: string | null; // NULL means broadcast to all active admins
  title: string;
  body: string;
  type:
    | 'enquiry_new'
    | 'assignment'
    | 'invitation_accepted'
    | 'role_changed'
    | 'team_joined'
    | 'archived'
    | 'trip_completed';
  link?: string | null;
}

export async function createAdminNotification(input: NotificationInput): Promise<void> {
  try {
    const serviceClient = createServiceRoleClient();

    await serviceClient.from('admin_notifications').insert({
      recipient_id: input.recipientId || null,
      title: input.title,
      body: input.body,
      type: input.type,
      link: input.link || null,
      is_read: false,
    });
  } catch (err) {
    console.warn('Admin notification creation failed:', err);
  }
}
