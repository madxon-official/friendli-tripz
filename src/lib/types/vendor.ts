export type VendorType = 'hotel' | 'transport_operator' | 'guide' | 'activity_operator';
export type VoucherStatus = 'generated' | 'dispatched' | 'verified_offline' | 'reconciled' | 'settled' | 'cancelled';

export interface Vendor {
  id: string;
  business_name: string;
  vendor_type: VendorType;
  tax_id?: string | null;
  contact_person?: string | null;
  phone: string;
  email?: string | null;
  performance_score?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceOrder {
  id: string;
  booking_id: string;
  vendor_id: string;
  service_type: string;
  service_date: string;
  agreed_cost: number;
  status: string;
  created_at?: string;
}

export interface VendorVoucher {
  id: string;
  voucher_code: string;
  service_order_id: string;
  vendor_id: string;
  booking_id: string;
  service_date: string;
  agreed_amount: number;
  qr_signing_hash: string;
  redemption_status: VoucherStatus;
  redeemed_at?: string | null;
  created_at?: string;
}
