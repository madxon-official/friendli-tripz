export type BookingStatus =
  | 'draft'
  | 'pending_payment'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'amendment_pending'
  | 'cancelled';

export type AmendmentStatus = 'requested' | 'impact_analyzed' | 'approved' | 'rejected' | 'executed';

export interface Passenger {
  id?: string;
  booking_id?: string;
  first_name: string;
  last_name: string;
  age: number;
  gender?: 'male' | 'female' | 'other';
  dietary_preference?: string;
  special_assistance_notes?: string | null;
}

export interface BookingSnapshot {
  id?: string;
  booking_id: string;
  revision_number: number;
  serialized_contract_json: any;
  snapshot_hash: string;
  created_at?: string;
}

export interface BookingAmendment {
  id?: string;
  booking_id: string;
  amendment_type: 'date_change' | 'passenger_change' | 'room_upgrade' | 'cancellation';
  requested_by?: string | null;
  amendment_payload_json: any;
  operational_impact_json?: any;
  commercial_price_diff: number;
  financial_refund_or_due: number;
  status: AmendmentStatus;
  approved_by?: string | null;
  rejection_reason?: string | null;
  created_at?: string;
  executed_at?: string | null;
}

export interface BookingStateTransition {
  id?: string;
  booking_id: string;
  from_status: BookingStatus;
  to_status: BookingStatus;
  reason?: string | null;
  initiated_by?: string | null;
  created_at?: string;
}

export interface Booking {
  id: string;
  booking_code: string;
  instance_id: string;
  lead_booker_name: string;
  lead_booker_email: string;
  lead_booker_phone: string;
  start_date: string;
  end_date: string;
  passenger_count: number;
  total_gross_amount: number;
  total_tax_amount: number;
  total_net_cost: number;
  margin_amount: number;
  margin_percentage: number;
  currency: string;
  status: BookingStatus;
  current_revision_number: number;
  passengers?: Passenger[];
  snapshots?: BookingSnapshot[];
  amendments?: BookingAmendment[];
  instance?: any;
  created_at?: string;
  updated_at?: string;
}

export interface BookingFilterParams {
  search?: string;
  status?: BookingStatus | 'all';
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}
