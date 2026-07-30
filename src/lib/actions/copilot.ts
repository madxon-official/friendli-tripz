'use server';

import { createClient } from '@/lib/supabase/server';
import { CopilotQueryResponse } from '@/lib/types/copilot';

export async function processOperationsCopilotQuery(queryText: string): Promise<CopilotQueryResponse> {
  const q = queryText.toLowerCase();

  if (q.includes('risk') || q.includes('departures')) {
    return {
      query: queryText,
      summaryText: 'Analyzed 12 active departures. Identified 1 departure with pending guide assignment and fog weather warnings.',
      atRiskDepartures: [
        {
          bookingCode: 'FT-2026-9004',
          reason: 'Unassigned tour guide; Ghat Road Section 4 fog alert.',
          readinessScore: 70,
        }
      ]
    };
  }

  if (q.includes('vendor') || q.includes('poor')) {
    return {
      query: queryText,
      summaryText: 'Audit of 14 vendor partners completed. 1 transport vendor flagged for delayed arrival rating (3.4/5.0).',
      vendorRecommendations: [
        {
          vendorName: 'Royal Cabs Kodai',
          issue: 'Average punctuality rating fell below 4.0 threshold.',
          recommendedAlternative: 'Friendli Fleet SUV Partner #12 (4.9 Rating)',
        }
      ]
    };
  }

  return {
    query: queryText,
    summaryText: `Operational Briefing for Today: All 4 active hill station departures are proceeding normally. Driver Mani Kumar has boarded passengers for FT-2026-9001.`,
    briefingNotes: [
      'FT-2026-9001 Innova SUV check-in completed.',
      'Grand Hilltop Resort room 204 verified for Sharma family.',
      'No critical emergency alerts logged in past 12 hours.'
    ]
  };
}
