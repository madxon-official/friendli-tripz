import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getReviewsForPackage } from '@/lib/actions/reviews';
import { Star, CheckCircle2, MessageSquare, Sparkles, Send, Compass, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'Verified Traveller Reviews & Stories | Friendli Tripz',
  description: 'Read authentic verified customer reviews, photos, hotel ratings, and guide feedback.',
};

export default async function ReviewsPage() {
  const reviews = await getReviewsForPackage('11111111-1111-1111-1111-111111111101');

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-4xl">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-orange text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Verified Customer Stories</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Real Traveller Reviews & Photos
          </h1>

          <p className="text-slate-400 text-base leading-relaxed">
            Every review is tied to a verified booking contract to guarantee 100% authenticity and real human feedback.
          </p>
        </div>

        {/* Rating Summary Telemetry Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-elevated">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex flex-col items-center justify-center font-extrabold shrink-0">
              <span className="text-2xl font-mono leading-none">4.9</span>
              <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">OUT OF 5</span>
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <h2 className="text-white font-extrabold text-sm">Top-Rated Group Travel Experience</h2>
              <p className="text-xs text-slate-400 mt-0.5">Based on verified bookings across Kodaikanal, Ooty, Coorg & Wayanad</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Contracts</span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-elevated space-y-4 transition-all hover:border-slate-700">
              {/* Header: Reviewer & Rating */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange font-extrabold text-sm flex items-center justify-center shrink-0">
                    {rev.reviewerName[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">{rev.reviewerName}</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Traveller
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Verified Trip Experience</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              {/* Title & Review Text */}
              <div className="space-y-2">
                <h3 className="font-heading font-extrabold text-white text-base sm:text-lg">{rev.title}</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{rev.reviewText}</p>
              </div>

              {/* Review Photos */}
              {rev.photoUrls && rev.photoUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {rev.photoUrls.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                      <Image src={url} alt="Traveller photo" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-elevated">
          <h2 className="text-2xl font-extrabold text-white">Ready for your own unforgettable trip?</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Tell us your travel vibe, group size, and destination preference. No password setup required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={ROUTES.ENQUIRE}
              className="px-6 py-3 rounded-2xl bg-brand-orange text-white font-extrabold text-xs shadow-button hover:bg-brand-orange/90 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Trip Enquiry
            </Link>
            <Link
              href={ROUTES.PLANNER}
              className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-extrabold text-xs transition-all flex items-center gap-2 border border-slate-700"
            >
              <Compass className="w-4 h-4 text-brand-orange" /> Custom AI Planner
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
