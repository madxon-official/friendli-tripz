'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormValues } from '@/lib/validations/discovery';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema) as any,
    defaultValues: {
      travellerCount: 2,
      destination: 'Kodaikanal',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Submit contact enquiry
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
            Get in Touch with Friendli Tripz
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Have custom trip requirements or group bookings? Contact our 24/7 travel planning desk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-xl text-amber-400">Contact Info</h3>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-white">+91 98765 43210</span>
                    <span className="text-xs text-slate-400">Mon-Sun: 9:00 AM - 9:00 PM</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-white">support@friendlitripz.com</span>
                    <span className="text-xs text-slate-400">24/7 Response Time</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-white">Friendli Travel HQ</span>
                    <span className="text-xs text-slate-400">Kodaikanal Lake Road, Tamil Nadu, India</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-xs text-slate-400">
              Approved & Registered Travel Engine Partner
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-heading font-bold text-2xl text-slate-900">Enquiry Submitted!</h3>
                <p className="text-sm text-slate-600">
                  Thank you! Our travel expert will get back to you within 30 minutes with a customized quote.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                    <input
                      {...register('name')}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="Rahul Sharma"
                    />
                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                    <input
                      {...register('email')}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="rahul@example.com"
                    />
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                    <input
                      {...register('phone')}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination</label>
                    <select
                      {...register('destination')}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                    >
                      <option value="Kodaikanal">Kodaikanal</option>
                      <option value="Ooty">Ooty</option>
                      <option value="Wayanad">Wayanad</option>
                      <option value="Coorg">Coorg</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Special Requirements / Notes</label>
                  <textarea
                    {...register('notes')}
                    rows={4}
                    className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="Mention preferred dates, hotel choices, or special requests..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Submit Travel Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
