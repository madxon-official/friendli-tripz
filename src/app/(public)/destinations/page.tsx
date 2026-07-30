import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Compass, ArrowRight } from 'lucide-react';
import { SEOStructuredData } from '@/components/public/SEOStructuredData';

export const metadata = {
  title: 'Top Travel Destinations in South India | Friendli Tripz',
  description: 'Explore hand-crafted holiday destinations in Kodaikanal, Ooty, Wayanad, Coorg, and Munnar with Friendli Tripz.',
};

const DESTINATIONS_DATA = [
  {
    id: 'kodai',
    name: 'Kodaikanal',
    state: 'Tamil Nadu',
    slug: 'kodaikanal',
    tagline: 'Princess of Hill Stations',
    description: 'Tranquil lakes, misty valleys, pine forests, and cool mountain breezes.',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0',
    packageCount: 6,
    avgPrice: '₹12,500',
  },
  {
    id: 'ooty',
    name: 'Ooty',
    state: 'Tamil Nadu',
    slug: 'ooty',
    tagline: 'Queen of Hill Stations',
    description: 'Heritage UNESCO mountain railway, tea estates, and botanical wonderlands.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
    packageCount: 5,
    avgPrice: '₹11,900',
  },
  {
    id: 'wayanad',
    name: 'Wayanad',
    state: 'Kerala',
    slug: 'wayanad',
    tagline: 'Land of Paddy Fields & Waterfalls',
    description: 'Jungle treehouses, prehistoric caves, spice plantations, and bamboo rafting.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944',
    packageCount: 4,
    avgPrice: '₹14,200',
  },
  {
    id: 'coorg',
    name: 'Coorg',
    state: 'Karnataka',
    slug: 'coorg',
    tagline: 'Scotland of India',
    description: 'Coffee plantations, elephant camps, cascading waterfalls, and Kodava culture.',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b',
    packageCount: 5,
    avgPrice: '₹13,500',
  },
];

export default function DestinationsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Friendli Tripz Top Destinations',
    itemListElement: DESTINATIONS_DATA.map((dest, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: dest.name,
      url: `https://friendlitripz.com/destinations#${dest.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEOStructuredData data={jsonLd} />
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Compass className="w-3.5 h-3.5" />
            Curated Hill Stations & Escapes
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Discover South India’s Most Magical Destinations
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Every destination is pre-audited with verified local partners, boutique stays, and curated activity itineraries.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {DESTINATIONS_DATA.map((dest) => (
            <div key={dest.id} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row">
              <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {dest.state}
                </div>
              </div>

              <div className="p-6 md:w-1/2 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    {dest.tagline}
                  </span>
                  <h2 className="font-heading text-xl font-bold text-slate-900">
                    {dest.name}
                  </h2>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Starting from</span>
                    <span className="text-base font-bold text-slate-900">{dest.avgPrice}</span>
                  </div>
                  <Link
                    href={`/packages?destinationSlug=${dest.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-medium text-xs transition-colors"
                  >
                    View Packages
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
