'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowLeft, MessageSquare } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { IMAGE_REGISTRY } from '@/lib/constants/imageRegistry';
import { ROUTES } from '@/lib/routes';

const BLOG_ARTICLES: Record<string, { title: string; category: string; excerpt: string; content: string; cover_image: string; author_name: string; read_time_minutes: number }> = {
  'hidden-spots-kodaikanal': {
    title: '7 Secret Offbeat Trails in Kodaikanal You Won’t Find on Google Maps',
    category: 'Destination Guides',
    excerpt: 'Escape the central lake crowds and discover secret pine glades, tranquil sheep farms, and cliffside cafes in Kodai.',
    content: 'Kodaikanal is world famous for its central lake and Coaker’s Walk, but the real magic lies beyond the town center. Head 30km west toward Mannavanur to witness vast rolling green meadows reminiscent of alpine pastures...',
    cover_image: IMAGE_REGISTRY.kodaikanal.cover,
    author_name: 'Friendli Explorer Team',
    read_time_minutes: 5,
  },
  'ooty-toy-train-guide': {
    title: 'Why Ooty Toy Train is a Must-Do Heritage Journey',
    category: 'Heritage',
    excerpt: 'Everything you need to know about booking and riding the UNESCO Nilgiri Mountain Railway.',
    content: 'Surrounded by misty blue mountains and eucalyptus forests, the Nilgiri Toy Train offers an unhurried window into South India hill heritage...',
    cover_image: IMAGE_REGISTRY.ooty.cover,
    author_name: 'Vibe Architect',
    read_time_minutes: 4,
  },
  'valparai-hairpin-guide': {
    title: 'Conquering the 40 Hairpin Bends of Valparai',
    category: 'Travel Tips',
    excerpt: 'A complete road trip guide to driving from Pollachi up the Anamalai rainforest plateau to Valparai.',
    content: 'Valparai offers one of the most thrilling ghat climbs in Tamil Nadu with 40 hairpin bends overlooking Aliyar reservoir...',
    cover_image: IMAGE_REGISTRY.valparai.cover,
    author_name: 'Friendli Explorer Team',
    read_time_minutes: 6,
  },
};

export default function BlogDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'hidden-spots-kodaikanal';

  const blog = BLOG_ARTICLES[slug] || BLOG_ARTICLES['hidden-spots-kodaikanal'];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-4xl">
        <Link href={ROUTES.BLOGS} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Guides
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            {blog.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4">{blog.title}</h1>

          <div className="flex items-center gap-4 text-xs text-slate-400 mt-4 border-b border-slate-800 pb-6">
            <span>Written by <strong className="text-slate-200">{blog.author_name}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-orange" /> {blog.read_time_minutes} min read</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-[450px] w-full rounded-3xl overflow-hidden mb-10 border border-slate-800 bg-slate-950">
          <Image src={blog.cover_image} alt={blog.title} fill className="object-cover" priority />
        </div>

        {/* Content Body */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 text-slate-200 space-y-6 leading-relaxed text-base">
          <p className="text-lg font-medium text-slate-100">{blog.excerpt}</p>
          <p>{blog.content}</p>
          <p>
            When traveling with Friendli Tripz, you get access to local hosts who share hidden paths, private view points, and authentic local food stalls away from routine commercial tourist hubs across Kodaikanal, Ooty, and Valparai.
          </p>
        </div>

        {/* Bottom Enquiry Callout */}
        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold text-white mb-2">Inspired to experience this vibe?</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6">Plan a custom trip with your squad without password or payment friction.</p>
          <Link
            href={ROUTES.ENQUIRE}
            className="bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors shadow-button flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Submit Trip Enquiry
          </Link>
        </div>
      </Container>
    </div>
  );
}
