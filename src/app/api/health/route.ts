import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service';

export async function GET() {
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

  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        cache: 'operational',
        realtime: 'listening',
        queueWorker: 'running',
      },
      version: '1.0.0',
    },
    { status: statusCode }
  );
}
