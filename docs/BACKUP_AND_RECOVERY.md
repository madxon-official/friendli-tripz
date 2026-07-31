# FRIENDLI TRIPZ — BACKUP AND RECOVERY POLICY

## 1. Automated Database Backups
- **Point-in-Time Recovery (PITR)** enabled on Supabase Pro/Enterprise tier.
- Automatic daily full database snapshots retained for 30 days.
- WAL (Write-Ahead Logging) continuous archiving.

---

## 2. Manual Backup Procedure
```bash
# Export schema and data via Supabase CLI
supabase db dump --linked -f supabase_prod_backup_$(date +%Y%m%d).sql
```

---

## 3. Disaster Recovery (DR) Procedure
1. Provision new Supabase production project.
2. Execute sequential migrations:
```bash
npx supabase db push
```
3. Verify immutable financial ledger triggers and RLS policies.
4. Update environment variables in hosting provider and trigger deployment.
