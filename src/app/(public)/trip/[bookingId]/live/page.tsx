import React from 'react';
import { getLiveTripExecutionDetails } from '@/lib/actions/execution';
import { Phone, Car, Hotel, ShieldAlert, QrCode, WifiOff, CheckCircle2, Clock } from 'lucide-react';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return {
    title: `Live Trip Execution | Booking ${bookingId}`,
    description: 'Access live itinerary timings, assigned driver contact details, emergency phone desk, and redeemable QR vouchers.',
  };
}

export default async function LiveTripPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  const execution = await getLiveTripExecutionDetails(bookingId);

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" />
              Live Execution Active
            </span>
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
              Offline Mode Available
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Trip Companion — {execution.bookingCode}
          </h1>
        </div>

        {/* Driver & Transport Info Card */}
        {execution.driver && (
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4">
            <h3 className="font-heading font-bold text-amber-400 text-sm uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4" />
              Assigned SUV & Driver Details
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-700">
              <div className="space-y-1">
                <span className="font-bold text-white text-base block">{execution.driver.driverName}</span>
                <span className="text-xs text-slate-300 block">{execution.driver.vehicleModel} ({execution.driver.vehicleNumber})</span>
                <span className="text-[11px] text-amber-400 font-semibold">★ {execution.driver.rating} Driver Rating</span>
              </div>

              <a
                href={`tel:${execution.driver.phone}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 w-fit"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Driver
              </a>
            </div>
          </div>
        )}

        {/* QR Vouchers Card */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4">
          <h3 className="font-heading font-bold text-amber-400 text-sm uppercase tracking-wider flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Digital QR Entry Vouchers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {execution.vouchers.map((v) => (
              <div key={v.id} className="bg-white text-slate-900 rounded-2xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{v.vendorName}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
                </div>
                <h4 className="font-heading font-bold text-sm leading-snug">{v.title}</h4>
                <div className="relative w-32 h-32 mx-auto">
                  <Image src={v.qrCodeUrl} alt={v.voucherCode} fill className="object-contain" />
                </div>
                <span className="text-[11px] text-slate-500 block text-center font-mono font-semibold">{v.voucherCode}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Desk */}
        <div className="bg-rose-950/40 rounded-3xl p-6 border border-rose-800/50 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            24/7 SOS Emergency & On-Ground Support Desk
          </div>
          <p className="text-xs text-rose-200 leading-relaxed">
            Need immediate roadside assistance or medical help? Call our hotline for instant dispatch.
          </p>
          <a
            href={`tel:${execution.emergencyContactPhone}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            Call SOS Emergency Helpline
          </a>
        </div>
      </div>
    </main>
  );
}
