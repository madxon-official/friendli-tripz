-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 5.3: HOTEL & VENDOR PORTAL EXTENSIONS (REFACTORED)
-- Migration: 20260812000000_sprint5_hotel_vendor_portals.sql
-- ============================================================================

-- 1. EXTEND OPERATIONAL CONTRACTS VIA VENDOR QR SCAN LOGS
CREATE TABLE IF NOT EXISTS vendor_qr_scan_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE, -- CANONICAL REF TO service_orders(id)
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE, -- CANONICAL REF TO vendors(id)
  voucher_id UUID REFERENCES vendor_vouchers(id) ON DELETE SET NULL, -- CANONICAL REF TO vendor_vouchers(id)
  scanned_code TEXT NOT NULL,
  validation_status TEXT DEFAULT 'success', -- 'success', 'invalid_code', 'already_redeemed', 'expired'
  scanned_at TIMESTAMPTZ DEFAULT now()
);

-- 2. EXTEND PAYABLES ENGINE VIA VENDOR PAYMENT BATCHES
CREATE TABLE IF NOT EXISTS vendor_payment_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number VARCHAR(30) NOT NULL UNIQUE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE, -- CANONICAL REF TO vendors(id)
  settlement_ledger_id UUID REFERENCES vendor_settlement_ledger(id) ON DELETE SET NULL, -- CANONICAL REF TO vendor_settlement_ledger(id)
  total_gross_disbursement NUMERIC(10, 2) NOT NULL,
  tds_deducted NUMERIC(10, 2) DEFAULT 0.00,
  net_disbursed NUMERIC(10, 2) NOT NULL,
  bank_reference TEXT,
  disbursement_status TEXT DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed'
  disbursed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS POLICIES
ALTER TABLE vendor_qr_scan_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_payment_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public qr scan logs full" ON vendor_qr_scan_logs;
CREATE POLICY "Public qr scan logs full" ON vendor_qr_scan_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public payment batches full" ON vendor_payment_batches;
CREATE POLICY "Public payment batches full" ON vendor_payment_batches FOR ALL USING (true) WITH CHECK (true);
