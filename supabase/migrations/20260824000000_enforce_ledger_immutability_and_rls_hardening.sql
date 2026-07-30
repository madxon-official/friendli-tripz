-- ============================================================================
-- FRIENDLI TRIPZ - HARDENING MIGRATION
-- Migration: 20260824000000_enforce_ledger_immutability_and_rls_hardening.sql
-- Description: Enforces database-level immutability on financial_ledger_entries 
--              and hardens RLS policies on financial, security, and log tables.
-- ============================================================================

-- 1. IMMUTABLE FINANCIAL LEDGER TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION prevent_financial_ledger_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Financial ledger entries are strictly immutable. UPDATE and DELETE operations are forbidden.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_financial_ledger_immutability ON financial_ledger_entries;
CREATE TRIGGER enforce_financial_ledger_immutability
BEFORE UPDATE OR DELETE ON financial_ledger_entries
FOR EACH ROW EXECUTE FUNCTION prevent_financial_ledger_mutation();

-- 2. HARDEN RLS POLICIES FOR FINANCIAL LEDGER
ALTER TABLE financial_ledger_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin financial_ledger_entries full" ON financial_ledger_entries;
DROP POLICY IF EXISTS "Append-only financial_ledger_entries insert" ON financial_ledger_entries;
DROP POLICY IF EXISTS "Read-only financial_ledger_entries select" ON financial_ledger_entries;

CREATE POLICY "Append-only financial_ledger_entries insert" 
ON financial_ledger_entries 
FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "Read-only financial_ledger_entries select" 
ON financial_ledger_entries 
FOR SELECT TO authenticated 
USING (is_active_admin(auth.uid()));

-- 3. HARDEN RLS POLICIES FOR SECURITY AND AUDIT LOGS
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System security_logs full" ON security_logs;
DROP POLICY IF EXISTS "System system_logs full" ON system_logs;
DROP POLICY IF EXISTS "Admin security_logs select" ON security_logs;
DROP POLICY IF EXISTS "Admin system_logs select" ON system_logs;

CREATE POLICY "Admin security_logs select" 
ON security_logs 
FOR SELECT TO authenticated 
USING (is_active_admin(auth.uid()));

CREATE POLICY "System security_logs insert" 
ON security_logs 
FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admin system_logs select" 
ON system_logs 
FOR SELECT TO authenticated 
USING (is_active_admin(auth.uid()));

CREATE POLICY "System system_logs insert" 
ON system_logs 
FOR INSERT TO authenticated 
WITH CHECK (true);
