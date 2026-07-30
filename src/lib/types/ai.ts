export interface TravelConstraints {
  durationDays?: number;
  maxBudget?: number;
  excludedActivities?: string[];
  preferredActivities?: string[];
  travelStyle?: 'honeymoon' | 'adventure' | 'family' | 'budget' | 'luxury' | string;
  passengers?: {
    adults: number;
    children: number;
  };
  startingLocation?: string;
  startDate?: string;
}

export interface AIExplanation {
  reasoningType: 'budget_match' | 'theme_fit' | 'timing_optimization' | 'pace_balance' | 'safety';
  explanationText: string;
  confidenceScore: number;
}

export interface BookableItineraryItem {
  dayNumber: number;
  title: string;
  description: string;
  segments: {
    sequenceOrder: number;
    type: 'lodging' | 'attraction' | 'activity' | 'transit' | 'meal';
    title: string;
    startTime?: string;
    endTime?: string;
    durationMins: number;
    cost: number;
    isIncluded: boolean;
    attractionId?: string;
    activityOfferingId?: string;
  }[];
}

export interface AIPlannerResponse {
  planId: string;
  instanceId: string;
  constraints: TravelConstraints;
  itinerary: BookableItineraryItem[];
  totalPrice: number;
  explanations: AIExplanation[];
}
