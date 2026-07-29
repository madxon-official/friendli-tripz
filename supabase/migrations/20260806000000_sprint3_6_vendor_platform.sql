-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 3.6: VENDOR ECOSYSTEM & SETTLEMENT PLATFORM
-- Migration: 20260806000000_sprint3_6_vendor_platform.sql
-- ============================================================================

-- 1. ENUMS
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'voucher_redemption_status') THEN
    CREATE TYPE voucher_redemption_status AS ENUM ('generated', 'dispatched', 'verified_offline', 'reconciled', 'settled', 'cancelled');
  END IF;
END $$;

-- 2. VENDORS (PARTNER IDENTITY REGISTRY)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  vendor_type TEXT NOT NULL,
  tax_id TEXT,
  contact_person TEXT,
  phone TEXT NOT NULL,
  email CITEXT,
  bank_account_specs_json JSONB DEFAULT '{}'::jsonb,
  performance_score NUMERIC(3, 2) DEFAULT 5.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS update_vendors_updated_at ON vendors;
CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON vendors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. VENDOR CONTRACT RELEASES
CREATE TABLE IF NOT EXISTS vendor_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  contract_type TEXT NOT NULL DEFAULT 'net_rate',
  commission_rate_percentage NUMERIC(5, 2) DEFAULT 0.00,
  credit_term_days INTEGER DEFAULT 15,
  effective_start_date DATE NOT NULL,
  effective_end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SERVICE ORDERS (OPERATIONAL COMMITMENTS)
CREATE TABLE IF NOT EXISTS service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  service_type TEXT NOT NULL,
  service_date DATE NOT NULL,
  agreed_cost NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'committed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. VENDOR VOUCHERS (EXECUTION ARTIFACTS WITH CRYPTOGRAPHIC SIGNINGS)
CREATE TABLE IF NOT EXISTS vendor_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_code VARCHAR(30) NOT NULL UNIQUE,
  service_order_id UUID NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  agreed_amount NUMERIC(10, 2) NOT NULL,
  qr_signing_hash TEXT NOT NULL,
  redemption_status voucher_redemption_status DEFAULT 'generated',
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. VENDOR SETTLEMENT LEDGER
CREATE TABLE IF NOT EXISTS vendor_settlement_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  voucher_id UUID REFERENCES vendor_vouchers(id) ON DELETE SET NULL,
  payable_amount NUMERIC(10, 2) NOT NULL,
  tax_deducted_tds NUMERIC(10, 2) DEFAULT 0.00,
  net_disbursed NUMERIC(10, 2) NOT NULL,
  disbursement_ref TEXT,
  settlement_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. INDEXES
CREATE INDEX IF NOT EXISTS idx_vendors_type ON vendors(vendor_type);
CREATE INDEX IF NOT EXISTS idx_service_orders_booking ON service_orders(booking_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_vendor ON service_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_vouchers_code ON vendor_vouchers(voucher_code);
CREATE INDEX IF NOT EXISTS idx_vendor_vouchers_vendor ON vendor_vouchers(vendor_id);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_settlement_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public vendors select" ON vendors;
CREATE POLICY "Public vendors select" ON vendors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public vouchers select" ON vendor_vouchers;
CREATE POLICY "Public vouchers select" ON vendor_vouchers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin vendors full" ON vendors;
CREATE POLICY "Admin vendors full" ON vendors FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin vendor_contracts full" ON vendor_contracts;
CREATE POLICY "Admin vendor_contracts full" ON vendor_contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin service_orders full" ON service_orders;
CREATE POLICY "Admin service_orders full" ON service_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin vendor_vouchers full" ON vendor_vouchers;
CREATE POLICY "Admin vendor_vouchers full" ON vendor_vouchers FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin vendor_settlement_ledger full" ON vendor_settlement_ledger;
CREATE POLICY "Admin vendor_settlement_ledger full" ON vendor_settlement_ledger FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. SEED SAMPLE VENDOR & VOUCHER
INSERT INTO vendors (
  id, business_name, vendor_type, tax_id, contact_person, phone, email
) VALUES (
  '88888888-8888-8888-8888-888888888802',
  'Kodaikanal Boat Club Association',
  'activity_operator',
  '33AAACK8912K1Z9',
  'Murugan S.',
  '+919443322110',
  'info@kodaiboatclub.org'
) ON CONFLICT DO NOTHING;

INSERT INTO service_orders (
  id, booking_id, vendor_id, service_type, service_date, agreed_cost, status
) VALUES (
  '99999999-9999-9999-9999-999999999902',
  '55555555-5555-5555-5555-555555555502',
  '88888888-8888-8888-8888-888888888802',
  'activity_execution',
  '2026-10-15',
  350.00,
  'vouchered'
) ON CONFLICT DO NOTHING;

INSERT INTO vendor_vouchers (
  voucher_code, service_order_id, vendor_id, booking_id, service_date, agreed_amount, qr_signing_hash, redemption_status
) VALUES (
  'VOUCH-KODAI-9812',
  '99999999-9999-9999-9999-999999999902',
  '88888888-8888-8888-8888-888888888802',
  '55555555-5555-5555-5555-555555555502',
  '2026-10-15',
  350.00,
  'a6c8e312b904fc4e8912984abfc1209e843',
  'generated'
) ON CONFLICT (voucher_code) DO NOTHING;
