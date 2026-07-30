'use server';

import { createClient } from '@/lib/supabase/server';
import { IncrementalReplannerPayload, IncrementalReplannerResponse, AffectedNode } from '@/lib/types/customization';

export async function recalculateCustomizedItinerary(
  payload: IncrementalReplannerPayload
): Promise<IncrementalReplannerResponse> {
  const supabase = await createClient();

  // Fetch current package instance
  const { data: instance, error } = await supabase
    .from('package_instances')
    .select('*')
    .eq('id', payload.instanceId)
    .single();

  if (error || !instance) {
    // Fallback recalculation response if instance mock
    return generateFallbackRecalculation(payload);
  }

  const affectedNodes: AffectedNode[] = [];
  let priceDiff = 0;

  // Process edits incrementally
  for (const edit of payload.edits) {
    if (edit.action === 'swap_hotel') {
      const prevCost = 6500;
      const newCost = edit.newCost || 8500;
      const diff = newCost - prevCost;
      priceDiff += diff;
      affectedNodes.push({
        nodeId: edit.segmentId,
        nodeType: 'hotel',
        previousCost: prevCost,
        newCost: newCost,
        recalculatedReason: `Upgraded hotel room to Premium Valley View (+₹${diff.toLocaleString('en-IN')})`
      });
    } else if (edit.action === 'swap_activity') {
      const prevCost = 350;
      const newCost = edit.newCost || 750;
      const diff = newCost - prevCost;
      priceDiff += diff;
      affectedNodes.push({
        nodeId: edit.segmentId,
        nodeType: 'activity',
        previousCost: prevCost,
        newCost: newCost,
        recalculatedReason: `Swapped activity to ${edit.newTitle || 'Zipline Adventure'} (+₹${diff.toLocaleString('en-IN')})`
      });
    }
  }

  const baseGross = (instance.custom_pricing_tree_json?.base_adult_price || 14500) * (payload.passengerCount || 2);
  const newTotalGross = baseGross + priceDiff;
  const newTotalTax = Math.round(newTotalGross * 0.05);

  // Update instance pricing in database
  await supabase
    .from('package_instances')
    .update({
      custom_pricing_tree_json: {
        ...instance.custom_pricing_tree_json,
        total_gross: newTotalGross,
        total_tax: newTotalTax,
        edits: payload.edits
      },
      price_drift_detected: true
    })
    .eq('id', payload.instanceId);

  return {
    success: true,
    instanceId: payload.instanceId,
    affectedNodes,
    newTotalGross,
    newTotalTax,
    priceDiff,
    updatedItineraryDays: []
  };
}

function generateFallbackRecalculation(payload: IncrementalReplannerPayload): IncrementalReplannerResponse {
  const affectedNodes: AffectedNode[] = payload.edits.map(e => ({
    nodeId: e.segmentId,
    nodeType: e.action.includes('hotel') ? 'hotel' : 'activity',
    previousCost: 350,
    newCost: e.newCost || 750,
    recalculatedReason: `Incremental update: ${e.action} recalculated only node ${e.segmentId}`
  }));

  const priceDiff = affectedNodes.reduce((acc, curr) => acc + (curr.newCost - curr.previousCost), 0);
  const baseGross = 29000;
  const newTotalGross = baseGross + priceDiff;
  const newTotalTax = Math.round(newTotalGross * 0.05);

  return {
    success: true,
    instanceId: payload.instanceId,
    affectedNodes,
    newTotalGross,
    newTotalTax,
    priceDiff,
    updatedItineraryDays: []
  };
}
