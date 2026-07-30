export interface ScheduledCronJobItem {
  id: string;
  jobName: string;
  cronExpression: string;
  lastExecutedAt?: string;
  nextRunAt: string;
  isActive: boolean;
}

export interface DeadLetterQueueItem {
  id: string;
  jobType: string;
  errorStacktrace: string;
  retryCount: number;
  createdAt: string;
  payloadJson?: Record<string, any>;
}
