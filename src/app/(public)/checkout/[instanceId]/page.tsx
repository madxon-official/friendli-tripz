'use client';

import React, { useState, use } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormSchema, CheckoutFormValues } from '@/lib/validations/checkout';
import { processBookingCheckout } from '@/lib/actions/checkout';
import { BookingCheckoutResult } from '@/lib/types/checkout';
import { ShieldCheck, User, CreditCard, CheckCircle2, Lock, Sparkles, FileText, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage({ params }: { params: Promise<{ instanceId: string }> }) {
  const { instanceId } = use(params);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingCheckoutResult | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema) as any,
    defaultValues: {
      leadBookerName: 'Rahul Sharma',
      leadBookerEmail: 'rahul.sharma@example.com',
      leadBookerPhone: '+91 98765 43210',
      startDate: '2026-10-15',
      depositPercentage: 25,
      passengers: [
        { firstName: 'Rahul', lastName: 'Sharma', age: 34, gender: 'male', dietaryPreference: 'vegetarian', idDocumentType: 'aadhaar', idDocumentNumber: '1234-5678-9012' },
        { firstName: 'Priya', lastName: 'Sharma', age: 32, gender: 'female', dietaryPreference: 'vegetarian', idDocumentType: 'passport', idDocumentNumber: 'Z1234567' }
      ]
    }
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'passengers',
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setLoading(true);
    const checkoutResult = await processBookingCheckout({
      instanceId,
      leadBookerName: data.leadBookerName,
      leadBookerEmail: data.leadBookerEmail,
      leadBookerPhone: data.leadBookerPhone,
      startDate: data.startDate,
      endDate: '2026-10-18',
      passengerCount: data.passengers.length,
      passengers: data.passengers as any,
      couponCode: data.couponCode,
      gstNumber: data.gstNumber,
      specialRequests: data.specialRequests,
      depositPercentage: data.depositPercentage,
    });

    setResult(checkoutResult);
    setLoading(false);
    setStep(3);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Checkout Header Stepper */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-xl font-bold text-slate-900">
              Friendli Checkout Engine
            </h1>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              256-bit Encrypted Vault
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <div className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all ${
              step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              1. Bookers & Passengers
            </div>
            <div className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all ${
              step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              2. Deposit & Summary
            </div>
            <div className={`flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all ${
              step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              3. Instant Confirmation
            </div>
          </div>
        </div>

        {/* Step 1 & 2 Form */}
        {step < 3 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-slate-900 text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-500" />
                  Lead Booker Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                    <input
                      {...register('leadBookerName')}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    {errors.leadBookerName && <p className="text-xs text-rose-500 mt-1">{errors.leadBookerName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                    <input
                      {...register('leadBookerEmail')}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
                    <input
                      {...register('leadBookerPhone')}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Passenger Roster */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-slate-900 text-base">Passenger Roster ({fields.length})</h3>
                    <button
                      type="button"
                      onClick={() => append({ firstName: '', lastName: '', age: 25, gender: 'male', dietaryPreference: 'vegetarian' })}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700"
                    >
                      + Add Passenger
                    </button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, idx) => (
                      <div key={field.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                        <span className="text-xs font-bold text-slate-800">Passenger #{idx + 1}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <input
                            {...register(`passengers.${idx}.firstName`)}
                            placeholder="First Name"
                            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                          <input
                            {...register(`passengers.${idx}.lastName`)}
                            placeholder="Last Name"
                            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                          <input
                            type="number"
                            {...register(`passengers.${idx}.age`)}
                            placeholder="Age"
                            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                          <select
                            {...register(`passengers.${idx}.dietaryPreference`)}
                            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          >
                            <option value="vegetarian">Vegetarian</option>
                            <option value="non_vegetarian">Non-Vegetarian</option>
                            <option value="jain">Jain Food</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-8 py-3 rounded-2xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center gap-2"
                  >
                    Next: Deposit & Summary
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-slate-900 text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  Payment Deposit Option
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="p-4 rounded-2xl border-2 border-amber-500 bg-amber-50/50 cursor-pointer space-y-1">
                    <span className="font-bold text-slate-900 text-sm block">Pay 25% Deposit Now</span>
                    <span className="text-xs text-slate-600 block">Pay ₹7,612 today to lock inventory; balance due 3 days before start.</span>
                  </label>
                  <label className="p-4 rounded-2xl border border-slate-200 text-slate-600 cursor-pointer space-y-1">
                    <span className="font-bold text-slate-900 text-sm block">Pay Full Amount (100%)</span>
                    <span className="text-xs text-slate-500 block">Pay ₹30,450 full contract amount immediately.</span>
                  </label>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Base Tour Package Price</span>
                    <span className="font-bold text-slate-900">₹29,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-bold text-slate-900">₹1,450</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
                    <span>Total Contract Value</span>
                    <span>₹30,450</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Back to Passengers
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4 text-amber-400" />}
                    Confirm & Reserve Inventory
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Step 3 Confirmation */}
        {step === 3 && result && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Booking Confirmed & Inventory Held
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900">
                Booking Reference: {result.bookingCode}
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your deposit of ₹{result.depositAmount.toLocaleString('en-IN')} has been authorized. Confirmation SMS & WhatsApp sent to your phone.
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Link
                href="/trip"
                className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-amber-600 transition-colors"
              >
                Track Booking Details
              </Link>
              <Link
                href={`/trip/${result.bookingId}/live`}
                className="px-6 py-3 rounded-2xl bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs hover:bg-amber-100 transition-colors"
              >
                View Live Trip Execution
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
