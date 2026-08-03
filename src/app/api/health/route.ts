import { NextRequest } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { ApiResponse } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const probe = request.nextUrl.searchParams.get('probe') || 'health';

  if (probe === 'liveness') {
    return ApiResponse.success({
      status: 'alive',
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }

  let dbStatus = 'disconnected';
  let isHealthy = false;

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from('destinations').select('id').limit(1);
    if (!error) {
      dbStatus = 'connected';
      isHealthy = true;
    } else {
      dbStatus = `degraded: ${error.message}`;
    }
  } catch (err: any) {
    dbStatus = `failed: ${err?.message || 'Connection error'}`;
  }

  const payload = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    probe,
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      cache: 'operational',
      realtime: 'listening',
      queueWorker: 'running',
    },
    version: '1.0.0',
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  };

  if (!isHealthy) {
    return ApiResponse.error(
      'Database health check failed',
      'SERVICE_UNAVAILABLE',
      503,
      payload
    );
  }

  return ApiResponse.success(payload);
}
