# Operations & Incident Response Runbook — Friendli Tripz

## Incident Triage Protocol

### Priority 0 (Outage / Service Down)
1. Check `/api/health?probe=liveness` and `/api/health?probe=readiness`.
2. Inspect Supabase project database connection pool status.
3. Verify Vercel / Cloud Container deployment logs.

### Database Backup & Point-In-Time Recovery
- Database backups are managed automatically via Supabase daily automated snapshots.
- Point-In-Time Recovery (PITR) is enabled for up to 7 days.

### Maintenance Mode
- Maintenance mode can be toggled via environment variable `NEXT_PUBLIC_MAINTENANCE_MODE=true`.
