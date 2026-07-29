export type DepartureStatus = 'open' | 'guaranteed' | 'sold_out' | 'cancelled' | 'in_progress';
export type PoolType = 'passenger' | 'transport' | 'accommodation' | 'activity';

export interface PackageDeparture {
  id: string;
  release_id: string;
  departure_code: string;
  start_date: string;
  end_date: string;
  min_travellers: number;
  max_travellers: number;
  current_booked_count: number;
  is_guaranteed: boolean;
  status: DepartureStatus;
  release?: any;
  capacity_pools?: DepartureCapacityPool[];
  created_at?: string;
  updated_at?: string;
}

export interface DepartureCapacityPool {
  id: string;
  departure_id: string;
  pool_type: PoolType;
  total_capacity: number;
  allocated_capacity: number;
}

export interface DepartureWaitlist {
  id: string;
  departure_id: string;
  position_number: number;
  lead_name: string;
  lead_email: string;
  lead_phone: string;
  passenger_count: number;
  priority_token?: string | null;
  claim_expires_at?: string | null;
  status: 'waiting' | 'notified' | 'claimed' | 'expired';
  created_at?: string;
}

export interface RoomMatchRequest {
  id: string;
  departure_id: string;
  passenger_id: string;
  gender: string;
  same_gender_requested: boolean;
  matched_with_passenger_id?: string | null;
  status: 'searching' | 'matched' | 'single_supplement_applied';
  created_at?: string;
}
