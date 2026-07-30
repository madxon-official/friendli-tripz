import React from 'react';
import { getScheduledCronJobs, getDeadLetterQueue } from '@/lib/actions/queue';
import { Cpu, Clock, AlertOctagon, RotateCw, Play, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Background Workers & Queue Engine | Friendli Tripz Admin',
  description: 'Cron scheduler, dead letter queue (DLQ), retry logic, inventory hold purge, and WhatsApp voucher dispatch workers.',
};

export default async function JobsPage() {
  const cronJobs = await getScheduledCronJobs();
  const dlqJobs = await getDeadLetterQueue();

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" />
              Asynchronous Queue Engine
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Background Workers & Cron Scheduler
            </h1>
          </div>
        </div>

        {/* Scheduled Cron Jobs */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-xl">
          <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Active Scheduled Workers ({cronJobs.length})
          </h3>

          <div className="divide-y divide-slate-700/60 text-xs">
            {cronJobs.map((job) => (
              <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">{job.jobName}</span>
                    <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono text-[10px]">
                      {job.cronExpression}
                    </span>
                  </div>
                  <span className="text-slate-400 block">
                    Next Run: <strong className="text-emerald-400">{new Date(job.nextRunAt).toLocaleTimeString()}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5" />
                    Trigger Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dead Letter Queue (DLQ) */}
        {dlqJobs.length > 0 && (
          <div className="bg-slate-800 rounded-3xl p-6 border border-rose-800/50 space-y-4 shadow-xl">
            <h3 className="font-heading font-bold text-rose-400 text-lg flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              Dead Letter Queue (DLQ) Exceptions ({dlqJobs.length})
            </h3>

            <div className="space-y-3">
              {dlqJobs.map((dlq) => (
                <div key={dlq.id} className="p-4 bg-slate-900/60 rounded-2xl border border-rose-800/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono">{dlq.jobType}</span>
                    <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">
                      Failed (Max Retries Exhausted)
                    </span>
                  </div>
                  <p className="text-slate-400 font-mono text-[11px] bg-slate-950 p-2.5 rounded-xl">
                    {dlq.errorStacktrace}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
