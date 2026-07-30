export interface LiveDeploymentItem {
  id: string;
  bookingId: string;
  bookingCode: string;
  leadBookerName: string;
  departureDate: string;
  returnDate: string;
  status: 'scheduled' | 'ready' | 'in_transit' | 'completed' | 'delayed' | 'emergency';
  readinessScore: number;
  delayMins: number;
  hasResourceConflict: boolean;
  vehicle?: {
    model: string;
    number: string;
  };
  driver?: {
    name: string;
    phone: string;
  };
  guide?: {
    name: string;
    phone: string;
  };
  hotel?: {
    name: string;
    roomCategory: string;
    roomsCount: number;
  };
  passengerCount: number;
}

export interface OperationalAlertItem {
  id: string;
  deploymentId?: string;
  alertLevel: 'info' | 'warning' | 'critical' | 'emergency';
  alertType: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

export interface PickupManifestEntry {
  id: string;
  deploymentId: string;
  pickupTime: string;
  pickupLocation: string;
  passengerName: string;
  passengerPhone: string;
  baggageCount: number;
  boardingStatus: 'pending' | 'boarded' | 'no_show';
}
