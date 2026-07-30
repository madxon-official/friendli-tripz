import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPublishedBlogs } from '@/lib/actions/blog';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Travel Guides & Stories | Friendli Tripz Blog',
  description: 'Read curated travel guides, packing tips, and local insider advice for South India hill stations.',
};

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <BookOpen className="w-3.5 h-3.5" />
            Insider Travel Knowledge
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            Travel Stories, Guides & Tips
          </h1>
          <p className="text-slate-600 text-sm">
            Everything you need to plan your next memorable hill station escape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={blog.featured_image_url || 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0'}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {blog.author_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(blog.published_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="font-heading text-xl font-bold text-slate-900 hover:text-amber-600 transition-colors">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {blog.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
