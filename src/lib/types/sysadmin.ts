export interface AuditLogEntry {
  id: string;
  actorName: string;
  actionType: string;
  targetResource: string;
  ipAddress?: string;
  createdAt: string;
}

export interface SystemHealthMetrics {
  databaseLatencyMs: number;
  activeSessionsCount: number;
  storageUsageMb: number;
  queueStatus: 'healthy' | 'degraded' | 'down';
}
