# FRIENDLI TRIPZ — SRE OPERATIONS RUNBOOK

## 1. System Overview
Friendli Tripz runs on Next.js 15 (Vercel) connected to Supabase (PostgreSQL + Auth + Storage + Realtime).

---

## 2. Common Operational Tasks

### Checking Health
```bash
curl -i https://friendlitripz.com/api/health
```

### Investigating System Logs
- View database-level logs in Supabase Dashboard -> Logs -> Postgres.
- View application-level errors in `system_logs` table via Supabase SQL Editor:
```sql
SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 50;
```

### Rotating Service Role Keys
1. Generate new Service Role Key in Supabase Dashboard -> Project Settings -> API.
2. Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel Environment Variables.
3. Redeploy application in Vercel.
