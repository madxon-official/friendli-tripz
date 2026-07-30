export interface CustomizationItemEdit {
  dayId: string;
  segmentId: string;
  action: 'swap_hotel' | 'swap_activity' | 'add_activity' | 'remove_segment' | 'change_dates' | 'change_passengers';
  newItemId?: string;
  newCost?: number;
  newTitle?: string;
}

export interface IncrementalReplannerPayload {
  instanceId: string;
  edits: CustomizationItemEdit[];
  passengerCount?: number;
  startDate?: string;
}

export interface AffectedNode {
  nodeId: string;
  nodeType: 'hotel' | 'activity' | 'transit' | 'pricing';
  previousCost: number;
  newCost: number;
  recalculatedReason: string;
}

export interface IncrementalReplannerResponse {
  success: boolean;
  instanceId: string;
  affectedNodes: AffectedNode[];
  newTotalGross: number;
  newTotalTax: number;
  priceDiff: number;
  updatedItineraryDays: any[];
}
