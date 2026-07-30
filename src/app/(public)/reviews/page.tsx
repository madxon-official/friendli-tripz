import React from 'react';
import Image from 'next/image';
import { getReviewsForPackage } from '@/lib/actions/reviews';
import { Star, ThumbsUp, CheckCircle, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Traveller Reviews & Ratings | Friendli Tripz',
  description: 'Read authentic verified customer reviews, photos, hotel ratings, and guide feedback.',
};

export default async function ReviewsPage() {
  const reviews = await getReviewsForPackage('11111111-1111-1111-1111-111111111101');

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-1 text-amber-500">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
            Real Traveller Reviews & Photos
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Every review is tied to a verified booking contract to guarantee 100% authenticity.
          </p>
        </div>

        <div className="space-y-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                    {rev.reviewerName[0]}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{rev.reviewerName}</span>
                    <span className="text-[11px] text-slate-400">Verified Traveller</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading font-bold text-slate-900 text-base">{rev.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{rev.reviewText}</p>
              </div>

              {rev.photoUrls && rev.photoUrls.length > 0 && (
                <div className="flex gap-3 pt-2">
                  {rev.photoUrls.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200">
                      <Image src={url} alt="Review photo" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
