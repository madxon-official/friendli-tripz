export interface DriverLocationPoint {
  id: string;
  deploymentId: string;
  driverName: string;
  vehicleNumber: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  headingDegrees: number;
  recordedAt: string;
}

export interface PresenceSessionItem {
  id: string;
  userRole: string;
  currentRoute: string;
  lastActiveAt: string;
}
