import React from 'react';
import { getLiveDeployments, getOperationalAlerts } from '@/lib/actions/operations';
import { FleetOperationsClient } from '@/components/admin/operations/FleetOperationsClient';

export const metadata = {
  title: 'Operations Command Center | Friendli Tripz Admin',
  description: 'Real-time live departures control, vehicle/driver assignments, hotel allocations, rooming lists, emergency alerts, and departure readiness scores.',
};

export default async function OperationsPage() {
  const deployments = await getLiveDeployments();
  const alerts = await getOperationalAlerts();

  return (
    <FleetOperationsClient initialDeployments={deployments} initialAlerts={alerts} />
  );
}
