export interface SecurityEventItem {
  id: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress?: string;
  createdAt: string;
}
