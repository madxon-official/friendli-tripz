export interface CopilotQueryResponse {
  query: string;
  summaryText: string;
  atRiskDepartures?: {
    bookingCode: string;
    reason: string;
    readinessScore: number;
  }[];
  vendorRecommendations?: {
    vendorName: string;
    issue: string;
    recommendedAlternative: string;
  }[];
  briefingNotes?: string[];
}
