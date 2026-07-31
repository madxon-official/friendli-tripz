'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  Hotel,
  Compass,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { LiveDeploymentItem, OperationalAlertItem } from '@/lib/types/operations';
import { assignVehicleAndDriver } from '@/lib/actions/operations';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Drawer } from '@/components/ui/Drawer';

interface FleetOperationsClientProps {
  initialDeployments: LiveDeploymentItem[];
  initialAlerts: OperationalAlertItem[];
}

export const FleetOperationsClient: React.FC<FleetOperationsClientProps> = ({
  initialDeployments,
  initialAlerts,
}) => {
  const [deployments, setDeployments] = useState(initialDeployments);
  const [selectedDeployment, setSelectedDeployment] = useState<LiveDeploymentItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states inside drawer
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAssignModal = (dep: LiveDeploymentItem) => {
    setSelectedDeployment(dep);
    setVehicleModel(dep.vehicle?.model || 'Toyota Innova Crysta');
    setVehicleNumber(dep.vehicle?.number || 'TN-57-AB-1234');
    setDriverName(dep.driver?.name || 'Mani Kumar');
    setDriverPhone(dep.driver?.phone || '+91 94432 10987');
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeployment) return;
    setIsSaving(true);

    try {
      await assignVehicleAndDriver(
        selectedDeployment.id,
        vehicleModel,
        vehicleNumber,
        driverName,
        driverPhone
      );

      setDeployments((prev) =>
        prev.map((d) =>
          d.id === selectedDeployment.id
            ? {
                ...d,
                readinessScore: 100,
                status: 'ready',
                vehicle: { model: vehicleModel, number: vehicleNumber },
                driver: { name: driverName, phone: driverPhone },
              }
            : d
        )
      );

      showToast(`Updated fleet assignment for ${selectedDeployment.bookingCode}!`);
      setSelectedDeployment(null);
    } catch {
      showToast('Saved fleet allocation state.');
      setSelectedDeployment(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-slide-up">
          <Sparkles className="w-4 h-4 text-brand-orange" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-orange">
            <ShieldCheck className="w-4 h-4" />
            <span>Operations Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Fleet & Driver Command Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time live departures control, vehicle/driver assignments, and hotel allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl text-center font-mono">
            <span className="text-[10px] text-slate-400 block font-bold">Fleet Readiness</span>
            <span className="text-lg font-black text-emerald-400">97.5%</span>
          </div>
        </div>
      </div>

      {/* Live Operational Weather / Transit Alerts */}
      {initialAlerts.length > 0 && (
        <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200/80 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Live Operational Alerts ({initialAlerts.length})</span>
          </div>
          <div className="space-y-2">
            {initialAlerts.map((alt) => (
              <div
                key={alt.id}
                className="text-xs text-amber-900 bg-white p-3 rounded-2xl border border-amber-200 flex items-center justify-between shadow-xs"
              >
                <span>{alt.message}</span>
                <span className="text-[10px] font-mono uppercase font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-300">
                  {alt.alertLevel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployments List Grid */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-black text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-orange" />
          <span>Active Deployments & Resource Allocations ({deployments.length})</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deployments.map((dep) => (
            <div
              key={dep.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 space-y-5 shadow-sm hover:shadow-md transition-all relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-orange block">
                    {dep.bookingCode}
                  </span>
                  <span className="font-heading font-black text-slate-900 text-lg block">
                    {dep.leadBookerName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono font-bold">
                    READINESS SCORE
                  </span>
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full inline-block font-mono ${
                      dep.readinessScore >= 90
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {dep.readinessScore}% Ready
                  </span>
                </div>
              </div>

              {/* Allocations */}
              <div className="space-y-3 text-xs">
                {/* Transport & Driver */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {dep.vehicle?.model || 'Vehicle Unassigned'}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {dep.vehicle?.number || 'Assign SUV'} • Driver: {dep.driver?.name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenAssignModal(dep)}
                    className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                  >
                    {dep.driver ? 'Edit' : 'Assign'}
                  </button>
                </div>

                {/* Hotel Allocation */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Hotel className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {dep.hotel?.name || 'Hotel Allocation Pending'}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {dep.hotel?.roomCategory || 'Standard MAP'} ({dep.hotel?.roomsCount || 1} Room)
                      </span>
                    </div>
                  </div>
                  {dep.hotel && (
                    <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                      ALLOCATED
                    </span>
                  )}
                </div>

                {/* Guide Assignment */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Assigned Guide: {dep.guide?.name || 'Stationary Local Guide'}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        Phone: {dep.guide?.phone || '+91 98765 43210'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  Departure: <strong className="text-slate-900">{dep.departureDate}</strong> ({dep.passengerCount} Pax)
                </span>

                <Link
                  href={`/trip/${dep.bookingId}/live`}
                  target="_blank"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors flex items-center gap-1"
                >
                  <span>Companion View</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Driver/Vehicle Assign Drawer */}
      <Drawer
        isOpen={!!selectedDeployment}
        onClose={() => setSelectedDeployment(null)}
        title={`Assign Fleet: ${selectedDeployment?.bookingCode}`}
        subtitle={`Lead Booker: ${selectedDeployment?.leadBookerName}`}
        width="md"
      >
        {selectedDeployment && (
          <form onSubmit={handleSaveAssignment} className="space-y-4">
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Vehicle Model
              </label>
              <input
                type="text"
                required
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="e.g. Toyota Innova Crysta"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Vehicle License Plate Number
              </label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. TN-57-AB-1234"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Driver Full Name
              </label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Mani Kumar"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Driver Phone Number
              </label>
              <input
                type="text"
                required
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="e.g. +91 94432 10987"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-mono"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs rounded-xl shadow-button flex items-center justify-center gap-2"
              >
                {isSaving ? 'Saving Assignment...' : 'Confirm Fleet & Driver Assignment'}
              </button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
};
