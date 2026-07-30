import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogBySlug } from '@/lib/actions/blog';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: 'Blog Post Not Found | Friendli Tripz' };
  return {
    title: `${blog.title} | Friendli Tripz`,
    description: blog.excerpt,
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto space-y-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all blogs
        </Link>

        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {blog.author_name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.published_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-2 pt-2">
            {blog.tags.map((t, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                <Tag className="w-3 h-3 text-amber-500" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {blog.featured_image_url && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-sm">
            <Image src={blog.featured_image_url} alt={blog.title} fill className="object-cover" />
          </div>
        )}

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
          <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {blog.excerpt}
          </p>
          <div className="whitespace-pre-line text-sm sm:text-base">
            {blog.content_markdown}
          </div>
        </div>
      </article>
    </main>
  );
}
