import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedPortfolioBySlug } from '@/lib/store';
import { PortfolioRenderer } from '@/components/templates/PortfolioRenderer';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = getPublishedPortfolioBySlug(params.slug);
  if (!result) {
    return {
      title: 'Portfolio Not Found — Folio',
    };
  }

  const { portfolio } = result;
  return {
    title: portfolio.settings.seoTitle || portfolio.settings.title,
    description: portfolio.settings.seoDescription || portfolio.draftData?.profile?.headline,
    openGraph: {
      title: portfolio.settings.seoTitle || portfolio.settings.title,
      description: portfolio.settings.seoDescription || portfolio.draftData?.profile?.headline,
      images: portfolio.settings.socialImage ? [portfolio.settings.socialImage] : undefined,
    },
  };
}

export default function PublicPortfolioPage({ params }: PageProps) {
  const result = getPublishedPortfolioBySlug(params.slug);

  if (!result || !result.content) {
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
      <PortfolioRenderer content={result.content} isPublic={true} />
    </main>
  );
}
