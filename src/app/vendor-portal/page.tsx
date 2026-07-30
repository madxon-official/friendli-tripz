'use client';

import React, { useState } from 'react';
import { QrCode, CheckCircle2, DollarSign, Calendar, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import { getVendorServiceOrders, validateVendorQRVoucher } from '@/lib/actions/vendor_portal';
import { VendorServiceOrder } from '@/lib/types/vendor';

export default function VendorPortalPage() {
  const [voucherInput, setVoucherInput] = useState('');
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const handleScanVoucher = async () => {
    if (!voucherInput.trim()) return;
    const res = await validateVendorQRVoucher(voucherInput);
    setValidationResult(res.message);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              Vendor Partner Portal
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900">
              Kodai Boat Club Partner Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">Pending Settlement</span>
              <span className="text-lg font-extrabold text-slate-900">₹14,850</span>
            </div>
          </div>
        </div>

        {/* QR Validator Tool */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <QrCode className="w-5 h-5" />
            Instant QR Voucher Validation Desk
          </div>

          <p className="text-xs text-slate-300">
            Scan or type customer voucher code to validate entry passes and authorize service orders offline.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value)}
              placeholder="e.g., VOUCH-KODAI-BOAT-9001"
              className="w-full text-sm p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 font-mono"
            />
            <button
              onClick={handleScanVoucher}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-md"
            >
              Validate Voucher
            </button>
          </div>

          {validationResult && (
            <div className="p-3.5 bg-emerald-500/20 rounded-2xl border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {validationResult}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
