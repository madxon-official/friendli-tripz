'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supportTicketSchema, SupportTicketValues } from '@/lib/validations/support';
import { createSupportTicket } from '@/lib/actions/support';
import { LifeBuoy, MessageSquare, Send, CheckCircle2, Bot, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupportTicketValues>({
    resolver: zodResolver(supportTicketSchema) as any,
    defaultValues: {
      category: 'booking',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: SupportTicketValues) => {
    const res = await createSupportTicket(data.subject, data.category, data.priority, data.message);
    if (res.success) {
      setSubmittedTicket(res.ticketNumber);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Support Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <LifeBuoy className="w-3.5 h-3.5 text-amber-600" />
            24/7 Customer Support Desk
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            How Can We Assist You Today?
          </h1>
        </div>

        {/* Quick Help Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/knowledge-base" className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-amber-500 transition-all space-y-2 group">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
              Knowledge Base & FAQs
            </h3>
            <p className="text-xs text-slate-500">
              Instant answers about booking policies, refund rules, and travel vouchers.
            </p>
          </Link>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Friendli AI Live Assistant
            </h3>
            <p className="text-xs text-slate-500">
              Get instant automated assistance for itinerary modifications or driver details.
            </p>
          </div>
        </div>

        {/* Ticket Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-heading font-bold text-slate-900 text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            Submit Support Ticket & Escalation
          </h3>

          {submittedTicket ? (
            <div className="text-center py-8 space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-heading font-bold text-slate-900 text-lg">Ticket Submitted!</h4>
              <p className="text-xs text-slate-600">
                Ticket reference: <strong>{submittedTicket}</strong>. Our escalation agent will respond within 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                  <input
                    {...register('subject')}
                    placeholder="e.g., Request to change hotel date"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                  {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    {...register('category')}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="booking">Booking Modification</option>
                    <option value="payment">Payment & Deposit</option>
                    <option value="refund">Cancellation & Refund</option>
                    <option value="itinerary">Live Itinerary Issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Description</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Describe your request or issue..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
                {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                Submit Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
