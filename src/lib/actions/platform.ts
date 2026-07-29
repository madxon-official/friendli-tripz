'use me';
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DomainEvent } from '@/lib/types/platform';

// 1. Publish Domain Event to Platform Event Bus
export async function publishDomainEvent(event: DomainEvent) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('platform_domain_events')
    .insert({
      event_name: event.event_name,
      aggregate_type: event.aggregate_type,
      aggregate_id: event.aggregate_id,
      event_payload_json: event.event_payload_json,
    })
    .select()
    .single();

  if (error) throw new Error(`Event publication failed: ${error.message}`);
  return data;
}

// 2. Fetch Business Capabilities
export async function getBusinessCapabilities() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('business_capability_registry').select('*').order('category');
  if (error) throw new Error(error.message);
  return data || [];
}

// 3. Record AI Plan Explanation
export async function recordAIExplanation(planId: string, reasoningType: string, explanationText: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('ai_plan_explanations')
    .insert({
      plan_id: planId,
      reasoning_type: reasoningType,
      explanation_text: explanationText,
      confidence_score: 0.95,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to record AI explanation: ${error.message}`);
  return data;
}
