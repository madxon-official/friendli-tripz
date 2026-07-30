export interface TourParticipantItem {
  id: string;
  name: string;
  phone: string;
  roomNumber: string;
  dietaryPreference: string;
  medicalAlerts?: string;
  attendanceStatus: 'present' | 'absent' | 'excused';
}

export interface IncidentReportValues {
  deploymentId: string;
  reporterName: string;
  incidentType: 'medical' | 'delay' | 'weather' | 'lost_property' | 'vehicle';
  description: string;
  actionTaken?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
