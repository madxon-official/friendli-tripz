'use server';

import { createClient } from '@/lib/supabase/server';
import { TourParticipantItem, IncidentReportValues } from '@/lib/types/tour_leader';

export async function getTourGroupRoster(deploymentId: string): Promise<TourParticipantItem[]> {
  return [
    {
      id: 'p-1',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      roomNumber: 'Room 204',
      dietaryPreference: 'Vegetarian',
      medicalAlerts: 'Asthma inhaler carried',
      attendanceStatus: 'present',
    },
    {
      id: 'p-2',
      name: 'Priya Sharma',
      phone: '+91 98765 43211',
      roomNumber: 'Room 204',
      dietaryPreference: 'Vegetarian',
      attendanceStatus: 'present',
    }
  ];
}

export async function submitIncidentReport(payload: IncidentReportValues): Promise<{ success: boolean }> {
  const supabase = await createClient();
  try {
    await supabase.from('incident_reports').insert({
      deployment_id: payload.deploymentId,
      reporter_name: payload.reporterName,
      incident_type: payload.incidentType,
      description: payload.description,
      action_taken: payload.actionTaken || '',
      severity: payload.severity,
    });
  } catch (e) {}

  return { success: true };
}
