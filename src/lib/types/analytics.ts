export interface ExecutiveMetrics {
  totalRevenue: number;
  totalBookings: number;
  conversionRate: number;
  cancellationRate: number;
  averageMargin: number;
  topDestination: string;
  aiPlannerSessions: number;
}

export interface DestinationPerformanceItem {
  destinationName: string;
  bookingsCount: number;
  grossRevenue: number;
  averageRating: number;
}
