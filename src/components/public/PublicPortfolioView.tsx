'use client';

import React, { useEffect, useState } from 'react';
import { Portfolio, PortfolioContent } from '@/lib/types';
import { getPublishedPortfolioBySlug } from '@/lib/data-service';
import { PortfolioRenderer } from '@/components/templates/PortfolioRenderer';
import Link from 'next/link';

interface PublicPortfolioViewProps {
  slug: string;
}

export function PublicPortfolioView({ slug }: PublicPortfolioViewProps) {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!slug) {
      setIsLoaded(true);
      return;
    }
    const result = getPublishedPortfolioBySlug(slug);
    if (result && result.content) {
      setContent(result.content);
    }
    setIsLoaded(true);
  }, [slug]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center text-2xl font-bold mb-4">
          404
        </div>
        <h1 className="text-xl font-bold text-slate-900">Portfolio Not Found or Private</h1>
        <p className="text-sm text-slate-600 max-w-sm mt-2 leading-relaxed">
          The requested portfolio is either unpublished or does not exist. If you are the owner, make sure you have published your updates from the Folio editor.
        </p>
        <Link
          href="/"
          className="mt-6 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Return to Folio
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-surface">
      <PortfolioRenderer content={content} isPublic={true} />
    </main>
  );
}
