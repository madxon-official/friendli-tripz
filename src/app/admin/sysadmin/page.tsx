import React from 'react';
import { getSystemHealthMetrics, getAuditLogs } from '@/lib/actions/sysadmin';
import { Server, Activity, Database, ShieldAlert, Cpu, HardDrive, Lock } from 'lucide-react';

export const metadata = {
  title: 'System Administration & Audit Logs | Friendli Tripz Admin',
  description: 'Platform health monitoring, queue status, active sessions, storage metrics, and security audit trail.',
};

export default async function SysAdminPage() {
  const health = await getSystemHealthMetrics();
  const logs = await getAuditLogs();

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Server className="w-4 h-4" />
              Enterprise System Governance
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              System Administration & Audit Logs
            </h1>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">PostgreSQL Latency</span>
            <span className="text-2xl font-extrabold text-emerald-400">{health.databaseLatencyMs} ms</span>
          </div>

          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Active User Sessions</span>
            <span className="text-2xl font-extrabold text-white">{health.activeSessionsCount} Sessions</span>
          </div>

          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Storage Vault Usage</span>
            <span className="text-2xl font-extrabold text-amber-400">{health.storageUsageMb} MB</span>
          </div>

          <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Event Queue Status</span>
            <span className="text-2xl font-extrabold text-emerald-400 uppercase">{health.queueStatus}</span>
          </div>
        </div>

        {/* Audit Trail Table */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-xl">
          <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            Security & System Audit Log Stream
          </h3>

          <div className="divide-y divide-slate-700/60 text-xs">
            {logs.map((log) => (
              <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{log.actionType}</span>
                    <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">{log.actorName}</span>
                  </div>
                  <span className="text-slate-400 block">Resource: {log.targetResource}</span>
                </div>

                <div className="text-right font-mono text-slate-400 text-[11px]">
                  <span>{log.ipAddress}</span>
                  <span className="block">{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
