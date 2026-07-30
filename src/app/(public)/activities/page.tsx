import React from 'react';
import Image from 'next/image';
import { Sparkles, MapPin, Clock, Tag } from 'lucide-react';

export const metadata = {
  title: 'Experiential Activities & Sightseeing | Friendli Tripz',
  description: 'Book verified activities like Kodai Lake Boating, Toy Train Rides, Bamboo Rafting, and Tea Plantation Tours.',
};

const ACTIVITIES_SAMPLE = [
  {
    id: 'act-1',
    title: 'Kodai Lake 4-Seater Boat Ride',
    destination: 'Kodaikanal',
    duration: '45 mins',
    price: 350,
    category: 'Boating & Watersports',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0',
    description: 'Pre-issued boat club voucher for row boats and pedal boats with mandatory lifejackets.',
  },
  {
    id: 'act-2',
    title: 'Nilgiri Mountain Railway Heritage Ride',
    destination: 'Ooty',
    duration: '2 hours',
    price: 600,
    category: 'Heritage Transit',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
    description: 'First-class reserved toy train seats through tunnels, bridges, and tea valleys.',
  },
  {
    id: 'act-3',
    title: 'Edakkal Caves Prehistoric Exploration',
    destination: 'Wayanad',
    duration: '3 hours',
    price: 450,
    category: 'Trekking & Heritage',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944',
    description: 'Guided trek up Ambukuthi Hills to ancient Neolithic rock engravings.',
  },
];

export default function ActivitiesPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Experiences
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            Unforgettable Travel Activities & Experiences
          </h1>
          <p className="text-slate-600 text-sm">
            All activity offerings are direct-vendor verified with confirmed slots and instant QR vouchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACTIVITIES_SAMPLE.map((act) => (
            <div key={act.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] w-full">
                  <Image src={act.image} alt={act.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {act.destination}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    {act.category}
                  </div>
                  <h3 className="font-heading font-bold text-slate-900 text-base leading-snug">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {act.duration}
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  ₹{act.price} <span className="text-xs font-normal text-slate-500">/ person</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
