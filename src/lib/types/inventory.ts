export type HoldStatus = 'temporary_hold' | 'committed' | 'expired' | 'released';
export type ResourceType = 'hotel_room' | 'vehicle_seat' | 'activity_slot' | 'departure_seat';

export interface ReservationSession {
  id: string;
  session_token: string;
  user_id?: string | null;
  expires_at: string;
  status: 'active' | 'committed' | 'rolled_back' | 'expired';
  reservations?: InventoryReservation[];
  created_at?: string;
}

export interface InventoryReservation {
  id: string;
  session_id: string;
  resource_type: ResourceType;
  resource_id: string;
  target_date: string;
  quantity: number;
  hold_status: HoldStatus;
  expires_at: string;
  created_at?: string;
}

export interface HoldRequestItem {
  resource_type: ResourceType;
  resource_id: string;
  target_date: string;
  quantity: number;
}
