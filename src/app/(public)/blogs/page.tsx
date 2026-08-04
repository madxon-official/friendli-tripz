'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { IMAGE_REGISTRY } from '@/lib/constants/imageRegistry';

const PUBLIC_BLOGS = [
  {
    id: 'blog-1',
    title: '7 Secret Offbeat Trails in Kodaikanal You Won’t Find on Google Maps',
    slug: 'hidden-spots-kodaikanal',
    category: 'Destination Guides',
    excerpt: 'Escape the central lake crowds and discover secret pine glades, tranquil sheep farms, and cliffside cafes in Kodai.',
    content: 'Kodaikanal is world famous for its central lake and Coaker’s Walk, but the real magic lies beyond the town center...',
    cover_image: IMAGE_REGISTRY.kodaikanal.cover,
    author_name: 'Friendli Explorer Team',
    read_time_minutes: 5,
    related_destination_slugs: ['kodaikanal'],
    published_at: '2026-08-01T00:00:00Z'
  },
  {
    id: 'blog-2',
    title: 'Why Ooty Toy Train is a Must-Do Heritage Journey',
    slug: 'ooty-toy-train-guide',
    category: 'Heritage',
    excerpt: 'Everything you need to know about booking and riding the UNESCO Nilgiri Mountain Railway.',
    content: 'Surrounded by misty blue mountains and eucalyptus forests, the Nilgiri Toy Train offers an unhurried window into South India hill heritage...',
    cover_image: IMAGE_REGISTRY.ooty.cover,
    author_name: 'Vibe Architect',
    read_time_minutes: 4,
    related_destination_slugs: ['ooty'],
    published_at: '2026-08-02T00:00:00Z'
  },
  {
    id: 'blog-3',
    title: 'Conquering the 40 Hairpin Bends of Valparai',
    slug: 'valparai-hairpin-guide',
    category: 'Travel Tips',
    excerpt: 'A complete road trip guide to driving from Pollachi up the Anamalai rainforest plateau to Valparai.',
    content: 'Valparai offers one of the most thrilling ghat climbs in Tamil Nadu with 40 hairpin bends overlooking Aliyar reservoir...',
    cover_image: IMAGE_REGISTRY.valparai.cover,
    author_name: 'Friendli Explorer Team',
    read_time_minutes: 6,
    related_destination_slugs: ['valparai'],
    published_at: '2026-08-03T00:00:00Z'
  }
];

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Travel Tips', 'Destination Guides', 'Heritage'];

  const filtered = selectedCategory === 'All'
    ? PUBLIC_BLOGS
    : PUBLIC_BLOGS.filter((b) => b.category === selectedCategory);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Insider Travel Guides</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Travel Stories & Guides</h1>
          <p className="text-slate-400 text-base mt-3">
            Offbeat spots, packing checklists, local food recommendations, and budget tips from our trip leaders in Kodaikanal, Ooty, and Valparai.
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-brand-orange text-white border-brand-orange'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-card"
            >
              <div>
                <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-6 bg-slate-950">
                  <Image src={blog.cover_image} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-semibold px-3 py-1 rounded-full text-brand-orange">
                    {blog.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <span>{blog.author_name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-brand-orange" /> {blog.read_time_minutes} min read</span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors mb-2">
                  {blog.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">{blog.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-brand-orange flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Full Guide <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
