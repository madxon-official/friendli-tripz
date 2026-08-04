'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, Copy, Check, Compass, ArrowRight, Home } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { fetchTripByReference } from '@/lib/actions/enquiryActions';
import { TripEnquiryRecord } from '@/lib/types/platform';
import { ROUTES } from '@/lib/routes';

export default function EnquiryConfirmationPage() {
  const params = useParams();
  const reference = (params?.reference as string) || '';

  const [trip, setTrip] = useState<TripEnquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (reference) {
      fetchTripByReference(reference).then((res) => {
        setTrip(res);
        setLoading(false);
      });
    }
  }, [reference]);

  const handleCopy = () => {
    if (reference) {
      navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-36 pb-24 flex items-center justify-center">
      <Container className="max-w-2xl">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-elevated animate-fade-in space-y-8">
          {/* Checkmark Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-brand-orange uppercase tracking-widest block mb-1">
              Enquiry Submitted Successfully
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Start Living & Vibing</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Your trip enquiry has been logged! Our dedicated trip planners are reviewing your request to craft a personalized itinerary.
            </p>
          </div>

          {/* Reference ID Card */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl max-w-md mx-auto space-y-3">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">Your Trip Reference ID</span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl md:text-3xl font-extrabold text-white font-mono tracking-wider">{reference}</span>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Copy Reference ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && <span className="text-[10px] text-emerald-400 font-semibold block">Copied to clipboard!</span>}
          </div>

          {/* Status & Response Time Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-left">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Initial Status</span>
              <span className="text-xs font-bold text-brand-orange mt-1 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                {trip?.status || 'Enquiry Received'}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Estimated Response Time</span>
              <span className="text-xs font-bold text-white mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-orange" /> Within 2 to 4 Hours
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href={`/track/${reference}`}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto justify-center shadow-button"
              icon={<Compass className="w-4 h-4" />}
            >
              Track Trip Status
            </Button>

            <Button
              href={ROUTES.HOME}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto justify-center border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900"
              icon={<Home className="w-4 h-4" />}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
