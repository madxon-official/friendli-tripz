import React from 'react';
import { getKnowledgeBaseArticles } from '@/lib/actions/support';
import { BookOpen, Search, FileText } from 'lucide-react';

export const metadata = {
  title: 'Knowledge Base & Help Center | Friendli Tripz',
  description: 'Self-service guides, booking rules, deposit refund policies, and vendor voucher instructions.',
};

export default async function KnowledgeBasePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const articles = await getKnowledgeBaseArticles(q);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            Help Center Knowledge Base
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900">
            Self-Service Guides & Policies
          </h1>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.map((art) => (
            <div key={art.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                {art.category}
              </span>
              <h3 className="font-heading font-bold text-slate-900 text-lg">{art.title}</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{art.summary}</p>
              <div className="pt-2 text-xs font-medium text-slate-500 whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {art.contentMarkdown}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
