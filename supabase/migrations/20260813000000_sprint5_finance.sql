-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 5.4: FINANCE PLATFORM EXTENSIONS (REFACTORED)
-- Migration: 20260813000000_sprint5_finance.sql
-- ============================================================================

-- 1. EXTEND ACCOUNTING ENGINE VIA LEDGER CLOSING PERIODS
CREATE TABLE IF NOT EXISTS ledger_closing_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_name TEXT NOT NULL UNIQUE, -- e.g. 'FY2026-Q3', '2026-OCT'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_debits NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_credits NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  closing_status TEXT DEFAULT 'open', -- 'open', 'reconciled', 'locked'
  closed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. GST & TDS TAX FILINGS
CREATE TABLE IF NOT EXISTS gst_tds_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filing_period TEXT NOT NULL,
  gstin TEXT DEFAULT '33AAAAA0000A1Z5',
  total_taxable_turnover NUMERIC(12,2) NOT NULL,
  cgst_amount NUMERIC(10,2) NOT NULL,
  sgst_amount NUMERIC(10,2) NOT NULL,
  igst_amount NUMERIC(10,2) DEFAULT 0.00,
  tds_deducted_section_194c NUMERIC(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'filed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS POLICIES
ALTER TABLE ledger_closing_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_tds_filings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin closing periods full" ON ledger_closing_periods;
CREATE POLICY "Admin closing periods full" ON ledger_closing_periods FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin filings full" ON gst_tds_filings;
CREATE POLICY "Admin filings full" ON gst_tds_filings FOR ALL TO authenticated USING (true) WITH CHECK (true);
