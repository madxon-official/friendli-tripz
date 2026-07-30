'use server';

import { createClient } from '@/lib/supabase/server';
import { AuditLogEntry, SystemHealthMetrics } from '@/lib/types/sysadmin';

export async function getSystemHealthMetrics(): Promise<SystemHealthMetrics> {
  return {
    databaseLatencyMs: 14,
    activeSessionsCount: 42,
    storageUsageMb: 1240,
    queueStatus: 'healthy',
  };
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  return [
    {
      id: 'audit-1',
      actorName: 'Admin Owner',
      actionType: 'UPDATE_DEPARTURE_STATUS',
      targetResource: 'operational_deployments/66666666-6666-6666-6666-666666666601',
      ipAddress: '103.21.124.89',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'audit-2',
      actorName: 'System Event Bus',
      actionType: 'EVENT_BOOKING_CONFIRMED',
      targetResource: 'platform_domain_events/FT-2026-9001',
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString(),
    }
  ];
}
