# FRIENDLI TRIPZ — INCIDENT RESPONSE PLAN

## 1. Incident Severity Definitions
- **SEV-1 (Critical)**: Total service outage or database connectivity failure.
- **SEV-2 (High)**: Payment gateway / booking failure.
- **SEV-3 (Medium)**: Single portal degradation (e.g. driver GPS lag).

---

## 2. Response Workflow
1. Acknowledge incident & trigger SRE notification.
2. Check `/api/health` status.
3. Inspect `system_logs` and `security_logs` tables in Supabase.
4. If database is unreachable, check Supabase status page and failover strategy.
5. Post-incident RCA (Root Cause Analysis) documented within 24 hours.
