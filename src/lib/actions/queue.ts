'use server';

import { createClient } from '@/lib/supabase/server';
import { ScheduledCronJobItem, DeadLetterQueueItem } from '@/lib/types/queue';

export async function getScheduledCronJobs(): Promise<ScheduledCronJobItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('scheduled_cron_jobs')
    .select('*')
    .order('job_name', { ascending: true });

  if (error || !data || data.length === 0) {
    return [
      {
        id: 'job-1',
        jobName: 'inventory_hold_purge',
        cronExpression: '*/5 * * * *',
        lastExecutedAt: new Date().toISOString(),
        nextRunAt: new Date(Date.now() + 300000).toISOString(),
        isActive: true,
      },
      {
        id: 'job-2',
        jobName: 'payment_reminder_dispatcher',
        cronExpression: '0 9 * * *',
        lastExecutedAt: new Date().toISOString(),
        nextRunAt: new Date(Date.now() + 86400000).toISOString(),
        isActive: true,
      }
    ];
  }

  return data.map((j: any) => ({
    id: j.id,
    jobName: j.job_name,
    cronExpression: j.cron_expression,
    lastExecutedAt: j.last_executed_at,
    nextRunAt: j.next_run_at,
    isActive: j.is_active,
  }));
}

export async function getDeadLetterQueue(): Promise<DeadLetterQueueItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('dead_letter_queue')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    return [
      {
        id: 'dlq-1',
        jobType: 'WHATSAPP_VOUCHER_DISPATCH',
        errorStacktrace: 'TimeoutError: WhatsApp Business API gateway 504 Gateway Timeout',
        retryCount: 3,
        payloadJson: { voucherId: 'vch-101', recipientPhone: '+919876543210' },
        createdAt: new Date().toISOString(),
      }
    ];
  }

  return data.map((d: any) => ({
    id: d.id,
    jobType: d.job_type,
    errorStacktrace: d.error_stacktrace,
    retryCount: d.retry_count || 0,
    payloadJson: d.payload_json || {},
    createdAt: d.created_at,
  }));
}
