export interface DomainEvent {
  id?: string;
  event_name: string;
  aggregate_type: string;
  aggregate_id: string;
  event_payload_json: any;
  published_at?: string;
}

export interface BusinessCapability {
  id: string;
  capability_name: string;
  category: string;
  is_active: boolean;
  config_json?: any;
}

export interface AIPlanExplanation {
  id?: string;
  plan_id: string;
  reasoning_type: string;
  explanation_text: string;
  confidence_score?: number;
  created_at?: string;
}
