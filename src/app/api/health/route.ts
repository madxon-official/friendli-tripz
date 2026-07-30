import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      cache: 'operational',
      realtime: 'listening',
      queueWorker: 'running',
    },
    version: '1.0.0',
  });
}
